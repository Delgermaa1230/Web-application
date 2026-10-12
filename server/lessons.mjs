import { publicTutor } from './database.mjs';

export async function publicTutorsWithLessons(db, rows) {
  if (!rows.length) return [];
  const lessons = await db.prepare(`SELECT id, tutor_id, lesson_name, course_code, description,
    duration_minutes, price, mode FROM tutor_lessons WHERE is_active = TRUE
    ORDER BY id`).all();
  const freeSlots = await db.prepare(`SELECT s.tutor_id, s.starts_at FROM tutor_slots s
    LEFT JOIN bookings b ON b.slot_id = s.id AND b.status IN ('pending','confirmed')
    WHERE s.is_active = TRUE AND s.starts_at > ? AND b.id IS NULL
    ORDER BY s.starts_at`).all(new Date().toISOString());
  const ratings = await db.prepare(`SELECT tutor_id, COUNT(*) AS review_count,
    AVG(rating) AS average_rating FROM reviews WHERE is_visible = TRUE
    GROUP BY tutor_id`).all();
  const byTutor = new Map();
  for (const lesson of lessons) {
    const key = String(lesson.tutor_id);
    if (!byTutor.has(key)) byTutor.set(key, []);
    byTutor.get(key).push(lesson);
  }
  const nextSlot = new Map();
  for (const slot of freeSlots) {
    const key = String(slot.tutor_id);
    if (!nextSlot.has(key)) nextSlot.set(key, slot.starts_at);
  }
  const byRating = new Map(ratings.map(item => [String(item.tutor_id), item]));
  return rows.map(row => ({
    ...publicTutor(row),
    lessons: byTutor.get(String(row.teacher_id)) || [],
    next_available_at: nextSlot.get(String(row.teacher_id)) || null,
    retings: Number(byRating.get(String(row.teacher_id))?.average_rating || 0),
    number_of_ratings: Number(byRating.get(String(row.teacher_id))?.review_count || 0),
  }));
}

export async function publicTutorWithLessons(db, row) {
  if (!row) return null;
  return (await publicTutorsWithLessons(db, [row]))[0];
}

export async function publicReviewsForTutor(db, tutorId) {
  return db.prepare(`SELECT r.id, r.lesson_id, r.rating, r.comment, r.created_at,
    b.lesson_name, u.first_name AS student_first_name, u.last_name AS student_last_name
    FROM reviews r JOIN bookings b ON b.id = r.booking_id
    JOIN users u ON u.id = r.student_user_id
    WHERE r.tutor_id = ? AND r.is_visible = TRUE ORDER BY r.id DESC`).all(tutorId);
}
