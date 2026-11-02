# StudyBuddy418Y: Team plan

Updated November 2, 2026. This replaces the October 29 plan. Questions go to Ahmed.

## Where the project is

Working code (on `main` once the open branches are merged):

- **Accounts:** sign up with email confirmation, log in, log out, forgot/reset password.
- **Dashboard shell:** sidebar, header with user menu, protected routes.
- **Courses:** list, create, view, edit, delete.
- **Assignments:** list, create, view, edit, delete, linked to courses in both directions.

The **database is already built.** `supabase/migrations/001_initial_schema.sql` has been applied to the development Supabase project. It includes tables for calendar events, notifications, materials, submissions and chat, with row-level security. **None of the tasks below need database changes.**

The app is being rebuilt feature by feature from a reference project: `github.com/aseridi/studious-journey`. Ask Ahmed for access if you can't open it.

## Setup (one time)

```bash
git clone https://github.com/aseridi/StudyBuddy418Y.git
cd StudyBuddy418Y
npm ci
cp .env.example .env.local     # Ahmed sends you the two values privately
npm run dev
```

Open http://localhost:3000/signup, sign up with a **real** email address, and click the confirmation link **in the same browser**. You should land on `/dashboard`.

## How to work

1. **Start from the latest `main`:**
   ```bash
   git switch main && git pull
   git switch -c your-feature-name
   ```
2. **Follow the same steps every feature uses:**
   1. Read the table in `src/types/database.ts`. List the required columns, the ones you'll use now, and the ones to ignore for now.
   2. Open the matching folder in the reference project. Copy only the parts your task card lists. **The reference project sometimes uses column names that don't exist in our database; `database.ts` is always right.**
   3. Build in this order, testing each step before the next: list → create → view → edit → delete.
   4. Start each new file by copying the closest working file in this repo (`courses/` and `assignments/` are complete examples), then search it for the old name and change every match.
3. **Open a pull request to `main`** with "how to test" steps. Ahmed reviews it. Small PRs get reviewed faster.

### Security rules

- In a file that starts with `'use client'`, import `createClient` from `@/lib/supabase/client`. In API routes, import it from `@/lib/supabase/server`.
- **Never trust ids sent from the browser.** API routes get the user from `supabase.auth.getUser()`. If a request includes a `course_id` (or any other foreign key), query that row first to confirm the user owns it. See the ownership check in `src/app/api/assignments/route.ts`.

### Files you own vs. shared files

You own everything inside your task's folders. **Do not edit these shared files**, except for the one-line additions named in your task:

| Shared file | Owner |
|---|---|
| `src/proxy.ts` | Ahmed. You may add your route to `protectedRoutes`. |
| `src/app/(dashboard)/layout.tsx` | Ahmed. You may add your page to the `navigation` array. |
| `src/lib/supabase/*`, `src/contexts/AuthContext.tsx` | Ahmed |
| `src/components/ui/*` (Button, Input) | Ahmed. Use them, don't change them. |
| `src/types/database.ts`, `supabase/migrations/*` | Ahmed. If you need a database change, open an issue instead. |
| `package.json`, `next.config.ts` | Ahmed. Ask before installing a package. |

Keeping to this means nobody's pull request breaks anyone else's.

---

## Task: Muhammad, Settings page

**Goal:** a student can view and edit their profile.

- **Your files:** `src/app/(dashboard)/settings/page.tsx`, `src/app/api/profile/route.ts`, anything under `src/components/settings/`
- **Table:** `profiles`. Use `full_name`, `current_semester`, `timezone`. Show `email` read-only.
- **Reference:** `studious-journey/src/app/(dashboard)/settings/page.tsx`. It's 630 lines; use only the profile section.
- **Steps:**
  1. Page loads the profile. `useAuth()` already gives you `profile`.
  2. A form with the three fields. Make `timezone` a `<select>` with a few US time zones.
  3. A `PUT /api/profile` route that updates **only** `profiles` where `id = user.id` (from `getUser()`, never from the body).
  4. After saving, call `refreshProfile()` from `useAuth()` so the header's initials update.
