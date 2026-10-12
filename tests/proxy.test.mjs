import test from 'node:test';
import assert from 'node:assert/strict';
import proxy from '../api/proxy.js';
import { openDatabase } from '../server/database.mjs';
import { createApp } from '../server/webapp.mjs';

test('Vercel proxy forwards API bodies, queries, and session cookies', async t => {
  const db = openDatabase();
  const server = createApp(db).listen(0);
  t.after(() => new Promise(resolve => server.close(() => { db.close(); resolve(); })));
  process.env.RENDER_API_URL = `http://127.0.0.1:${server.address().port}`;
  t.after(() => { delete process.env.RENDER_API_URL; });
  const call = (path, init) => proxy.fetch(new Request(`https://site.example/api/proxy?path=${path}`, init));
  const listing = await call('teachers%2Fsearch&q=math');
  assert.equal(listing.status, 200);
  assert.ok(Array.isArray(await listing.json()));
  const register = await call('students', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ first_name: 'Anu', last_name: 'Bat', email: 'anu@example.com', password: 'StrongPass123' }),
  });
  assert.equal(register.status, 201);
  const cookie = register.headers.get('set-cookie');
  assert.ok(cookie?.startsWith('numteach_session='));
  const me = await call('me', { headers: { cookie } });
  assert.equal((await me.json()).student.email, 'anu@example.com');
});
