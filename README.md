# Numteach

A student tutoring site for NUM students. One account can learn and teach: publish tutor lessons and free time slots, browse tutors without signing in, reserve a slot after signing in, and manage bookings from the profile. Tutors can confirm or decline requests; students can cancel upcoming bookings. Students can review a confirmed lesson after its appointment ends. The UI uses vanilla JavaScript and Web Components; the API uses Express with local SQLite or Neon PostgreSQL.

Tutors set one hourly rate. Each lesson's quoted price is calculated from its duration, and each booking retains the quote made when it was requested. Reviews appear on the tutor profile with the completed course shown as context. From a tutor profile, choose **Холбогдох** to select a lesson, a real available slot from the weekly timetable, and an optional note before submitting a booking request. Guests sign in and return to their saved selection. The tutor then confirms or declines the request; no payment is collected yet. The timetable uses Ulaanbaatar time and does not imply that a tutoring slot is an official university class period.

## Local setup

1. Install Node.js 24 or newer.
2. Run `npm install`.
3. Run `npm start` (or `npm.cmd start` in PowerShell when script execution is disabled).
4. Open `http://localhost:3100`. The server serves both the UI and API. Local startup uses `data/numteach.sqlite`, even if your ignored `.env` also contains `DATABASE_URL`.

Set `PORT` and `DATABASE_PATH` to override the local defaults. To run locally against Neon after its schema has been migrated, set `DATABASE_DRIVER=postgres` and `DATABASE_URL` in your ignored `.env`, then run `npm start`. Render uses Postgres; set its private `DATABASE_URL` and `DATABASE_DRIVER=postgres`. The server reads environment variables directly. See `.env.example`.

Run `npm run db:migrate` to apply local SQLite migrations without starting the server. SQLite migrations also run automatically on local startup. Neon must be migrated explicitly with `npm run db:migrate -- --postgres` before starting the API; test on a separate staging connection before updating production. See [route and data inventory](docs/route-inventory.md).

Local SQLite startup provides ten fictional tutor profiles with two lessons and bookable times for the next four weeks. The data is for testing and is not a claim that these are real NUM students. Sign in as `demo.student@numteach.test` or `demo.tutor1@numteach.test` through `demo.tutor10@numteach.test`; each uses `DemoPass123!`. Book a lesson with the student account, then sign in as that tutor to confirm it. A tutor account can also book another tutor's lesson. Existing bookings and profile edits are preserved when the local server restarts. Demo accounts are not created on Neon/Render; production lists only tutor profiles owned by registered users. Passwords are hashed, and login uses an HttpOnly session cookie.

## Deployment settings

Render Web Service: repository root, `npm ci` build command, `npm start` start command, `/api/health` health check, and private `DATABASE_URL` set to the Neon pooled connection string. Run Neon migrations explicitly against staging and then the intended production branch before starting the updated API. The included `render.yaml` has the same service settings. Vercel: repository root, Other framework preset, `npm run build`, `dist` output, and `RENDER_API_URL` set to the Render origin (without `/api`). Never commit database credentials. After deploying both, check `/api/health` on the Vercel URL and complete a registration and login there.

## Checks

Run `npm test` (or `npm.cmd test`). The tests cover accounts, lessons, reviews, migrations, double booking, status changes, messaging, and access control. Run `npm run check:neon` only against an isolated Neon staging database; it creates temporary accounts that are removed afterward. Run `node scripts/verify-flow.mjs` for the browser flow and `node scripts/verify-ui.mjs` for phone, tablet, and desktop layouts. Both browser scripts use installed Microsoft Edge and an in-memory SQLite database unless `SITE_URL` is provided to the UI check.
