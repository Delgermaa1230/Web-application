import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { openDatabase } from '../server/database.mjs';

test('schema migration initializes once and preserves existing bookings', t => {
  const directory = mkdtempSync(join(tmpdir(), 'numteach-migrate-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const file = join(directory, 'site.sqlite');
  let db = openDatabase(file);
  assert.deepEqual(db.prepare('SELECT version FROM schema_migrations').all().map(row => row.version), [1, 2, 3, 4, 5, 6]);
  db.prepare(`INSERT INTO users (email, password_hash, first_name, last_name)
    VALUES (?, ?, ?, ?)`).run('existing@example.com', 'hash', 'Existing', 'Student');
  const user = db.prepare('SELECT id FROM users WHERE email = ?').get('existing@example.com');
  const tutor = db.prepare(`INSERT INTO tutors (user_id, first_name, last_name)
    VALUES (?, ?, ?) RETURNING teacher_id`).get(user.id, 'Existing', 'Student');
  const slot = db.prepare(`INSERT INTO tutor_slots (tutor_id, starts_at, ends_at)
    VALUES (?, ?, ?) RETURNING id`).get(tutor.teacher_id, '2030-01-01T10:00:00.000Z', '2030-01-01T11:00:00.000Z');
  db.prepare(`INSERT INTO bookings (slot_id, student_user_id, lesson_name)
    VALUES (?, ?, ?)`).run(slot.id, user.id, 'Math');
  db.close();

  db = openDatabase(file);
  assert.equal(db.prepare('SELECT COUNT(*) AS count FROM schema_migrations').get().count, 6);
  assert.equal(db.prepare('SELECT COUNT(*) AS count FROM bookings').get().count, 1);
  assert.equal(db.prepare('SELECT email FROM users WHERE id = ?').get(user.id).email, 'existing@example.com');
  db.close();
});

test('migration upgrades an old slots table without is_active', t => {
  const directory = mkdtempSync(join(tmpdir(), 'numteach-legacy-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const file = join(directory, 'legacy.sqlite');
  const legacy = new DatabaseSync(file);
  legacy.exec(`CREATE TABLE tutor_slots (
    id INTEGER PRIMARY KEY, tutor_id INTEGER NOT NULL,
    starts_at TEXT NOT NULL, ends_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tutor_id, starts_at)
  )`);
  legacy.close();
  const db = openDatabase(file);
  assert.ok(db.prepare('PRAGMA table_info(tutor_slots)').all().some(column => column.name === 'is_active'));
  assert.deepEqual(db.prepare('SELECT version FROM schema_migrations').all().map(row => row.version), [1, 2, 3, 4, 5, 6]);
  db.close();
});

test('lesson migration backfills existing tutor data without changing bookings', t => {
  const directory = mkdtempSync(join(tmpdir(), 'numteach-lessons-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const file = join(directory, 'legacy.sqlite');
  let db = openDatabase(file);
  db.prepare('UPDATE tutors SET lessons = ?, lesson_info = ? WHERE teacher_id = ?')
    .run(JSON.stringify([{ lesson_name: 'Existing course' }]), 'Existing lesson details', 1);
  db.exec('DROP TABLE reviews');
  db.exec('DROP TABLE tutor_lessons');
  db.prepare('DELETE FROM schema_migrations WHERE version = ?').run(2);
  db.prepare('DELETE FROM schema_migrations WHERE version = ?').run(3);
  db.prepare('DELETE FROM schema_migrations WHERE version = ?').run(4);
  db.prepare('DELETE FROM schema_migrations WHERE version = ?').run(6);
  db.close();
  db = openDatabase(file);
  const lesson = db.prepare('SELECT * FROM tutor_lessons WHERE tutor_id = ? AND lesson_name = ?')
    .get(1, 'Existing course');
  assert.equal(lesson.description, 'Existing lesson details');
  assert.equal(db.prepare('SELECT COUNT(*) AS count FROM schema_migrations').get().count, 6);
  db.close();
});
