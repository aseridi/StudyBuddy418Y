# StudyBuddy418Y: Team plan

Updated November 6, 2026. This replaces the November 2 plan. Questions go to Ahmed.

## Where the project is

Working code (on `main` once the open branches are merged):

- **Accounts:** sign up with email confirmation, log in, log out, forgot/reset password.
- **Dashboard shell:** sidebar, header with user menu, protected routes.
- **Courses:** list, create, view, edit, delete.
- **Assignments:** list, create, view, edit, delete, linked to courses in both directions.

The **database is already built.** `supabase/migrations/001_initial_schema.sql` has been applied to the development Supabase project. It includes tables for calendar events, notifications, materials, submissions and chat, with row-level security. `002` adds `materials.summary` and stops duplicate reminders. **None of the tasks below need database changes.**

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

## Task: Salman, Archive courses

**Goal:** a student can archive a course they've finished, so it leaves their active list without deleting anything.

- **Your files:** `src/app/api/courses/[id]/archive/route.ts` (new), plus the archive button and filter in `src/app/(dashboard)/courses/page.tsx` and `src/app/(dashboard)/courses/[id]/page.tsx`.
- **Table:** `courses`. Use `is_active` (`true` = active, `false` = archived). No database change.
- **Steps:**
  1. **API:** `PATCH /api/courses/[id]/archive` with body `{ archived: boolean }`. Get the user from `getUser()` and update **only** `is_active`, where `id` matches **and** `user_id = user.id`. Return 404 if no row was updated. Don't change the existing `PUT` route.
  2. **Course detail page:** an "Archive" button (or "Unarchive" when archived). Ask for confirmation before archiving.
  3. **Course list:** show active courses by default, plus a "Show archived" toggle that lists archived ones under their own heading.
  4. **Assignment form:** the course dropdown in `AssignmentForm` lists active courses only. This is a one-line filter; mention it in your PR.
- **Not in this task:** deleting courses (already built), archiving assignments.
- **Done when:**
  1. Archiving a course hides it from the list; "Show archived" brings it back, with its assignments intact.
  2. Unarchiving returns it to the active list.
  3. Another user's course id in the request returns 404 and changes nothing.

## Task: Aya, Assignment list filters

**Goal:** make the assignments page easy to scan when there are many assignments. This task is read-only, so no API routes are needed.

- **Your files:** `src/app/(dashboard)/assignments/page.tsx` and a new `src/components/assignments/AssignmentFilters.tsx`.
- **Tables:** `assignments` (with `courses(name)`), already loaded by the page.
- **Steps:**
  1. **Filter by course:** a dropdown with "All courses" plus the student's courses.
  2. **Filter by status:** All / Not started / In progress / Completed.
  3. **Sort:** by due date (default, soonest first) or by priority (high → low).
  4. **Overdue badge:** an "Overdue" label on assignments past their due date that aren't completed.
  5. An empty state when no assignment matches the filters ("No assignments match these filters").
- **Not in this task:** saving filter choices, search by text, the dashboard (Ahmed is building "Due soon").
- **Done when:**
  1. Choosing a course and a status shows only matching assignments.
  2. An assignment due yesterday and not completed shows "Overdue"; a completed one doesn't.
  3. Clearing the filters shows everything again.

## Ahmed (lead)

- Review every pull request within two days.
- Build the rest of the MVP, in this order:
  1. "Due soon" on the dashboard, then the calendar (UC-03, in-app part).
  2. Material upload and summaries (UC-04).
  3. AI study chat (UC-05).
  4. AI draft check on assignments (US-11).
  5. Email reminders (UC-03, email part).

## Dropped: instructor side

The instructor/class-course idea from the previous plan is **out of scope**. It isn't part of our Milestone 1 and 2 requirements, which describe a personal study planner for individual students. Don't start work on roles, enrollments or instructor pages.
