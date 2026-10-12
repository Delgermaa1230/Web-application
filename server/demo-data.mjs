import { randomBytes, scryptSync } from 'node:crypto';

export const demoPassword = 'DemoPass123!';
export const demoStudentEmail = 'demo.student@numteach.test';
export const demoTutorEmail = id => `demo.tutor${id}@numteach.test`;

const hashDemoPassword = () => {
  const salt = randomBytes(16).toString('hex');
  return `scrypt:${salt}:${scryptSync(demoPassword, salt, 64).toString('hex')}`;
};

export function seedDemoData(db, tutors) {
  const insertUser = db.prepare(`INSERT OR IGNORE INTO users
    (email, password_hash, first_name, last_name) VALUES (?, ?, ?, ?)`);
  const findUser = db.prepare('SELECT id FROM users WHERE email = ?');
  const attachTutor = db.prepare(`UPDATE tutors SET user_id = ?, email = ?
    WHERE teacher_id = ? AND user_id IS NULL AND first_name = ? AND last_name = ?`);
  const ownedTutor = db.prepare(`SELECT t.teacher_id FROM tutors t JOIN users u ON u.id = t.user_id
    WHERE t.teacher_id = ? AND u.email = ?`);
  const updateDemoImage = db.prepare(`UPDATE tutors SET image = ?
    WHERE teacher_id = ? AND user_id = ?
    AND (image IS NULL OR image = '' OR image = ?)`);
  const overlap = db.prepare(`SELECT id FROM tutor_slots WHERE tutor_id = ?
    AND is_active = TRUE AND starts_at < ? AND ends_at > ?`);
  const insertSlot = db.prepare(`INSERT OR IGNORE INTO tutor_slots (tutor_id, starts_at, ends_at)
    VALUES (?, ?, ?)`);

  db.exec('BEGIN');
  try {
    if (!findUser.get(demoStudentEmail)) {
      insertUser.run(demoStudentEmail, hashDemoPassword(), 'Туршигч', 'Оюутан');
    }
    const now = Date.now();
    // The demo timetable uses Ulaanbaatar civil time (UTC+08:00).
    const localToday = new Date(now + 8 * 3600000);
    const midnight = Date.UTC(localToday.getUTCFullYear(), localToday.getUTCMonth(), localToday.getUTCDate());
    const weekdays = ['Ням', 'Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан', 'Бямба'];
    for (const tutor of tutors) {
      const email = demoTutorEmail(tutor.teacher_id);
      if (!findUser.get(email)) {
        insertUser.run(email, hashDemoPassword(), tutor.first_name, tutor.last_name);
      }
      const user = findUser.get(email);
      attachTutor.run(user.id, email, tutor.teacher_id, tutor.first_name, tutor.last_name);
      if (!ownedTutor.get(tutor.teacher_id, email)) continue;
      updateDemoImage.run(tutor.image, tutor.teacher_id, user.id,
        '/imgs/profile-icon-design-free-vector.jpg');
      for (let offset = 0; offset < 28; offset++) {
        const day = new Date(midnight + offset * 86400000);
        const date = day.toISOString().slice(0, 10);
        for (const hour of tutor.possible_hours.filter(item => item.day === weekdays[day.getUTCDay()])) {
          const start = new Date(`${date}T${hour.start}:00+08:00`).toISOString();
          const end = new Date(`${date}T${hour.end}:00+08:00`).toISOString();
          if (Date.parse(start) < now + 30 * 60000 || overlap.get(tutor.teacher_id, end, start)) continue;
          insertSlot.run(tutor.teacher_id, start, end);
        }
      }
    }
    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}
