import test from 'node:test';
import assert from 'node:assert/strict';
import Mostudent from '../module/mostudent.mjs';

test('registration hashes passwords and login omits the hash', async () => {
  let account;
  const db = {
    async query(sql, values) {
      if (sql.includes('INSERT INTO')) {
        account = { teacher_id: 7, email: values[2], password: values[3] };
        return { rows: [{ teacher_id: 7 }] };
      }
      return { rows: [account] };
    },
  };
  const model = new Mostudent(db);
  await model.registerStudent({ first_name: 'A', last_name: 'B', email: 'a@example.com', password: 'Secret123', phone: '123' });
  assert.match(account.password, /^scrypt:/);
  assert.notEqual(account.password, 'Secret123');
  const result = await model.loginStudent('a@example.com', 'Secret123');
  assert.equal(result.success, true);
  assert.equal('password' in result.student, false);
  assert.equal((await model.loginStudent('a@example.com', 'wrong')).success, false);
});

test('legacy plain text password is upgraded after successful login', async () => {
  const account = { teacher_id: 8, email: 'old@example.com', password: 'OldSecret123' };
  const db = {
    async query(sql, values) {
      if (sql.includes('UPDATE')) account.password = values[0];
      return { rows: [account] };
    },
  };
  const result = await new Mostudent(db).loginStudent(account.email, 'OldSecret123');
  assert.equal(result.success, true);
  assert.match(account.password, /^scrypt:/);
  assert.equal('password' in result.student, false);
});
