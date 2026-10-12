import { readFileSync } from 'node:fs';
import { sessionPrice } from './pricing.mjs';

const seedFile = new URL('../data/sample-tutors.json', import.meta.url);
const weekdays = new Set(['Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан', 'Бямба', 'Ням']);
const minutes = time => {
  if (!/^\d{2}:\d{2}$/.test(time || '')) return NaN;
  const [hour, minute] = time.split(':').map(Number);
  return hour < 24 && minute < 60 ? hour * 60 + minute : NaN;
};

export function loadSampleTutors() {
  const tutors = JSON.parse(readFileSync(seedFile, 'utf8'));
  return tutors.map(tutor => {
    if (!Number.isInteger(tutor.hourly_rate) || tutor.hourly_rate < 0 || tutor.hourly_rate > 300000 ||
        !tutor.lessons?.length || !tutor.possible_hours?.length) {
      throw new Error(`Invalid sample tutor ${tutor.teacher_id}`);
    }
    const lessons = tutor.lessons.map(lesson => ({
      ...lesson,
      price: sessionPrice(tutor.hourly_rate, lesson.duration_minutes),
    }));
    for (const hour of tutor.possible_hours) {
      const duration = minutes(hour.end) - minutes(hour.start);
      if (!weekdays.has(hour.day) || !lessons.some(lesson => lesson.duration_minutes === duration)) {
        throw new Error(`Sample tutor ${tutor.teacher_id} has a schedule without a matching lesson duration`);
      }
    }
    return { ...tutor, lessons };
  });
}
