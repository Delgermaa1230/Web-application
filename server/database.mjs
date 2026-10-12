import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { migrateSqlite } from './migrations.mjs';
import { loadSampleTutors } from './sample-tutors.mjs';
import { seedDemoData } from './demo-data.mjs';

export function openDatabase(file = ':memory:', { demoData = false } = {}) {
  if (file !== ':memory:') mkdirSync(dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  migrateSqlite(db);

  const seedFresh = db.prepare('SELECT COUNT(*) AS count FROM tutors').get().count === 0;
  const teachers = loadSampleTutors();
  const sampleByIdentity = db.prepare(`SELECT 1 FROM tutors WHERE teacher_id = ? AND user_id IS NULL
    AND first_name = ? AND last_name = ?`);
  if (seedFresh || teachers.some(teacher => sampleByIdentity.get(
    teacher.teacher_id, teacher.first_name, teacher.last_name))) {
    const insert = db.prepare(`INSERT INTO tutors
      (teacher_id, first_name, last_name, email, description, teacher_info, lesson_info,
       image, rank, phone, mode, price, retings, number_of_ratings, lessons, feedback, possible_hours)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    const insertLesson = db.prepare(`INSERT OR IGNORE INTO tutor_lessons
      (tutor_id, lesson_name, description, duration_minutes, price, mode) VALUES (?, ?, ?, ?, ?, ?)`);
    const update = db.prepare(`UPDATE tutors SET first_name = ?, last_name = ?, email = '', phone = '',
      description = ?, teacher_info = ?, lesson_info = '', image = ?, rank = ?, mode = ?,
      price = ?, retings = 0, number_of_ratings = 0, lessons = ?, feedback = '[]', possible_hours = ?
      WHERE teacher_id = ? AND user_id IS NULL AND first_name = ? AND last_name = ?`);
    const updateLesson = db.prepare(`UPDATE tutor_lessons SET description = ?, duration_minutes = ?, price = ?,
      mode = ?, is_active = 1 WHERE tutor_id = ? AND lesson_name = ?`);
    const disableLessons = db.prepare('UPDATE tutor_lessons SET is_active = 0 WHERE tutor_id = ?');
    db.exec('BEGIN');
    try {
      for (const teacher of teachers) {
        if (seedFresh) insert.run(
          teacher.teacher_id, teacher.first_name, teacher.last_name, '',
          teacher.description, teacher.teacher_info, '',
          teacher.image, 'Оюутан багш',
          '', teacher.mode, teacher.hourly_rate,
          0, 0,
          JSON.stringify(teacher.lessons || []), JSON.stringify(teacher.feedback || []),
          JSON.stringify(teacher.possible_hours || [])
        );
        const sample = sampleByIdentity.get(teacher.teacher_id, teacher.first_name, teacher.last_name);
        if (!sample) continue;
        if (!seedFresh) update.run(teacher.first_name, teacher.last_name, teacher.description,
          teacher.teacher_info, teacher.image, 'Оюутан багш', teacher.mode,
          teacher.hourly_rate, JSON.stringify(teacher.lessons),
          JSON.stringify(teacher.possible_hours), teacher.teacher_id,
          teacher.first_name, teacher.last_name);
        disableLessons.run(teacher.teacher_id);
        for (const lesson of teacher.lessons || []) {
          if (!lesson.lesson_name) continue;
          insertLesson.run(teacher.teacher_id, lesson.lesson_name, lesson.description,
            lesson.duration_minutes, lesson.price, lesson.mode);
          updateLesson.run(lesson.description, lesson.duration_minutes, lesson.price,
            lesson.mode, teacher.teacher_id, lesson.lesson_name);
        }
      }
      db.exec('COMMIT');
    } catch (error) {
      db.exec('ROLLBACK');
      throw error;
    }
  }
  if (demoData) seedDemoData(db, teachers);
  return db;
}

export function publicTutor(row) {
  if (!row) return null;
  const { email: _email, phone: _phone, feedback: _feedback,
    retings: _ratings, number_of_ratings: _count, ...publicRow } = row;
  return {
    ...publicRow,
    lessons: JSON.parse(row.lessons),
    feedback: [],
    retings: 0,
    number_of_ratings: 0,
    possible_hours: JSON.parse(row.possible_hours),
    isBagsh: true,
  };
}

export function publicUser(row) {
  if (!row) return null;
  return {
    id: row.id, first_name: row.first_name, last_name: row.last_name,
    email: row.email, phone: row.phone,
  };
}
