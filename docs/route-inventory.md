# Current route and data inventory

This is the active application map as of the first rebuild milestone. It records what must keep working while the tutor, lesson, review, and appointment model changes.

## Running entry points

- `app.mjs` uses SQLite (`DATABASE_PATH`) by default, or Neon (`DATABASE_URL`) when `DATABASE_DRIVER=postgres` or on Render, then mounts `createApp` from `server/webapp.mjs`.
- `server/webapp.mjs` owns the HTTP API and static UI. `server/bookings.mjs` adds availability and booking endpoints. `server/auth.mjs` owns cookie sessions.
- `api/proxy.js` forwards Vercel `/api` traffic to Render. `scripts/build-static.mjs` copies the UI for Vercel.
- `routes/*.mjs`, `module/*.mjs`, and `swagger.mjs` are legacy backend code: `app.mjs` does not import them. Keep them until tests and references are migrated, then remove them deliberately.

## Public pages

| URL | Active client entry | Current purpose |
| --- | --- | --- |
| `/` or `/index.html` | `js/pages/index.js` | Home, search entry, tutor cards |
| `/pages/SearchResult.html` | `js/components/tutor-list.js` | Search and filters |
| `/pages/teachInfo.html?id=…` | `js/pages/more.js` | Tutor detail, slots, booking, seeded comments |
| `/pages/contactTeacher.html?id=…` | `js/pages/contact.js` | Send tutor message |
| `/pages/login.html` | `js/login.js` | Register and sign in |
| `/pages/becomeTeacher.html` | `js/pages/tutor-editor.js` | Tutor listing and slots; the old mock wizard has been removed |
| `/pages/profile.html` | `js/pages/profile.js` | Account, tutor listing, bookings, messages |
| `/pages/lovedTeachers.html` | `js/pages/loved.js` | Browser-local favorites |
| `/pages/question.html` | Page markup | Help |

## API contract in use

| Area | Routes | Main data |
| --- | --- | --- |
| Health | `GET /api/health` | DB connectivity |
| Discovery | `GET /api/teachers`, `GET /api/teachers/search`, `GET /api/teachers/:id`, `GET /api/teachers/:id/reviews`, `GET /api/lesson` | Tutor rows, first-class lessons, verified booking reviews |
| Accounts | `POST /api/students`, `POST /api/students/login`, `POST /api/logout`, `GET /api/me`, `PUT /api/me` | Users and sessions |
| Tutor publishing | `PUT /api/tutor-profile`, `PUT /api/tutor-lessons/:id` | One tutor row per account; each lesson has details, price, duration, and mode |
| Availability | `GET /api/teachers/:id/slots`, `POST /api/tutor-slots`, `DELETE /api/tutor-slots/:id` | One-time slots |
| Appointments | `POST /api/bookings`, `GET /api/bookings`, `PATCH /api/bookings/:id` | Pending/confirmed/declined/cancelled bookings, lesson ID and price/duration/mode snapshot |
| Reviews | `POST /api/reviews` | One review per completed confirmed booking, linked to tutor, lesson, and student |
| Messages | `POST /api/messages`, `GET /api/messages` | Messages to a tutor |

Seeded `feedback` and rating columns remain stored for data preservation but are not published as genuine reviews. Public ratings come from eligible reviews in the new `reviews` table.

## Migration and release notes

- `server/migrations.mjs` records versions 1–5 in `schema_migrations`: baseline, first-class lessons, booking lesson links, reviews, and booking term snapshots. It can initialize a fresh database and adopt an existing one without deleting users, tutors, slots, bookings, or messages. Append a new version for future changes; never edit an applied migration.
- `npm run db:migrate` applies migrations without starting the web server. Local SQLite applies them on startup; Neon startup checks the schema version and requires the explicit migration command first.
- Test future migrations on an isolated Neon staging branch. The shared production Neon connection string was exposed in conversation and must be rotated in Neon, then replaced in Render. Neither rotation nor staging setup can be completed from repository code alone.
- Before removing legacy files, search for imports and test all public URLs above. Before changing API response shapes, migrate all UI callers and keep existing booking data readable.
