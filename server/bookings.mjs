import { currentUser } from './auth.mjs';
import { sessionPrice } from './pricing.mjs';

const route = handler => (req, res, next) => Promise.resolve(handler(req, res)).catch(next);
const clean = (value, max) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const idOf = value => {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
};
const isoTime = value => typeof value === 'string' &&
  /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(value) &&
  !Number.isNaN(Date.parse(value)) && new Date(value).toISOString() === value;
const isUniqueError = error => error.code === '23505' || error.errcode === 2067 ||
  error.code === 'SQLITE_CONSTRAINT_UNIQUE';

async function signedIn(db, req, res) {
  const user = await currentUser(db, req);
  if (!user) res.status(401).json({ error: 'Цаг захиалахын тулд нэвтэрнэ үү.' });
  return user;
}

export function installBookingRoutes(app, db) {
  app.get('/api/teachers/:id/slots', route(async (req, res) => {
    const tutorId = idOf(req.params.id);
    if (!tutorId) return res.status(400).json({ error: 'Багшийн ID буруу байна.' });
    const tutor = await db.prepare('SELECT teacher_id FROM tutors WHERE teacher_id = ? AND user_id IS NOT NULL').get(tutorId);
    if (!tutor) return res.status(404).json({ error: 'Багш олдсонгүй.' });
    const slots = await db.prepare(`SELECT s.id, s.tutor_id, s.starts_at, s.ends_at,
      b.id AS booking_id FROM tutor_slots s LEFT JOIN bookings b ON b.slot_id = s.id
      AND b.status IN ('pending','confirmed')
      WHERE s.tutor_id = ? AND s.is_active = TRUE AND s.ends_at > ? ORDER BY s.starts_at`)
      .all(tutorId, new Date().toISOString());
    res.json(slots.map(({ booking_id, ...slot }) => ({ ...slot, available: booking_id == null })));
  }));

  app.post('/api/tutor-slots', route(async (req, res) => {
    const user = await signedIn(db, req, res);
    if (!user) return;
    const tutor = await db.prepare('SELECT teacher_id FROM tutors WHERE user_id = ?').get(user.id);
    if (!tutor) return res.status(403).json({ error: 'Эхлээд багшийн зар нийтэлнэ үү.' });
    const { starts_at: start, ends_at: end } = req.body;
    const duration = Date.parse(end) - Date.parse(start);
    if (!isoTime(start) || !isoTime(end) || Date.parse(start) < Date.now() + 30 * 60000 ||
        Date.parse(start) > Date.now() + 120 * 86400000 || duration < 30 * 60000 ||
        duration > 180 * 60000) {
      return res.status(400).json({ error: '30–180 минутын, ирээдүйн боломжтой цаг оруулна уу.' });
    }
    const conflict = await db.prepare(`SELECT id FROM tutor_slots WHERE tutor_id = ?
      AND is_active = TRUE AND starts_at < ? AND ends_at > ?`).get(tutor.teacher_id, end, start);
    if (conflict) return res.status(409).json({ error: 'Энэ цаг өөр цагтай давхцаж байна.' });
    try {
      const slot = await db.prepare(`INSERT INTO tutor_slots (tutor_id, starts_at, ends_at)
        VALUES (?, ?, ?) ON CONFLICT(tutor_id, starts_at) DO UPDATE SET
        ends_at = excluded.ends_at, is_active = TRUE RETURNING *`).get(tutor.teacher_id, start, end);
      res.status(201).json({ slot });
    } catch (error) {
      if (isUniqueError(error)) {
        return res.status(409).json({ error: 'Энэ цаг аль хэдийн нэмэгдсэн байна.' });
      }
      throw error;
    }
  }));

  app.delete('/api/tutor-slots/:id', route(async (req, res) => {
    const user = await signedIn(db, req, res);
    if (!user) return;
    const slotId = idOf(req.params.id);
    if (!slotId) return res.status(400).json({ error: 'Цагийн ID буруу байна.' });
    const slot = await db.prepare(`SELECT s.id FROM tutor_slots s JOIN tutors t ON t.teacher_id = s.tutor_id
      WHERE s.id = ? AND t.user_id = ?`).get(slotId, user.id);
    if (!slot) return res.status(404).json({ error: 'Цаг олдсонгүй.' });
    const active = await db.prepare(`SELECT id FROM bookings WHERE slot_id = ?
      AND status IN ('pending','confirmed')`).get(slotId);
    if (active) return res.status(409).json({ error: 'Захиалгатай цагийг эхлээд шийдвэрлэнэ үү.' });
    await db.prepare('UPDATE tutor_slots SET is_active = FALSE WHERE id = ?').run(slotId);
    res.json({ ok: true });
  }));

  app.post('/api/bookings', route(async (req, res) => {
    const user = await signedIn(db, req, res);
    if (!user) return;
    const slotId = idOf(req.body.slot_id);
    const lessonId = idOf(req.body.lesson_id);
    const lessonName = clean(req.body.lesson_name, 100);
    const note = clean(req.body.note, 1000);
    if (!slotId || (!lessonId && !lessonName)) {
      return res.status(400).json({ error: 'Цаг болон хичээлээ сонгоно уу.' });
    }
    const slot = await db.prepare(`SELECT s.*, t.user_id, t.price AS hourly_rate FROM tutor_slots s
      JOIN tutors t ON t.teacher_id = s.tutor_id WHERE s.id = ?`).get(slotId);
    if (!slot || !slot.is_active || Date.parse(slot.starts_at) < Date.now() + 30 * 60000 || !slot.user_id) {
      return res.status(409).json({ error: 'Энэ цаг захиалах боломжгүй байна.' });
    }
    if (String(slot.user_id) === String(user.id)) {
      return res.status(400).json({ error: 'Өөрийнхөө цагийг захиалах боломжгүй.' });
    }
    const lesson = lessonId
      ? await db.prepare(`SELECT id, lesson_name, duration_minutes, price, mode FROM tutor_lessons WHERE id = ?
          AND tutor_id = ? AND is_active = TRUE`).get(lessonId, slot.tutor_id)
      : await db.prepare(`SELECT id, lesson_name, duration_minutes, price, mode FROM tutor_lessons WHERE lesson_name = ?
          AND tutor_id = ? AND is_active = TRUE`).get(lessonName, slot.tutor_id);
    if (!lesson) {
      return res.status(400).json({ error: 'Багшийн заах хичээлээс сонгоно уу.' });
    }
    if (Date.parse(slot.ends_at) - Date.parse(slot.starts_at) !== lesson.duration_minutes * 60000) {
      return res.status(409).json({ error: 'Энэ цаг хичээлийн үргэлжлэх хугацаанд тохирохгүй.' });
    }
    const currentPrice = sessionPrice(slot.hourly_rate, lesson.duration_minutes);
    if (req.body.quoted_price != null && Number(req.body.quoted_price) !== currentPrice) {
      return res.status(409).json({ error: 'Хичээлийн үнэ өөрчлөгдсөн байна. Хуудсыг шинэчлэн дахин шалгана уу.' });
    }
    try {
      const booking = await db.prepare(`INSERT INTO bookings
        (slot_id, student_user_id, lesson_id, lesson_name, price_amount,
         duration_minutes, mode, note)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`)
        .get(slotId, user.id, lesson.id, lesson.lesson_name, currentPrice,
          lesson.duration_minutes, lesson.mode, note);
      res.status(201).json({ booking });
    } catch (error) {
      if (isUniqueError(error) || error.code === '23503') {
        return res.status(409).json({ error: 'Энэ цаг саяхан захиалагдсан байна.' });
      }
      throw error;
    }
  }));

  app.get('/api/bookings', route(async (req, res) => {
    const user = await signedIn(db, req, res);
    if (!user) return;
    const own = await db.prepare(`SELECT b.*, s.starts_at, s.ends_at, r.id AS review_id,
      t.teacher_id, t.first_name AS tutor_first_name, t.last_name AS tutor_last_name
      FROM bookings b JOIN tutor_slots s ON s.id = b.slot_id
      JOIN tutors t ON t.teacher_id = s.tutor_id
      LEFT JOIN reviews r ON r.booking_id = b.id
      WHERE b.student_user_id = ? ORDER BY s.starts_at DESC`).all(user.id);
    const incoming = await db.prepare(`SELECT b.*, s.starts_at, s.ends_at,
      u.first_name AS student_first_name, u.last_name AS student_last_name,
      u.email AS student_email, u.phone AS student_phone
      FROM bookings b JOIN tutor_slots s ON s.id = b.slot_id
      JOIN tutors t ON t.teacher_id = s.tutor_id
      JOIN users u ON u.id = b.student_user_id
      WHERE t.user_id = ? ORDER BY s.starts_at DESC`).all(user.id);
    res.json({ own, incoming });
  }));

  app.patch('/api/bookings/:id', route(async (req, res) => {
    const user = await signedIn(db, req, res);
    if (!user) return;
    const id = idOf(req.params.id);
    const status = req.body.status;
    const now = new Date().toISOString();
    if (!id || !['confirmed', 'declined', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Захиалгын төлөв буруу байна.' });
    }
    const booking = status === 'cancelled'
      ? await db.prepare(`UPDATE bookings SET status = 'cancelled' WHERE id = ?
          AND student_user_id = ? AND status IN ('pending','confirmed')
          AND slot_id IN (SELECT id FROM tutor_slots WHERE starts_at > ?) RETURNING *`).get(id, user.id, now)
      : await db.prepare(`UPDATE bookings SET status = ? WHERE id = ? AND status = 'pending'
          AND slot_id IN (SELECT s.id FROM tutor_slots s JOIN tutors t
            ON t.teacher_id = s.tutor_id WHERE t.user_id = ? AND s.starts_at > ?) RETURNING *`)
        .get(status, id, user.id, now);
    if (!booking) return res.status(409).json({ error: 'Захиалга олдсонгүй эсвэл төлөв нь өөрчлөгдсөн байна.' });
    res.json({ booking });
  }));
}
