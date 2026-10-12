import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { openDatabase } from '../server/database.mjs';
import { createApp } from '../server/webapp.mjs';
import { demoPassword, demoStudentEmail, demoTutorEmail } from '../server/demo-data.mjs';

test('local data supports login, booking, tutor confirmation, and course-labelled review', async t => {
  const directory = mkdtempSync(join(tmpdir(), 'numteach-demo-'));
  const file = join(directory, 'site.sqlite');
  const db = openDatabase(file, { demoData: true });
  const server = createApp(db).listen(0);
  t.after(() => new Promise(resolve => server.close(() => {
    db.close();
    rmSync(directory, { recursive: true, force: true });
    resolve();
  })));
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (path, method = 'GET', payload, cookie = '') => {
    const response = await fetch(base + path, {
      method,
      headers: { ...(payload ? { 'Content-Type': 'application/json' } : {}),
        ...(cookie ? { Cookie: cookie } : {}) },
      body: payload ? JSON.stringify(payload) : undefined,
    });
    return { status: response.status, data: await response.json(),
      cookie: response.headers.get('set-cookie')?.split(';')[0] };
  };
  const directoryListing = await call('/api/teachers');
  assert.equal(directoryListing.status, 200);
  assert.equal(directoryListing.data.length, 10);
  assert.ok(directoryListing.data.every(tutor => tutor.user_id && tutor.next_available_at));
  assert.ok(directoryListing.data.every(tutor => tutor.lessons.length === 2));
  assert.equal(JSON.stringify(directoryListing.data).includes('Жишээ'), false);
  const tutor = (await call('/api/teachers/1')).data.teacher;
  const slots = (await call('/api/teachers/1/slots')).data;
  const slot = slots.find(item => item.available && tutor.lessons.some(lesson =>
    Date.parse(item.ends_at) - Date.parse(item.starts_at) === lesson.duration_minutes * 60000));
  assert.ok(slot);
  const lesson = tutor.lessons.find(item =>
    Date.parse(slot.ends_at) - Date.parse(slot.starts_at) === item.duration_minutes * 60000);
  const student = await call('/api/students/login', 'POST',
    { email: demoStudentEmail, password: demoPassword });
  const teacher = await call('/api/students/login', 'POST',
    { email: demoTutorEmail(1), password: demoPassword });
  assert.equal(student.status, 200);
  assert.equal(teacher.status, 200);
  assert.equal((await call('/api/bookings', 'POST',
    { slot_id: slot.id, lesson_id: lesson.id }, teacher.cookie)).status, 400);
  const booked = await call('/api/bookings', 'POST',
    { slot_id: slot.id, lesson_id: lesson.id }, student.cookie);
  assert.equal(booked.status, 201);
  assert.equal(booked.data.booking.lesson_name, lesson.lesson_name);
  assert.equal((await call('/api/bookings', 'POST',
    { slot_id: slot.id, lesson_id: lesson.id }, student.cookie)).status, 409);
  const bookingId = booked.data.booking.id;
  assert.equal((await call('/api/bookings', 'GET', undefined, teacher.cookie))
    .data.incoming.some(item => item.id === bookingId), true);
  assert.equal((await call(`/api/bookings/${bookingId}`, 'PATCH',
    { status: 'confirmed' }, teacher.cookie)).status, 200);
  // Move the confirmed appointment into the past to exercise the review flow without waiting.
  const pastStart = new Date(Date.now() - 2 * 3600000).toISOString();
  const pastEnd = new Date(Date.now() - 3600000).toISOString();
  db.prepare('UPDATE tutor_slots SET starts_at = ?, ends_at = ? WHERE id = ?')
    .run(pastStart, pastEnd, slot.id);
  assert.equal((await call('/api/reviews', 'POST',
    { booking_id: bookingId, rating: 5, comment: 'Ойлгомжтой тайлбарлаж, бодлого хамт бодсон.' },
    student.cookie)).status, 201);
  const reviewed = (await call('/api/teachers/1')).data.teacher;
  assert.equal(reviewed.number_of_ratings, 1);
  assert.equal(reviewed.feedback[0].lesson_name, lesson.lesson_name);
  assert.equal((await call('/api/teachers/1/reviews')).data[0].lesson_name, lesson.lesson_name);

  const before = db.prepare('SELECT COUNT(*) AS count FROM bookings').get().count;
  const reopened = openDatabase(file, { demoData: true });
  assert.equal(reopened.prepare('SELECT COUNT(*) AS count FROM bookings').get().count, before);
  reopened.close();
});
