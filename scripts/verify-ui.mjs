import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
import { openDatabase } from '../server/database.mjs';
import { createApp } from '../server/webapp.mjs';

const db = process.env.SITE_URL ? null : openDatabase(':memory:', { demoData: true });
const server = db ? createApp(db).listen(0) : null;
const base = process.env.SITE_URL || `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true,
});
await mkdir('artifacts/ui', { recursive: true });
const errors = [];
try {
  for (const width of [390, 768, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: 'light' });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(`${width}: ${error.message}`));
    for (const [name, path] of [
      ['home', '/'], ['search', '/pages/SearchResult.html'],
      ['tutor', '/pages/teachInfo.html?id=1'], ['login', '/pages/login.html'],
      ['favorites', '/pages/lovedTeachers.html'], ['help', '/pages/question.html'],
      ['contact', '/pages/contactTeacher.html?id=1'],
    ]) {
      await page.goto(base + path, { waitUntil: 'networkidle' });
      const metrics = await page.evaluate(() => ({
        viewport: window.innerWidth,
        document: document.documentElement.scrollWidth,
        title: document.title,
      }));
      await page.screenshot({ path: `artifacts/ui/${name}-${width}.png`, fullPage: false });
      console.log(JSON.stringify({ page: name, width, ...metrics }));
      if (metrics.document > metrics.viewport) {
        throw new Error(`${name} overflows horizontally at ${width}px by ${metrics.document - metrics.viewport}px`);
      }
      if (name === 'home' || name === 'search') {
        const listing = await page.evaluate(() => {
          const grid = document.querySelector('.tutors-box');
          const images = [...grid.querySelectorAll('tutor-card .tutorImage img')];
          return {
            columns: getComputedStyle(grid).gridTemplateColumns.split(' ').length,
            cards: grid.querySelectorAll('tutor-card').length,
            images: images.length,
            brokenImages: images.filter(image => !image.complete || !image.naturalWidth)
              .map(image => image.src),
          };
        });
        if (listing.columns !== (width > 900 ? 4 : 2) || !listing.cards ||
            listing.images !== listing.cards || listing.brokenImages.length) {
          throw new Error(`${name} listing is incomplete at ${width}px: ${JSON.stringify(listing)}`);
        }
      }
      if (name === 'tutor' && width === 390 && !process.env.SITE_URL) {
        const contactLink = page.locator('sticky-box .important-button');
        if (!(await contactLink.getAttribute('href')).includes('contactTeacher.html?id=1')) {
          throw new Error('Tutor contact action does not open booking');
        }
      }
      if (name === 'contact' && width === 390 && !process.env.SITE_URL) {
        const form = page.locator('#booking-form');
        await form.waitFor({ state: 'visible' });
        if (!(await page.locator('#slot-table .schedule-slot').count())) {
          await page.locator('#slot-table .schedule-actions button').last().click();
        }
        if (!(await page.locator('#slot-table .schedule-slot').count())) {
          throw new Error('Demo tutor has no selectable booking slot');
        }
        await page.locator('#slot-table .schedule-slot').first().click();
        if (!(await page.locator('#booking-summary').textContent()).trim()) {
          throw new Error('Selecting a slot did not show booking details');
        }
        await form.locator('[name="lesson_id"]').selectOption({ index: 1 });
        if (await form.locator('button[type="submit"]').isEnabled()) {
          throw new Error('Changing lessons kept a slot with the wrong duration');
        }
        if (!(await page.locator('#slot-table .schedule-slot').count())) {
          await page.locator('#slot-table .schedule-actions button').last().click();
        }
        if (!(await page.locator('#slot-table .schedule-slot').count())) {
          throw new Error('Second lesson has no matching booking slot');
        }
        await page.locator('#slot-table .schedule-slot').first().click();
        if (!(await page.locator('#booking-summary').textContent()).includes('90 мин')) {
          throw new Error('Second lesson price and duration summary is missing');
        }
      }
      if (name === 'search' && width === 390) {
        const firstCard = page.locator('tutor-card').first();
        if (!(await firstCard.locator('.tutorDescription').textContent()).trim() ||
            !(await firstCard.locator('.card-price').textContent()).trim() ||
            (await firstCard.textContent()).includes('Жишээ зар')) {
          throw new Error('Tutor card should show concise listing information');
        }
        await page.locator('#availabilityFilter').selectOption('bookable');
        if (!(await page.locator('tutor-card').count())) {
          throw new Error('Bookable tutor cards are missing');
        }
        await page.locator('#availabilityFilter').selectOption('all');
      }
      if (name === 'home' && width === 390) {
        await page.locator('.site-menu-toggle').click();
        const labels = await page.locator('.site-drawer a span').allTextContents();
        if (labels.join('|') !== 'Тусламж|Хадгалсан багш|Багш болох|Профайл') {
          throw new Error(`Mobile navigation mismatch: ${labels.join('|')}`);
        }
        await page.keyboard.press('Escape');
        if (await page.locator('.site-drawer').isVisible()) throw new Error('Mobile navigation did not close');
      }
    }
    if (width === 390 || width === 1280) {
      await page.goto(base + '/', { waitUntil: 'networkidle' });
      await page.locator('.theme-toggle').click();
      if (await page.locator('html').getAttribute('data-theme') !== 'dark' ||
          await page.locator('.theme-toggle').getAttribute('aria-pressed') !== 'true') {
        throw new Error(`Theme toggle did not enable dark mode at ${width}px`);
      }
      for (const [name, path] of [
        ['home', '/'], ['search', '/pages/SearchResult.html'],
        ['tutor', '/pages/teachInfo.html?id=1'], ['login', '/pages/login.html'],
        ['contact', '/pages/contactTeacher.html?id=1'],
        ['favorites', '/pages/lovedTeachers.html'], ['help', '/pages/question.html'],
        ['profile', '/pages/profile.html'], ['editor', '/pages/becomeTeacher.html'],
      ]) {
        await page.goto(base + path, { waitUntil: 'networkidle' });
        const theme = await page.evaluate(() => ({
          selected: document.documentElement.dataset.theme,
          saved: localStorage.getItem('numteach-theme'),
          background: getComputedStyle(document.body).backgroundColor,
          text: getComputedStyle(document.body).color,
          overflow: document.documentElement.scrollWidth > innerWidth,
        }));
        if (theme.selected !== 'dark' || theme.saved !== 'dark' || theme.overflow) {
          throw new Error(`${name} dark mode is incomplete at ${width}px: ${JSON.stringify(theme)}`);
        }
        await page.screenshot({ path: `artifacts/ui/${name}-dark-${width}.png`, fullPage: false });
      }
      await page.locator('.theme-toggle').click();
      if (await page.locator('html').getAttribute('data-theme') !== 'light' ||
          await page.evaluate(() => localStorage.getItem('numteach-theme')) !== 'light') {
        throw new Error(`Theme toggle did not restore light mode at ${width}px`);
      }
    }
    await context.close();
  }
  if (errors.length) throw new Error(`Browser errors: ${errors.join('; ')}`);
} finally {
  await browser.close();
  if (server) await new Promise(resolve => server.close(resolve));
  db?.close();
}
