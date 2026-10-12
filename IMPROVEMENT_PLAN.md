# Numteach: full product rebuild plan

## Implementation progress

- **Current product decision:** One hourly rate per tutor. A lesson's displayed price is calculated from its duration, and the booking stores that price as a snapshot. Availability belongs to the tutor; students select a course, then a free time from a weekday/time table. Reviews are displayed only on the tutor profile, with the course taken shown as context from the confirmed booking. Earlier lesson-specific pricing and review language below describes the original plan and is superseded by this decision.
- **Foundation started:** Added versioned baseline migrations for SQLite and Neon, a migration command, preservation tests for existing local data, and a [route inventory](docs/route-inventory.md). Removed the obsolete mock tutor wizard from the active page. Local API tests, static build, and browser booking flow pass.
- **Still required for foundation:** Rotate the exposed Neon credential, create an isolated staging branch, run migrations and a restore rehearsal there, and verify the deployed Vercel → Render → Neon path. Those steps need the service accounts and deployed URLs.
- **Tutor/lesson slice implemented locally:** Each lesson has its own record, course code, description, duration, and mode. Its price is derived from the tutor's hourly rate. Existing lessons are backfilled by migrations; old booking names remain readable. Tutor cards show the lesson, hourly rate, mode, next free slot, and an honest no-review state. New bookings record the lesson ID and a snapshot of its terms, require a matching slot duration, and preserve a guest's selection through sign-in. Reviews are accepted only from the student after a confirmed appointment ends, appear on the tutor profile, and show the course taken. Seeded comments and ratings are not shown as genuine reviews.
- **Next code milestone:** Finish the appointment state machine and concurrency protection, then add notifications, moderation, account recovery, and deployment verification. The review flow and new screens are verified locally; they have not been checked on Neon or a deployed domain.

## Goal and launch rules

Numteach lets a NUM student learn and teach using the same account. Anyone can browse; a user signs in when booking. Any email can register at the first launch. A tutor's NUM affiliation is **unverified** until there is a real verification process. Keep the existing warm, minimal visual style, but make every page use one design system. This document is the plan; it does not mark the work below as implemented.

The primary journey is: find a relevant **live** tutor → understand one lesson and its price → choose an available time → sign in if needed → request the appointment → receive a decision → attend → leave a review tied to that appointment. The secondary journey is: register → create a tutor profile and lessons → add availability → receive and manage requests → teach and receive reviews. One user can follow both journeys.

## Findings at the start of the rebuild

- `server/webapp.mjs` stores lessons as JSON inside one tutor row. Tutor description, tutor biography, and lesson description are broad text fields. The public list returns all tutors, including seeded samples.
- `server/database.mjs` and `server/postgres.mjs` store `feedback`, `retings`, and `number_of_ratings` on tutors. The UI renders those fields, but there is no live review creation API or relational link from a review to a tutor, lesson, student, or completed booking. Seeded comments must not be presented as authentic student reviews.
- `js/components/tutor-card.js` emphasizes the image, name, rating, and short description. It hides price on the home page and does not show a specific lesson, teaching mode, next open time, or reliable verification state.
- `js/components/tutor-more-page.js` shows the same generic lesson description for every listed course, then presents independent course and time dropdowns. The backend checks that the selected course belongs to the tutor, but lessons are not first-class records.
- `server/bookings.mjs` blocks exact double booking with a unique active-booking index. Its overlap check for new tutor slots is read-then-write, so simultaneous requests may create overlapping slots. Booking has pending, confirmed, declined, and cancelled states, but no completed or expired state, reminders, or review eligibility.
- `js/pages/tutor-editor.js` creates a live profile with minimal field validation and one-time slots. Course suggestions come from existing listings. Some HTML still contains old mock interfaces or inconsistent navigation. The old `routes/` and `module/` backend and the current `server/` backend coexist, so obsolete paths need an inventory before removal.

## Product and information design

### Search result / tutor card

Show only information useful for choosing whom to inspect:

