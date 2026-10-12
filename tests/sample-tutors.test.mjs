import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { openDatabase } from '../server/database.mjs';
import { loadSampleTutors } from '../server/sample-tutors.mjs';

test('sample tutors have consistent lessons and illustrative weekly hours', t => {
  const raw = JSON.parse(readFileSync(new URL('../data/sample-tutors.json', import.meta.url), 'utf8'));
  assert.ok(raw.every(tutor => tutor.lessons.every(lesson => !Object.hasOwn(lesson, 'price'))));
  assert.equal(loadSampleTutors().length, 10);
  const directory = mkdtempSync(join(tmpdir(), 'numteach-samples-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const file = join(directory, 'site.sqlite');
  let db = openDatabase(file);
  assert.equal(db.prepare('SELECT COUNT(*) AS count FROM tutors WHERE user_id IS NULL').get().count, 10);
  for (const tutor of db.prepare('SELECT * FROM tutors WHERE user_id IS NULL').all()) {
    const lessons = db.prepare('SELECT * FROM tutor_lessons WHERE tutor_id = ? AND is_active = 1').all(tutor.teacher_id);
    assert.equal(lessons.length, 2);
    assert.ok(lessons.every(lesson => lesson.description && lesson.price > 0 && [60, 90].includes(lesson.duration_minutes)));
    assert.ok(lessons.every(lesson => lesson.price === Math.round(tutor.price * lesson.duration_minutes / 60)));
    assert.equal(JSON.parse(tutor.possible_hours).length, 2);
    assert.equal(db.prepare('SELECT COUNT(*) AS count FROM tutor_slots WHERE tutor_id = ?')
      .get(tutor.teacher_id).count, 0);
    assert.equal(tutor.number_of_ratings, 0);
    assert.equal(tutor.email, '');
  }
  db.prepare('UPDATE tutors SET description = ? WHERE teacher_id = 1').run('outdated sample');
  db.prepare('INSERT INTO tutor_lessons (tutor_id, lesson_name) VALUES (1, ?)').run('Old unrelated lesson');
  db.prepare('UPDATE tutors SET first_name = ?, description = ? WHERE teacher_id = 2')
    .run('Custom', 'Keep this legacy profile');
  db.close();

  db = openDatabase(file);
  assert.notEqual(db.prepare('SELECT description FROM tutors WHERE teacher_id = 1').get().description, 'outdated sample');
  assert.equal(db.prepare('SELECT is_active FROM tutor_lessons WHERE tutor_id = 1 AND lesson_name = ?')
    .get('Old unrelated lesson').is_active, 0);
  assert.equal(db.prepare('SELECT description FROM tutors WHERE teacher_id = 2').get().description,
    'Keep this legacy profile');
  db.close();
});
