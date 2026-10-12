import test from 'node:test';
import assert from 'node:assert/strict';
import { openDatabase } from '../server/database.mjs';
import { createApp } from '../server/webapp.mjs';

test('student registration, tutor listing, and contact flow', async t => {
  const db = openDatabase();
  const server = createApp(db).listen(0);
  t.after(() => new Promise(resolve => server.close(() => { db.close(); resolve(); })));
  const base = `http://127.0.0.1:${server.address().port}`;
  let cookie = '';
  async function request(path, method = 'GET', payload, session = cookie) {
    const response = await fetch(base + path, {
      method,
      headers: { ...(payload ? { 'Content-Type': 'application/json' } : {}),
        ...(session ? { Cookie: session } : {}) },
      body: payload ? JSON.stringify(payload) : undefined,
    });
    const raw = await response.text();
    return { response, data: response.headers.get('content-type')?.includes('application/json')
      ? JSON.parse(raw) : raw };
  }

  assert.equal((await request('/api/teachers')).data.length, 0);
  assert.equal((await request('/api/lesson')).data.length, 0);
  assert.equal((await request('/api/teachers/1')).response.status, 404);
  assert.equal((await request('/data/teacher.json')).response.status, 404);
  assert.equal((await request('/data/sample-tutors.json')).response.status, 404);
  assert.equal((await request('/api/teachers/not-an-id')).response.status, 400);
  assert.equal((await request('/api/students', 'POST')).response.status, 400);
  assert.equal((await request('/api/students/login', 'POST')).response.status, 401);
  const malformed = await fetch(base + '/api/students', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{broken',
  });
  assert.equal(malformed.status, 400);
  assert.match(malformed.headers.get('content-type'), /application\/json/);
  assert.equal((await request('/api/messages', 'POST', {
    tutor_id: 1, message: 'Жишээ багшид зурвас илгээх туршилт',
  })).response.status, 401);
  assert.equal((await request('/api/me')).response.status, 401);
  const register = await request('/api/students', 'POST', {
    first_name: 'Ануу', last_name: 'Бат', email: 'anuu@example.com',
    phone: '99112233', password: 'StrongPass123',
  });
  assert.equal(register.response.status, 201);
  cookie = register.response.headers.get('set-cookie').split(';')[0];
  assert.equal(register.data.student.email, 'anuu@example.com');
  assert.equal(JSON.stringify(register.data).includes('password'), false);
  assert.equal((await request('/api/me')).data.student.first_name, 'Ануу');
  assert.equal((await request('/api/messages', 'POST', {
    tutor_id: 1, message: 'Жишээ багшид зурвас илгээх туршилт',
  })).response.status, 400);
  assert.equal((await request('/api/students/login', 'POST', {
    email: 'anuu@example.com', password: 'wrong',
  })).response.status, 401);

  const listing = await request('/api/tutor-profile', 'PUT', {
    description: 'Алгоритмын давтлага', teacher_info: 'Би МУИС-ийн оюутан.',
    lesson_info: 'Долоо хоног бүр хичээллэнэ.', mode: 'online', price: 20000,
    lessons: ['Алгоритм'],
  });
  assert.equal(listing.response.status, 200);
  const tutorId = listing.data.tutor.teacher_id;
  const updatedListing = await request('/api/tutor-profile', 'PUT', {
    description: 'Updated listing', teacher_info: 'NUM student', lesson_info: 'Weekly',
    mode: 'hybrid', price: 25000, lessons: ['Algorithms'],
  });
  assert.equal(updatedListing.response.status, 200);
  assert.equal(updatedListing.data.tutor.teacher_id, tutorId);
  assert.equal((await request('/api/messages', 'POST', {
    tutor_id: 'invalid', message: 'A sufficiently long message',
  })).response.status, 400);
  assert.equal((await request('/api/teachers/search?q=Algorithms')).data.some(tutor =>
    tutor.teacher_id === tutorId), true);
  assert.equal((await request('/api/messages', 'POST', {
    tutor_id: tutorId, message: 'Өөртөө зурвас илгээх оролдлого',
  })).response.status, 400);

  const other = await request('/api/students', 'POST', {
    first_name: 'Болд', last_name: 'Дорж', email: 'bold@example.com',
    password: 'AnotherPass123',
  }, '');
  assert.equal(other.response.status, 201);
  const otherCookie = other.response.headers.get('set-cookie').split(';')[0];
  const sent = await request('/api/messages', 'POST', {
    tutor_id: tutorId, lesson_name: 'Алгоритм',
    message: 'Сайн байна уу, энэ хичээлд бүртгүүлмээр байна.',
  }, otherCookie);
  assert.equal(sent.response.status, 201);
  assert.equal((await request('/api/messages')).data.received.length, 1);
  assert.equal((await request('/api/messages', 'GET', undefined, otherCookie)).data.sent.length, 1);
  assert.equal((await request('/data/numteach.sqlite')).response.status, 404);
  await request('/api/logout', 'POST');
  assert.equal((await request('/api/me')).response.status, 401);
});