1. Tutor name and a real photo or consistent initials fallback. Never use a fake identity photo.
2. Subject or course **code and title**, a short lesson headline, and teaching mode (online, in person, or both).
3. Tutor hourly rate and calculated lesson price, for example `20,000₮ / цаг · 30,000₮ / 90 мин`. If the rate is zero, say `Үнэгүй`.
4. Next bookable time in `Asia/Ulaanbaatar`, or a clear `Одоогоор сул цаггүй` label.
5. Rating and review count **only from eligible, published reviews**. Show `Шинэ багш · сэтгэгдэлгүй` when there are none; never show `0/5` as a rating.
6. Verification badge only when an actual check was approved. Distinguish `МУИС-ийн мэдээлэл баталгаажсан` from an ordinary self-written bio.
7. One line of teaching approach and a clear `Дэлгэрэнгүй` action. A sample/demo card, if retained, has a persistent `Жишээ` label and cannot enter booking or pollute real rankings.

The list should be filterable by course, mode, price, and available date, with a default order that favors relevant bookable tutors. This follows the principle of showing comparison attributes on list items rather than forcing repeated visits to detail pages ([Baymard product-list research](https://baymard.com/research-articles/product-listing-information)); the exact tutoring fields above are our product inference.

### Tutor profile and lesson detail

The tutor profile answers **who teaches and why trust them**: name, photo/fallback, self-reported program/year and experience, teaching approach, teaching modes and location rules, verified status and what was checked, response expectations, all published lessons, review summary, and recent eligible reviews. Private email and phone stay hidden until the booking rules permit contact.

Each lesson has its **own** record and detail: course code/title, short headline, level/prerequisites, what the learner will cover, session format and duration, calculated price from the tutor's hourly rate, online/in-person location policy, materials or preparation, tutor, and matching slots. Avoid repeating one generic `lesson_info` paragraph for unrelated courses. Display price and time terms again at booking confirmation. Show reviews on the tutor profile with the course taken as context.

### Reviews/comments

Use a `reviews` table with `booking_id` (unique), `tutor_id`, `lesson_id`, `student_user_id`, score, text, timestamps, and moderation state. The server derives tutor, lesson, and student from the booking; the client cannot choose those foreign keys. Only the student on a **confirmed appointment whose end time has passed** can review it once. Block self-reviews and reviews of samples. Provide a report action and moderation history; hiding a review does not erase the booking. Tutor-wide rating is calculated from visible eligible reviews. Show comments only on the tutor profile, with the course taken from the booking as context. Show the visit date with each review and label seeded testimonials as demo content or remove them. Research and platform guidance emphasize truthful review presentation ([FTC review guidance](https://www.ftc.gov/business-guidance/advertising-marketing/endorsements-influencers-reviews)); applicable local rules still require separate review.

### Tutor validation and publishing

Separate **form completeness**, **identity/NUM verification**, and **listing publication**. A signed-in user can draft and edit a tutor profile and lessons. Validate required fields, length, allowed values, safe image uploads, price/duration, and course selection on both client and server; preserve valid input after errors and show the error beside the field. A completed, safe listing can publish with `Unverified` status at first launch. Only a documented admin review may award a verification badge. If moderation later requires approval before publishing, give the tutor an explicit pending/rejected state and a reason. Never automatically mark all registrants as NUM students.

### Appointment contract

- Store slots and booking times as instants, render them explicitly in Ulaanbaatar time, and show date, start, end, course, tutor, mode, duration, price, and current status before confirmation.
- A guest can inspect slots, but booking redirects to sign-in and returns to the same lesson/slot. The server rechecks availability and eligibility after sign-in.
- A tutor cannot book themself. A student cannot take an inactive, expired, overlapping, or already reserved slot. Concurrent slot creation and booking must be protected by database transactions/constraints, not a UI check alone. Retries need idempotency keys.
- Define transitions: `pending → confirmed | declined | cancelled | expired`; `confirmed → completed | cancelled`; terminal states cannot be confirmed later. A pending request expires no later than the session start. Both parties see status changes. Any cancellation policy and contact release must be visible before request submission.
- A declined or cancelled future booking can release its slot; a confirmed booking must never silently disappear. Keep event history with actor and timestamp. Send transactional notices after a committed state change and retry failures without duplicate messages.

## Feature inventory and target behavior

| Feature | Target behavior / completion check |
| --- | --- |
| Public home and search | Live lessons/tutors are discoverable with useful filters; samples are separated and never bookable; empty, loading, and error states are clear. |
| Registration, login, recovery | Any email may register; passwords are protected; reset/verification email and abuse limits work; sign-in returns a booker to the chosen appointment. |
| One account, two roles | The same user can create a tutor listing and book a different tutor; dashboards clearly separate learning and teaching tasks. |
| Tutor profile and lessons | Draft/edit/publish multiple first-class lessons with course, format, duration, and lesson-specific description; one tutor hourly rate determines every lesson's price. |
| Availability | Add one-time and recurring hours with exceptions; prevent overlap and conflicts with active bookings; show the same free slots publicly and to the tutor. |
| Appointments | Request, accept/decline, cancel, expire, complete, and inspect history; ownership and transitions are enforced server-side. |
| Reviews | Only a completed booking's student can review once; comments and derived ratings appear on the tutor page with the course taken shown as context. |
| Messaging and notices | Messages belong to a real tutor/lesson or booking; authorized users can read them; email/onsite notices reflect actual events. |
| Favorites | A signed-in user's saved tutors persist across devices; guest saves, if offered, are clearly local and can be imported on sign-in. |
| Trust and support | Report a tutor/review/message, review moderation queue, honest verification labels, functioning help/contact channels. |
| Account and privacy | Edit account, sign out, manage sessions, request export/deletion, and see what contact data becomes visible after booking. |
| Deployment and operations | Vercel UI → Render API → Neon works on real domains, with health checks, logs, staging, backup/restore rehearsal, and a rollback procedure. |

## Data and migration plan

Introduce versioned migrations for `users`, `tutor_profiles` (one per user), `courses`, `tutor_lessons` (many per tutor), `availability_rules`, `availability_exceptions`, `slots`, `bookings`, `booking_events`, `reviews`, `messages`, `favorites`, `verification_requests`, and `notification_outbox`. Use foreign keys, uniqueness, check constraints, indexes, and appropriate time types in Postgres; keep local SQLite behavior equivalent. Split existing tutor `lessons` JSON into lesson records and keep stable IDs or mapping for old URLs. Preserve existing users, bookings, messages, and slots. Do not convert seeded feedback into genuine reviews. Test migration and rollback on a Neon staging branch before touching production. Rotate the database credential already shared during development.

## Delivery sequence

1. **Foundation and contracts.** Inventory every active route/page, remove ambiguity between legacy and current backend, write API/schema contracts, create migrations and staging, preserve existing data, and rotate credentials. **Gate:** old accounts/listings/bookings survive migration; fresh database initializes; no secret in Git.
2. **Tutor and lesson publishing.** Implement first-class lessons, tutor form validation, draft/publish states, course catalog/custom-course policy, and honest verification labels. **Gate:** one user publishes two distinct lessons; invalid data never persists; public pages reflect edits immediately.
3. **Discovery and detail redesign.** Build the card and tutor/lesson pages defined above, consistent navigation, responsive layouts, and relevant search. **Gate:** a visitor compares tutors and reaches the right lesson and slot on phone and desktop without encountering demo content as real supply.
4. **Availability and appointments.** Implement safe recurring/one-time slots, state machine, concurrency, sign-in return path, booking summary, cancellation and event history. **Gate:** parallel booking/overlap tests pass in SQLite and Neon; all student/tutor actions work end to end in a browser.
5. **Real reviews and trust.** Link review to completed booking and lesson, compute ratings, moderate reports, and build verification review flow. **Gate:** review ownership, one-per-booking, lesson scoping, zero-review displays, and moderation are covered by API and browser tests.
6. **Communication and account.** Add password recovery, email verification, notifications, message context, favorites sync, privacy controls, and admin/support tools. **Gate:** every event reaches the correct account once; recovery and abuse tests pass.
7. **Release quality.** Run visual and accessibility audits across all routes at phone/tablet/desktop widths, keyboard and screen-reader passes, performance checks, CI, staging restore, and deployed Vercel → Render → Neon smoke tests. **Gate:** critical flows pass on the real domain with no broken links, console errors, or unexpected API failures. Use [WCAG 2.2 AA](https://www.w3.org/TR/WCAG22/) for accessibility and [OWASP authentication guidance](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) for auth hardening.

## Product decisions to settle before implementation

- Should verified NUM affiliation require a university email, student document/manual review, or another approved method? First launch can keep all-email registration and no badge.
- Are appointments free to arrange, or will Numteach collect payments later? Do not imply in-app payment until its booking, refund, and payout rules are designed.
- What is the cancellation deadline and who may mark a lesson completed or disputed? Default for the first implementation: cancellation until start; completion only after a confirmed slot ends; disputed appointments require admin review.
- Is the course catalog maintained manually, or is there an authorized official NUM source? Start with a curated list plus clearly labeled custom courses.
