import test from 'node:test';
import assert from 'node:assert/strict';
import { openDatabase } from '../server/database.mjs';
import { createApp } from '../server/webapp.mjs';

test('tutor lessons have independent details and bookings retain the chosen lesson', async t => {
  const db = openDatabase();
  const server = createApp(db).listen(0);
  t.after(() => new Promise(resolve => server.close(() => { db.close(); resolve(); })));
  const base = `http://127.0.0.1:${server.address().port}`;
  async function call(path, method = 'GET', body, cookie = '') {
    const response = await fetch(base + path, {
      method,
      headers: { ...(body ? { 'content-type': 'application/json' } : {}),
        ...(cookie ? { cookie } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    return { status: response.status, data: await response.json(),
      cookie: response.headers.get('set-cookie')?.split(';')[0] || cookie };
  }
  const tutor = await call('/api/students', 'POST', {
    first_name: 'Tutor', last_name: 'User', email: 'lesson-tutor@example.com', password: 'StrongPass123',
  });
  const student = await call('/api/students', 'POST', {
    first_name: 'Student', last_name: 'User', email: 'lesson-student@example.com', password: 'StrongPass123',
  });
  const profile = await call('/api/tutor-profile', 'PUT', {
    description: 'Math and code', teacher_info: 'Teaching experience',
    lesson_info: 'Initial details', mode: 'online', price: 10000,
    lessons: ['Mathematics', 'Programming'],
  }, tutor.cookie);
  assert.equal(profile.status, 200);
  const tutorId = profile.data.tutor.teacher_id;
  const [math, programming] = profile.data.tutor.lessons;
  assert.notEqual(math.id, programming.id);
  assert.equal((await call(`/api/tutor-lessons/${math.id}`, 'PUT', {
    lesson_name: 'Mathematics', course_code: 'MATH101', description: 'Algebra and calculus',
    duration_minutes: 90, mode: 'hybrid',
  }, student.cookie)).status, 404);
  assert.equal((await call(`/api/tutor-lessons/${math.id}`, 'PUT', {
    lesson_name: 'Mathematics', description: 'Algebra and calculus',
    duration_minutes: 15, mode: 'hybrid',
  }, tutor.cookie)).status, 400);
  assert.equal((await call(`/api/tutor-lessons/${math.id}`, 'PUT', {
    lesson_name: 'Mathematics', description: 'Algebra and calculus',
    duration_minutes: 90, price: 25000, mode: 'hybrid',
  }, tutor.cookie)).status, 400);
  const updated = await call(`/api/tutor-lessons/${math.id}`, 'PUT', {
    lesson_name: 'Mathematics', course_code: 'MATH101', description: 'Algebra and calculus',
    duration_minutes: 90, mode: 'hybrid',
  }, tutor.cookie);
  assert.equal(updated.status, 200);
  const detail = await call(`/api/teachers/${tutorId}`);
  assert.equal(detail.data.lessons.find(item => item.id === math.id).description, 'Algebra and calculus');
  assert.equal(detail.data.lessons.find(item => item.id === math.id).price, 15000);
  assert.equal(detail.data.lessons.find(item => item.id === programming.id).price, 10000);
  const shortStart = new Date(Date.now() + 2 * 86400000).toISOString();
  const shortSlot = await call('/api/tutor-slots', 'POST', {
    starts_at: shortStart, ends_at: new Date(Date.parse(shortStart) + 60 * 60000).toISOString(),
  }, tutor.cookie);
  assert.equal((await call('/api/bookings', 'POST', {
    slot_id: shortSlot.data.slot.id, lesson_id: math.id,
  }, student.cookie)).status, 409);
  const start = new Date(Date.now() + 86400000).toISOString();
  const slot = await call('/api/tutor-slots', 'POST', {
    starts_at: start, ends_at: new Date(Date.parse(start) + 90 * 60000).toISOString(),
  }, tutor.cookie);
  const booking = await call('/api/bookings', 'POST', {
    slot_id: slot.data.slot.id, lesson_id: math.id,
  }, student.cookie);
  assert.equal(booking.status, 201);
  assert.equal(booking.data.booking.lesson_id, math.id);
  assert.equal(booking.data.booking.lesson_name, 'Mathematics');
  assert.equal(booking.data.booking.price_amount, 15000);
  assert.equal(booking.data.booking.duration_minutes, 90);
  assert.equal((await call(`/api/tutor-lessons/${math.id}`, 'PUT', {
    lesson_name: 'Mathematics', course_code: 'MATH101', description: 'Algebra and calculus',
    duration_minutes: 90, mode: 'hybrid',
  }, tutor.cookie)).status, 200);
  assert.equal((await call('/api/bookings', 'GET', undefined, student.cookie))
    .data.own[0].price_amount, 15000);
  const repriced = await call('/api/tutor-profile', 'PUT', {
    description: 'Math and code', teacher_info: 'Teaching experience',
    lesson_info: 'Initial details', mode: 'online', price: 12000,
    lessons: ['Mathematics', 'Programming'],
  }, tutor.cookie);
  assert.equal(repriced.status, 200);
  assert.equal(repriced.data.tutor.lessons.find(item => item.id === math.id).price, 18000);
  assert.equal(repriced.data.tutor.lessons.find(item => item.id === programming.id).price, 12000);
  const laterStart = new Date(Date.now() + 3 * 86400000).toISOString();
  const laterSlot = await call('/api/tutor-slots', 'POST', {
    starts_at: laterStart, ends_at: new Date(Date.parse(laterStart) + 90 * 60000).toISOString(),
  }, tutor.cookie);
  assert.equal((await call('/api/bookings', 'POST', {
    slot_id: laterSlot.data.slot.id, lesson_id: math.id, quoted_price: 15000,
  }, student.cookie)).status, 409);
  const laterBooking = await call('/api/bookings', 'POST', {
    slot_id: laterSlot.data.slot.id, lesson_id: math.id, quoted_price: 18000,
  }, student.cookie);
  assert.equal(laterBooking.status, 201);
  assert.equal(laterBooking.data.booking.price_amount, 18000);
  assert.equal((await call('/api/bookings', 'GET', undefined, student.cookie))
    .data.own.find(item => item.id === booking.data.booking.id).price_amount, 15000);
  const bookingId = booking.data.booking.id;
  assert.equal((await call('/api/reviews', 'POST', {
    booking_id: bookingId, rating: 5, comment: 'Clear explanations and useful practice.',
  }, student.cookie)).status, 409);
  assert.equal((await call(`/api/bookings/${bookingId}`, 'PATCH', {
    status: 'confirmed',
  }, tutor.cookie)).status, 200);
  db.prepare('UPDATE tutor_slots SET starts_at = ?, ends_at = ? WHERE id = ?').run(
    new Date(Date.now() - 2 * 3600000).toISOString(),
    new Date(Date.now() - 3600000).toISOString(), slot.data.slot.id
  );
  assert.equal((await call('/api/reviews', 'POST', {
    booking_id: bookingId, rating: 5, comment: 'Clear explanations and useful practice.',
  }, tutor.cookie)).status, 404);
  const review = await call('/api/reviews', 'POST', {
    booking_id: bookingId, rating: 5, comment: 'Clear explanations and useful practice.',
  }, student.cookie);
  assert.equal(review.status, 201);
  assert.equal(review.data.review.lesson_id, math.id);
  assert.equal((await call('/api/reviews', 'POST', {
    booking_id: bookingId, rating: 5, comment: 'Clear explanations and useful practice.',
  }, student.cookie)).status, 409);
  const reviewedDetail = await call(`/api/teachers/${tutorId}`);
  assert.equal(reviewedDetail.data.teacher.number_of_ratings, 1);
  assert.equal(reviewedDetail.data.teacher.retings, 5);
  assert.equal(reviewedDetail.data.teacher.feedback[0].lesson_name, 'Mathematics');
  assert.equal(reviewedDetail.data.lessons.find(item => item.id === programming.id).review_count, undefined);
  assert.equal((await call(`/api/teachers/${tutorId}/reviews`)).data[0].lesson_name, 'Mathematics');
});
