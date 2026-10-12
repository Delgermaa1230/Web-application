import express from 'express';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { publicUser } from './database.mjs';
import { publicReviewsForTutor, publicTutorWithLessons, publicTutorsWithLessons } from './lessons.mjs';
import { checkPassword, clearSession, createSession, currentUser, hashPassword } from './auth.mjs';
import { installBookingRoutes } from './bookings.mjs';
import { sessionPrice } from './pricing.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const asyncRoute = handler => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
const clean = (value, max = 500) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const validId = value => {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
};
const isUniqueError = error => error.code === 'SQLITE_CONSTRAINT_UNIQUE' ||
  error.errcode === 2067 || error.code === '23505';

async function requireUser(db, req, res) {
  const user = await currentUser(db, req);
  if (!user) res.status(401).json({ error: 'Нэвтэрнэ үү.' });
  return user;
}

export function createApp(db) {
  const app = express();
  app.set('trust proxy', 1);
  app.use(express.json({ limit: '20kb' }));
  app.use('/api', (req, _res, next) => {
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) req.body ??= {};
    next();
  });

  app.get('/api/health', asyncRoute(async (_req, res) => {
    await db.prepare('SELECT 1 AS ok').get();
    res.json({ ok: true });
  }));
  app.get('/api/teachers', asyncRoute(async (_req, res) => {
    res.json(await publicTutorsWithLessons(db,
      await db.prepare('SELECT * FROM tutors WHERE user_id IS NOT NULL ORDER BY teacher_id DESC').all()));
  }));
  app.get('/api/teachers/search', asyncRoute(async (req, res) => {
    const term = clean(req.query.q, 100).toLowerCase();
    const tutors = await publicTutorsWithLessons(db,
      await db.prepare('SELECT * FROM tutors WHERE user_id IS NOT NULL ORDER BY teacher_id DESC').all());
    res.json(tutors.filter(tutor => !term || [tutor.first_name, tutor.last_name,
      tutor.description, ...tutor.lessons.map(item => item.lesson_name)].some(value =>
      String(value || '').toLowerCase().includes(term))));
  }));
  app.get('/api/teachers/:id', asyncRoute(async (req, res) => {
    const id = validId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Багшийн ID буруу байна.' });
    const row = await db.prepare('SELECT * FROM tutors WHERE teacher_id = ? AND user_id IS NOT NULL').get(id);
    if (!row) return res.status(404).json({ error: 'Багш олдсонгүй.' });
    const teacher = await publicTutorWithLessons(db, row);
    const reviews = await publicReviewsForTutor(db, id);
    teacher.feedback = reviews;
    res.json({ teacher, lessons: teacher.lessons });
  }));
  app.get('/api/teachers/:id/reviews', asyncRoute(async (req, res) => {
    const id = validId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Багшийн ID буруу байна.' });
    const tutor = await db.prepare('SELECT teacher_id FROM tutors WHERE teacher_id = ? AND user_id IS NOT NULL').get(id);
    if (!tutor) return res.status(404).json({ error: 'Багш олдсонгүй.' });
    const reviews = await publicReviewsForTutor(db, id);
    res.json(reviews);
  }));
  app.get('/api/lesson', asyncRoute(async (_req, res) => {
    const rows = await db.prepare(`SELECT l.lesson_name FROM tutor_lessons l
      JOIN tutors t ON t.teacher_id = l.tutor_id
      WHERE l.is_active = TRUE AND t.user_id IS NOT NULL`).all();
    const names = [...new Set(rows.map(row => row.lesson_name))];
    res.json(names.sort().map(lesson_name => ({ lesson_name })));
  }));

  app.post('/api/students', asyncRoute(async (req, res) => {
    const first = clean(req.body.first_name, 80);
    const last = clean(req.body.last_name, 80);
    const email = clean(req.body.email, 254).toLowerCase();
    const phone = clean(req.body.phone, 30);
    const password = req.body.password;
    if (!first || !last || !emailPattern.test(email) || typeof password !== 'string' ||
        password.length < 8 || password.length > 128) {
      return res.status(400).json({ error: 'Нэр, хүчинтэй имэйл, 8-аас дээш тэмдэгттэй нууц үг оруулна уу.' });
    }
    try {
      const inserted = await db.prepare(`INSERT INTO users
        (first_name, last_name, email, phone, password_hash) VALUES (?, ?, ?, ?, ?) RETURNING id`)
        .get(first, last, email, phone, await hashPassword(password));
      const user = await db.prepare('SELECT * FROM users WHERE id = ?').get(inserted.id);
      await createSession(db, res, user.id, req.secure);
      res.status(201).json({ student: publicUser(user), message: 'Бүртгэл амжилттай.' });
    } catch (error) {
      if (isUniqueError(error)) {
        return res.status(409).json({ error: 'Энэ имэйл бүртгэлтэй байна.' });
      }
      throw error;
    }
  }));

  app.post('/api/students/login', asyncRoute(async (req, res) => {
    const email = clean(req.body.email, 254).toLowerCase();
    const password = req.body.password;
    const user = await db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user || typeof password !== 'string' || !(await checkPassword(password, user.password_hash))) {
      return res.status(401).json({ error: 'Имэйл эсвэл нууц үг буруу байна.' });
    }
    await createSession(db, res, user.id, req.secure);
    res.json({ student: publicUser(user) });
  }));

  app.post('/api/logout', asyncRoute(async (req, res) => {
    await clearSession(db, req, res);
    res.json({ ok: true });
  }));
  app.get('/api/me', asyncRoute(async (req, res) => {
    const user = await requireUser(db, req, res);
    if (!user) return;
    const tutor = await db.prepare('SELECT * FROM tutors WHERE user_id = ?').get(user.id);
    res.json({ student: publicUser(user), tutor: await publicTutorWithLessons(db, tutor) });
  }));
  app.put('/api/me', asyncRoute(async (req, res) => {
    const user = await requireUser(db, req, res);
    if (!user) return;
    const first = clean(req.body.first_name, 80);
    const last = clean(req.body.last_name, 80);
    const phone = clean(req.body.phone, 30);
    if (!first || !last) return res.status(400).json({ error: 'Нэр, овгоо оруулна уу.' });
    await db.prepare('UPDATE users SET first_name = ?, last_name = ?, phone = ? WHERE id = ?')
      .run(first, last, phone, user.id);
    await db.prepare('UPDATE tutors SET first_name = ?, last_name = ?, phone = ? WHERE user_id = ?')
      .run(first, last, phone, user.id);
    res.json({ student: publicUser(await db.prepare('SELECT * FROM users WHERE id = ?').get(user.id)) });
  }));

  app.put('/api/tutor-profile', asyncRoute(async (req, res) => {
    const user = await requireUser(db, req, res);
    if (!user) return;
    const description = clean(req.body.description, 200);
    const teacherInfo = clean(req.body.teacher_info, 2000);
    const lessonInfo = clean(req.body.lesson_info, 2000);
    const mode = clean(req.body.mode, 30);
    const price = Number(req.body.price);
    const lessonNames = Array.isArray(req.body.lessons)
      ? [...new Set(req.body.lessons.map(item => clean(item, 100)).filter(Boolean))].slice(0, 12) : [];
    if (!description || !teacherInfo || !lessonInfo || !lessonNames.length ||
        !['online', 'classroom', 'hybrid'].includes(mode) ||
        req.body.price === '' || req.body.price == null || !Number.isInteger(price) ||
        price < 0 || price > 300000) {
      return res.status(400).json({ error: 'Хичээл, тайлбар, заах хэлбэр, үнийг бүрэн оруулна уу.' });
    }
    const lessons = JSON.stringify(lessonNames.map(lesson_name => ({ lesson_name })));
    await db.prepare(`INSERT INTO tutors (user_id, first_name, last_name, email, phone,
        description, teacher_info, lesson_info, mode, price, lessons)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
          first_name = excluded.first_name, last_name = excluded.last_name,
          email = excluded.email, phone = excluded.phone,
          description = excluded.description, teacher_info = excluded.teacher_info,
          lesson_info = excluded.lesson_info, mode = excluded.mode,
          price = excluded.price, lessons = excluded.lessons`)
      .run(user.id, user.first_name, user.last_name, user.email, user.phone,
        description, teacherInfo, lessonInfo, mode, price, lessons);
    const tutor = await db.prepare('SELECT * FROM tutors WHERE user_id = ?').get(user.id);
    const currentLessons = await db.prepare('SELECT id, duration_minutes FROM tutor_lessons WHERE tutor_id = ?')
      .all(tutor.teacher_id);
    for (const lesson of currentLessons) {
      await db.prepare('UPDATE tutor_lessons SET price = ? WHERE id = ?')
        .run(sessionPrice(price, lesson.duration_minutes), lesson.id);
    }
    await db.prepare('UPDATE tutor_lessons SET is_active = FALSE WHERE tutor_id = ?').run(tutor.teacher_id);
    for (const name of lessonNames) {
      await db.prepare(`INSERT INTO tutor_lessons (tutor_id, lesson_name, description, price, mode)
        VALUES (?, ?, ?, ?, ?) ON CONFLICT(tutor_id, lesson_name) DO UPDATE SET is_active = TRUE`)
        .run(tutor.teacher_id, name, lessonInfo, price, mode);
    }
    res.json({ tutor: await publicTutorWithLessons(db, tutor) });
  }));

  app.put('/api/tutor-lessons/:id', asyncRoute(async (req, res) => {
    const user = await requireUser(db, req, res);
    if (!user) return;
    const id = validId(req.params.id);
    const name = clean(req.body.lesson_name, 100);
    const code = clean(req.body.course_code, 30);
    const description = clean(req.body.description, 2000);
    const mode = clean(req.body.mode, 30);
    const duration = Number(req.body.duration_minutes);
    if (!id || !name || !description || !['online', 'classroom', 'hybrid'].includes(mode) ||
        !Number.isInteger(duration) || duration < 30 || duration > 180) {
      return res.status(400).json({ error: 'Хичээлийн нэр, тайлбар, хугацаа, хэлбэр, үнийг зөв оруулна уу.' });
    }
    const tutor = await db.prepare('SELECT teacher_id, price FROM tutors WHERE user_id = ?').get(user.id);
    if (!tutor) return res.status(404).json({ error: 'Багшийн мэдээлэл олдсонгүй.' });
    const price = sessionPrice(tutor.price, duration);
    if (Object.hasOwn(req.body, 'price') && Number(req.body.price) !== price) {
      return res.status(400).json({ error: 'Хичээлийн үнэ багшийн нэг цагийн үнээс автоматаар бодогдоно.' });
    }
    try {
      const lesson = await db.prepare(`UPDATE tutor_lessons SET lesson_name = ?, course_code = ?,
        description = ?, duration_minutes = ?, price = ?, mode = ? WHERE id = ? AND tutor_id IN
        (SELECT teacher_id FROM tutors WHERE user_id = ?) RETURNING *`)
        .get(name, code, description, duration, price, mode, id, user.id);
      if (!lesson) return res.status(404).json({ error: 'Хичээл олдсонгүй.' });
      res.json({ lesson });
    } catch (error) {
      if (isUniqueError(error)) {
        return res.status(409).json({ error: 'Ийм нэртэй хичээл аль хэдийн байна.' });
      }
      throw error;
    }
  }));

  app.post('/api/reviews', asyncRoute(async (req, res) => {
    const user = await requireUser(db, req, res);
    if (!user) return;
    const bookingId = validId(req.body.booking_id);
    const rating = Number(req.body.rating);
    const comment = clean(req.body.comment, 2000);
    if (!bookingId || !Number.isInteger(rating) || rating < 1 || rating > 5 || comment.length < 10) {
      return res.status(400).json({ error: '1–5 үнэлгээ, 10-аас дээш тэмдэгттэй сэтгэгдэл оруулна уу.' });
    }
    const booking = await db.prepare(`SELECT b.id, b.student_user_id, b.lesson_id, b.status,
      s.tutor_id, s.ends_at, t.user_id AS tutor_user_id FROM bookings b
      JOIN tutor_slots s ON s.id = b.slot_id
      JOIN tutors t ON t.teacher_id = s.tutor_id WHERE b.id = ?`).get(bookingId);
    if (!booking || String(booking.student_user_id) !== String(user.id)) {
      return res.status(404).json({ error: 'Захиалга олдсонгүй.' });
    }
    if (booking.status !== 'confirmed' || Date.parse(booking.ends_at) > Date.now() ||
        !booking.lesson_id || String(booking.tutor_user_id) === String(user.id)) {
      return res.status(409).json({ error: 'Дууссан, баталгаажсан хичээлд сэтгэгдэл бичнэ үү.' });
    }
    try {
      const review = await db.prepare(`INSERT INTO reviews
        (booking_id, tutor_id, lesson_id, student_user_id, rating, comment)
        VALUES (?, ?, ?, ?, ?, ?) RETURNING *`).get(
        bookingId, booking.tutor_id, booking.lesson_id, user.id, rating, comment
      );
      res.status(201).json({ review });
    } catch (error) {
      if (isUniqueError(error)) {
        return res.status(409).json({ error: 'Энэ захиалгад сэтгэгдэл аль хэдийн бичсэн байна.' });
      }
      throw error;
    }
  }));

  app.post('/api/messages', asyncRoute(async (req, res) => {
    const user = await requireUser(db, req, res);
    if (!user) return;
    const tutorId = validId(req.body.tutor_id);
    if (!tutorId) return res.status(400).json({ error: 'Багшийн ID буруу байна.' });
    const tutor = await db.prepare('SELECT * FROM tutors WHERE teacher_id = ?').get(tutorId);
    const body = clean(req.body.message, 2000);
    const lesson = clean(req.body.lesson_name, 100);
    if (!tutor || body.length < 10) {
      return res.status(400).json({ error: 'Багш болон 10-аас дээш тэмдэгттэй зурвас оруулна уу.' });
    }
    if (!tutor.user_id) {
      return res.status(400).json({ error: 'Энэ нь жишээ зар тул зурвас хүлээж авахгүй.' });
    }
    if (tutor.user_id === user.id) {
      return res.status(400).json({ error: 'Өөртөө зурвас илгээх боломжгүй.' });
    }
    const result = await db.prepare(`INSERT INTO messages (sender_user_id, tutor_id, lesson_name, body)
      VALUES (?, ?, ?, ?) RETURNING id`).get(user.id, tutorId, lesson, body);
    res.status(201).json({ id: Number(result.id), message: 'Зурвас илгээгдлээ.' });
  }));
  app.get('/api/messages', asyncRoute(async (req, res) => {
    const user = await requireUser(db, req, res);
    if (!user) return;
    const received = await db.prepare(`SELECT m.id, m.lesson_name, m.body, m.created_at,
      u.first_name, u.last_name, u.email, u.phone
      FROM messages m JOIN tutors t ON t.teacher_id = m.tutor_id
      JOIN users u ON u.id = m.sender_user_id WHERE t.user_id = ? ORDER BY m.id DESC`).all(user.id);
    const sent = await db.prepare(`SELECT m.id, m.lesson_name, m.body, m.created_at,
      t.first_name, t.last_name, t.teacher_id
      FROM messages m JOIN tutors t ON t.teacher_id = m.tutor_id
      WHERE m.sender_user_id = ? ORDER BY m.id DESC`).all(user.id);
    res.json({ received, sent });
  }));

  installBookingRoutes(app, db);

  app.use('/api', (_req, res) => res.status(404).json({ error: 'API endpoint олдсонгүй.' }));
  app.use('/styles', express.static(join(root, 'styles')));
  app.use('/js', express.static(join(root, 'js')));
  app.use('/imgs', express.static(join(root, 'imgs')));
  app.use('/pages', express.static(join(root, 'pages')));
  app.get(['/', '/index.html'], (_req, res) => res.sendFile(join(root, 'index.html')));
  app.use((error, _req, res, _next) => {
    if (error.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'JSON хүсэлт буруу байна.' });
    }
    if (error.type === 'entity.too.large') {
      return res.status(413).json({ error: 'Хүсэлт хэт том байна.' });
    }
    console.error(error);
    res.status(500).json({ error: 'Серверийн алдаа гарлаа.' });
  });
  return app;
}
