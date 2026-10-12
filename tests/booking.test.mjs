import test from 'node:test';
import assert from 'node:assert/strict';
import { openDatabase } from '../server/database.mjs';
import { createApp } from '../server/webapp.mjs';

test('signed-in students book tutor slots and tutors manage them', async t => {
  const db = openDatabase();
  const server = createApp(db).listen(0);
  t.after(() => new Promise(resolve => server.close(() => { db.close(); resolve(); })));
  const base = `http://127.0.0.1:${server.address().port}`;
  async function call(path, method = 'GET', body, cookie = '') {
    const response = await fetch(base + path, {
      method, headers: { ...(body ? { 'content-type': 'application/json' } : {}),
        ...(cookie ? { cookie } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    return { status: response.status, data: await response.json(),
      cookie: response.headers.get('set-cookie')?.split(';')[0] || cookie };
  }
  const tutorUser = await call('/api/students', 'POST', {
    first_name: 'Tutor', last_name: 'Student', email: 'tutor@example.com', password: 'StrongPass123',
  });
  const learner = await call('/api/students', 'POST', {
    first_name: 'Learner', last_name: 'Tutor', email: 'learner@example.com', password: 'StrongPass123',
  });
  const listing = await call('/api/tutor-profile', 'PUT', {
    description: 'Math help', teacher_info: 'NUM student', lesson_info: 'Weekly sessions',
    mode: 'online', price: 10000, lessons: ['Math'],
  }, tutorUser.cookie);
  assert.equal(listing.status, 200);
  const tutorId = listing.data.tutor.teacher_id;
  const start = new Date(Date.now() + 86400000).toISOString();
  const end = new Date(Date.parse(start) + 3600000).toISOString();
  assert.equal((await call('/api/tutor-slots', 'POST', { starts_at: start, ends_at: end })).status, 401);
  const created = await call('/api/tutor-slots', 'POST', { starts_at: start, ends_at: end }, tutorUser.cookie);
  assert.equal(created.status, 201);
  const slotId = created.data.slot.id;
  assert.equal((await call('/api/tutor-slots', 'POST', {
    starts_at: new Date(Date.parse(start) + 1800000).toISOString(), ends_at: end,
  }, tutorUser.cookie)).status, 409);
  assert.equal((await call(`/api/teachers/${tutorId}/slots`)).data[0].available, true);
  assert.equal((await call('/api/bookings', 'POST', { slot_id: slotId, lesson_name: 'Math' })).status, 401);
  assert.equal((await call('/api/bookings', 'POST', { slot_id: slotId, lesson_name: 'Math' }, tutorUser.cookie)).status, 400);
  const [first, second] = await Promise.all([
    call('/api/bookings', 'POST', { slot_id: slotId, lesson_name: 'Math' }, learner.cookie),
    call('/api/bookings', 'POST', { slot_id: slotId, lesson_name: 'Math' }, learner.cookie),
  ]);
  assert.deepEqual([first.status, second.status].sort(), [201, 409]);
  const bookingId = (first.status === 201 ? first : second).data.booking.id;
  assert.equal((await call(`/api/teachers/${tutorId}/slots`)).data[0].available, false);
  assert.equal((await call('/api/bookings', 'GET', undefined, tutorUser.cookie)).data.incoming.length, 1);
  assert.equal((await call(`/api/bookings/${bookingId}`, 'PATCH', { status: 'confirmed' }, learner.cookie)).status, 409);
  assert.equal((await call(`/api/bookings/${bookingId}`, 'PATCH', { status: 'confirmed' }, tutorUser.cookie)).status, 200);
  assert.equal((await call(`/api/tutor-slots/${slotId}`, 'DELETE', undefined, tutorUser.cookie)).status, 409);
  assert.equal((await call(`/api/bookings/${bookingId}`, 'PATCH', { status: 'cancelled' }, learner.cookie)).status, 200);
  assert.equal((await call(`/api/teachers/${tutorId}/slots`)).data[0].available, true);
  assert.equal((await call(`/api/tutor-slots/${slotId}`, 'DELETE', undefined, tutorUser.cookie)).status, 200);

  const secondListing = await call('/api/tutor-profile', 'PUT', {
    description: 'Physics help', teacher_info: 'NUM student', lesson_info: 'Weekly sessions',
    mode: 'hybrid', price: 12000, lessons: ['Physics'],
  }, learner.cookie);
  assert.equal(secondListing.status, 200);
  const secondStart = new Date(Date.now() + 2 * 86400000).toISOString();
  const secondSlot = await call('/api/tutor-slots', 'POST', {
    starts_at: secondStart,
    ends_at: new Date(Date.parse(secondStart) + 3600000).toISOString(),
  }, learner.cookie);
  assert.equal(secondSlot.status, 201);
  assert.equal((await call('/api/bookings', 'POST', {
    slot_id: secondSlot.data.slot.id, lesson_name: 'Physics',
  }, tutorUser.cookie)).status, 201);
  const bothRoles = await call('/api/bookings', 'GET', undefined, tutorUser.cookie);
  assert.equal(bothRoles.data.own.length, 1);
  assert.ok((await call('/api/me', 'GET', undefined, tutorUser.cookie)).data.tutor);
  assert.equal((await call('/api/bookings', 'GET', undefined, learner.cookie)).data.incoming.length, 1);
});
