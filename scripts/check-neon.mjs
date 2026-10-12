import { randomUUID } from 'node:crypto';
import { createApp } from '../server/webapp.mjs';
import { openPostgres } from '../server/postgres.mjs';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
const db = await openPostgres(process.env.DATABASE_URL);
const server = createApp(db).listen(0);
const base = `http://127.0.0.1:${server.address().port}`;
const unique = randomUUID();
const tutorEmail = `smoke-tutor-${unique}@example.invalid`;
const studentEmail = `smoke-student-${unique}@example.invalid`;

async function request(path, method = 'GET', payload, cookie = '') {
  const response = await fetch(base + path, {
    method,
    headers: { ...(payload ? { 'content-type': 'application/json' } : {}),
      ...(cookie ? { cookie } : {}) },
    body: payload ? JSON.stringify(payload) : undefined,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(`${method} ${path}: ${response.status} ${data.error}`);
  return { data, cookie: response.headers.get('set-cookie')?.split(';')[0] || cookie };
}

try {
  await request('/api/health');
  const tutor = await request('/api/students', 'POST', {
    first_name: 'Smoke', last_name: 'Tutor', email: tutorEmail, password: 'TemporaryPass123',
  });
  const listing = await request('/api/tutor-profile', 'PUT', {
    description: 'Smoke test tutor', teacher_info: 'Temporary test account',
    lesson_info: 'Temporary test lesson', mode: 'online', price: 1000, lessons: ['Test lesson'],
  }, tutor.cookie);
  const student = await request('/api/students', 'POST', {
    first_name: 'Smoke', last_name: 'Student', email: studentEmail, password: 'TemporaryPass123',
  });
  const startsAt = new Date(Date.now() + 86400000).toISOString();
  const endsAt = new Date(Date.parse(startsAt) + 3600000).toISOString();
  const slot = await request('/api/tutor-slots', 'POST', {
    starts_at: startsAt, ends_at: endsAt,
  }, tutor.cookie);
  const booking = await request('/api/bookings', 'POST', {
    slot_id: slot.data.slot.id, lesson_name: 'Test lesson',
  }, student.cookie);
  await request(`/api/bookings/${booking.data.booking.id}`, 'PATCH', {
    status: 'confirmed',
  }, tutor.cookie);
  const bookings = await request('/api/bookings', 'GET', undefined, student.cookie);
  if (bookings.data.own[0]?.status !== 'confirmed') throw new Error('Booking was not confirmed');
  await request('/api/messages', 'POST', {
    tutor_id: listing.data.tutor.teacher_id,
    lesson_name: 'Test lesson', message: 'This is a temporary Neon smoke test message.',
  }, student.cookie);
  const inbox = await request('/api/messages', 'GET', undefined, tutor.cookie);
  if (inbox.data.received.length !== 1) throw new Error('Inbox did not receive the test message');
  console.log('Neon API smoke test passed: health, registration, listing, slot, booking, confirmation, messaging, inbox');
} finally {
  for (const email of [studentEmail, tutorEmail]) {
    await db.prepare('DELETE FROM users WHERE email = ?').run(email);
  }
  await new Promise(resolve => server.close(resolve));
  await db.close();
}