- **Shared-file lines:** add `'/settings'` to `protectedRoutes`, and Settings to the sidebar.
- **Not in this task:** notification preferences, deleting the account, dark mode.
- **Done when:**
  1. Changing your name updates the header initials after saving.
  2. The change survives a page reload.
  3. Logged out, `/settings` redirects to `/login`.

## Task: Salman, Calendar (agenda view)

**Goal:** one list of everything with a date: custom events plus assignment due dates.

- **Your files:** `src/app/(dashboard)/calendar/`, `src/app/api/calendar/`, `src/components/calendar/`
- **Tables:** `calendar_events` (required: `title`, `event_type`, `start_time`; use `end_time` and `course_id`), and read `assignments` for due dates.
- **Reference:** `studious-journey/src/app/(dashboard)/calendar/` and `src/components/calendar/`. Copy logic, not the month grid.
- **Steps:**
  1. **Agenda page:** load upcoming `calendar_events` and upcoming `assignments` (with `courses(name)`), merge them into one list sorted by date, and group by day.
  2. **Create a custom event:** title, start time (`datetime-local`, converted with `toISOString()`, the same as `AssignmentForm`), optional end time, optional course dropdown. Use `event_type: 'custom'`. Add a `POST /api/calendar` route **with the course ownership check** when a course is chosen.
  3. **Delete a custom event:** `DELETE /api/calendar/[id]`.
- **Shared-file lines:** `'/calendar'` in `protectedRoutes`, and Calendar in the sidebar.
- **Not in this task:** the month grid, recurring events, editing events (v2), syncing assignments into `calendar_events`.
- **Done when:**
  1. An event created for 7:00 PM shows at 7:00 PM.
  2. Assignment due dates appear in the agenda.
  3. Another user's events never appear.
  4. Deleting a course removes its events (database cascade).

## Task: Aya, Dashboard home, then Progress

**Goal:** replace the "Welcome" placeholder with a useful overview. This task is read-only, so no API routes are needed.

- **Your files:** `src/app/(dashboard)/dashboard/page.tsx` (yours now), `src/components/dashboard/`. Later, `src/app/(dashboard)/progress/`.
- **Tables:** `assignments` (with `courses(name)`) and `courses`.
- **Reference:** `studious-journey/src/app/(dashboard)/dashboard/page.tsx` and `src/app/(dashboard)/progress/`.
- **Dashboard steps:**
  1. Keep the welcome line.
  2. **"Due in the next 7 days":** assignments with `due_date` between now and 7 days from now, not `completed`, soonest first. Each one links to `/assignments/[id]` and shows its course name.
  3. **"Your courses":** each course with a link and its number of assignments.
  4. An empty state for each section.
- **Then Progress (second PR):** per course, a count of assignments by `status`, and the number overdue (past due and not completed). Add `'/progress'` to `protectedRoutes` and to the sidebar.
- **Not in this task:** charts, AI summaries, study time tracking.
- **Done when:**
  1. An assignment due in 3 days shows; one due in 10 days doesn't; a completed one doesn't.
  2. A new account sees the empty states, not errors.

## Ahmed (lead)

- **First:** merge `components` → `courses` → `assignments` into `main`, so everyone starts from the same code.
- Review every pull request within two days.
- Continue the core: materials (file uploads), then AI chat.
- **Design the instructor side** (below).

## Instructor side (new, not in the reference project)

Instructors create a course for a class, students join it, instructors publish assignments and review submitted work.

**Why Ahmed starts it:** today every course belongs to one student (`courses.user_id`). Instructor courses need roles, an enrollment table, and new security policies on `courses`, `assignments` and `work_submissions`. That one change touches every existing feature, so it has to be designed in one place.

- **Phase 1 (Ahmed):** one migration adding `profiles.role`, an `enrollments` table (course ↔ student), join codes, and the updated policies.
- **Phase 2 (open to the team once Phase 1 is merged):** instructor pages under `src/app/(instructor)/`: create a class course, view the roster, publish assignments to enrolled students, review submissions and give feedback. Task cards will be written when Phase 1 lands. Finishing your current task first is how you get first pick.
