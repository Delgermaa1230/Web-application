import { chromium } from 'playwright-core';
import { openDatabase } from '../server/database.mjs';
import { createApp } from '../server/webapp.mjs';
import { mkdir } from 'node:fs/promises';

const db = openDatabase();
const server = createApp(db).listen(0);
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true,
});
const errors = [];
await mkdir('artifacts/ui', { recursive: true });
async function register(context, first, email) {
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base + '/pages/login.html');
  await page.locator('.login a').click();
  await page.locator('#register-fname').fill(first);
  await page.locator('#register-lname').fill('Student');
  await page.locator('#register-email').fill(email);
  await page.locator('#register-phone').fill('99112233');
  await page.locator('#register-password').fill('StrongPass123');
  await page.locator('#register-retype-password').fill('StrongPass123');
  await page.locator('#registerForm button[type="submit"]').click();
  await page.waitForURL('**/pages/profile.html');
  return page;
}

try {
  const tutorContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const tutorPage = await register(tutorContext, 'Tutor', 'ui-tutor@example.com');
  await tutorPage.locator('#tutor-action').click();
  await tutorPage.locator('#tutor-form [name="description"]').fill('Алгоритмын давтлага');
  await tutorPage.locator('#tutor-form [name="lessons"]').fill('Алгоритм');
  await tutorPage.locator('#tutor-form [name="price"]').fill('20000');
  await tutorPage.locator('#tutor-form [name="teacher_info"]').fill('МУИС-ийн оюутан');
  await tutorPage.locator('#tutor-form [name="lesson_info"]').fill('Долоо хоног бүр давтлага хийнэ');
  await tutorPage.locator('#tutor-form button[type="submit"]').click();
  await tutorPage.locator('#availability').waitFor({ state: 'visible' });
  const listingHref = await tutorPage.locator('#listing-link').getAttribute('href');
  const localTime = new Date(Date.now() + 86400000).toLocaleString('sv-SE', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
  }).replace(' ', 'T');
  await tutorPage.locator('[name="starts_at"]').fill(localTime);
  await tutorPage.locator('#slot-form button[type="submit"]').click();
  await tutorPage.locator('#my-slots .slot-row').waitFor();
  await tutorPage.screenshot({ path: 'artifacts/ui/editor-390.png', fullPage: false });

  const guestContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const studentPage = await guestContext.newPage();
  studentPage.on('pageerror', error => errors.push(error.message));
  await studentPage.goto(base + '/pages/' + listingHref.replace('./', ''));
  await studentPage.locator('sticky-box .important-button').click();
  await studentPage.waitForURL('**/pages/contactTeacher.html?id=*');
  await studentPage.locator('#booking-form .schedule-slot').first().click();
  await studentPage.locator('[name="note"]').fill('Нэмэлт тайлбар: алгоритмын бодлого давтъя.');
  await studentPage.screenshot({ path: 'artifacts/ui/contact-390.png', fullPage: false });
  if (await studentPage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)) {
    throw new Error('Booking timetable overflows the phone viewport');
  }
  await studentPage.locator('#booking-form button[type="submit"]').click();
  await studentPage.waitForURL('**/pages/login.html?next=*');
  await studentPage.locator('.login a').click();
  await studentPage.locator('#register-fname').fill('Learner');
  await studentPage.locator('#register-lname').fill('Student');
  await studentPage.locator('#register-email').fill('ui-learner@example.com');
  await studentPage.locator('#register-phone').fill('99112233');
  await studentPage.locator('#register-password').fill('StrongPass123');
  await studentPage.locator('#register-retype-password').fill('StrongPass123');
  await studentPage.locator('#registerForm button[type="submit"]').click();
  await studentPage.waitForURL('**/pages/contactTeacher.html?id=*');
  await studentPage.locator('#booking-form .schedule-slot[aria-pressed="true"]').waitFor();
  if ((await studentPage.locator('[name="note"]').inputValue()) !== 'Нэмэлт тайлбар: алгоритмын бодлого давтъя.') {
    throw new Error('Booking note was lost during sign in');
  }
  await studentPage.locator('#booking-form button[type="submit"]').click();
  await studentPage.locator('#booking-success').waitFor({ state: 'visible' });
  await studentPage.locator('#booking-success a').click();
  await studentPage.waitForURL('**/pages/profile.html#my-bookings');
  await studentPage.locator('#my-bookings-list .booking-card').waitFor();
  const savedNote = db.prepare('SELECT note FROM bookings ORDER BY id DESC LIMIT 1').get().note;
  if (savedNote !== 'Нэмэлт тайлбар: алгоритмын бодлого давтъя.') {
    throw new Error('Booking note was not saved');
  }
  await studentPage.screenshot({ path: 'artifacts/ui/profile-390.png', fullPage: false });
  await tutorPage.goto(base + '/pages/profile.html');
  await tutorPage.locator('#incoming-bookings .booking-card').waitFor();
  await tutorPage.locator('#incoming-bookings button.important-button').click();
  await studentPage.reload();
  await studentPage.getByText('Баталгаажсан').waitFor();
  const bookedSlot = db.prepare('SELECT id FROM tutor_slots ORDER BY id DESC LIMIT 1').get();
  db.prepare('UPDATE tutor_slots SET starts_at = ?, ends_at = ? WHERE id = ?').run(
    new Date(Date.now() - 2 * 3600000).toISOString(),
    new Date(Date.now() - 3600000).toISOString(), bookedSlot.id
  );
  await studentPage.reload();
  await studentPage.locator('.review-form textarea[name="comment"]').fill('The lesson was clear and very helpful.');
  await studentPage.locator('.review-form button[type="submit"]').click();
  await studentPage.locator('.review-form').waitFor({ state: 'detached' });
  await studentPage.goto(base + '/pages/' + listingHref.replace('./', ''));
  await studentPage.locator('.comment-box comment-element').waitFor();
  if (!(await studentPage.locator('.comment-box').textContent()).includes('The lesson was clear')) {
    throw new Error('Review did not appear on tutor detail');
  }
  if (errors.length) throw new Error(`Browser errors: ${errors.join('; ')}`);
  console.log('Browser flow passed: register, become tutor, add slot, guest sign-in gate, book, confirm, review');
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
  db.close();
}
