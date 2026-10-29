# Current status and first team assignments

Audit: October 29, 2026, local `studybuddy418y` checkout. Hosted Supabase state, remote Git contents, and collaborator access have not been verified. Update this checklist as work lands.

## Decision

Assign small interface tasks after publishing a common starter and agreeing sample responses. Assign connected features once their specific identity, database, and access dependencies are available. Do not wait for Ahmed to build every backend feature.

Use this checkout as the team starter. Older planning documents discuss creating a fresh repository; this is already the new starter and does not need to be generated again. The architecture and named owners remain proposals for team confirmation.

## Audit

| Area | Observed state | Meaning |
| --- | --- | --- |
| Foundation | Next.js 16.4.3, React 19.3, TypeScript, Tailwind 4 installed | Starter generation is complete. |
| Product interface | Generated home/layout remain; login, dashboard, courses, auth, API, and helper folders are empty | Folder names do not create working routes. |
| Supabase | Libraries installed; `.env.local` exists | No client implementation, session handling, or verified connection. Values were not exposed. |
| Database | No local migrations or policies | Hosted state was not inspected; implement the agreed schema in versioned migrations. |
| Checks | Lint and TypeScript pass; no automated test suite configured | Passing starter checks does not validate product behavior. See README for build results. |
| Git | `main` has no commits; origin is `aseridi/StudyBuddy418Y` | Publish a reviewed baseline before teammates branch. Remote state/access remain unverified. |
| Planning | Architecture, backlog, leadership notes already exist | Confirm the existing proposal instead of creating incompatible plans. |

Cache Components and Partial Prefetching are enabled in `next.config.ts`. Ahmed should settle this shared configuration before auth work merges. Keeping it requires the installed Next.js authentication/Suspense patterns; simplifying it is a team decision, not a change already made by this audit.

## Shared baseline: next short milestone

- [ ] Confirm actual deadline, rubric, weekly availability, and ownership with the team.
- [ ] Review and commit starter, package lockfile, setup instructions, and agreed documents. Keep `.env.local` out of Git.
- [ ] Inspect the remote's state before the first push; publish without force-pushing. Confirm collaborator access. Everyone must run `npm ci` and `npm run dev` from a fresh clone.
- [ ] Agree UI routes, the architecture's camelCase response fields, error shape, and student/instructor behavior. These are proposed contracts, not existing APIs.
- [ ] Each owner contributes synthetic response examples. Commit shared types in `src/types/contracts.ts` and fixtures under `src/lib/fixtures/` before independent pages rely on them. These files do not exist yet.
- [ ] Give shared navigation/basic form styling one owner: proposed Aya. Coordinate root layout/global style edits.
- [ ] Confirm the development Supabase project and private setup-value sharing. Ahmed owns the auth clients; each feature owner owns their feature's migrations and policies.
- [ ] Record lint, type-check, and build results. Assign automated checks to Salman as a separate small task.

Do not mark an interface blocked by unrelated backend work. Course cards can use agreed fixtures; real course creation needs verified identity and database permissions.

## Proposed ownership

| Person | Owns through interface, endpoints, data, permissions, and tests | First reviewer |
| --- | --- | --- |
| Ahmed | Login/logout, server identity, instructor capability, enrollment/invites; coordination | Aya |
| Muhammad | Course list/create/details/edit, roster, shared materials | Ahmed |
| Salman | Assignment forms/list/detail, individual progress, text submissions | Muhammad |
| Aya | Shared navigation, student dashboard, instructor review/feedback | Salman |

Confirm the split based on availability and experience. Keep course list and details together initially because their data/components overlap. Assigning everyone screens while Ahmed writes every endpoint would overload the lead.

## First task cards

Aim for roughly one or two focused sessions per interface PR, then re-estimate from evidence. Agree actual due times with the team. A fixture checkpoint is smaller than a finished connected feature.

### T1 — Ahmed: real login/logout

- **Depends on:** development Supabase project/test accounts and a settled session/configuration approach.
- **Files:** `src/app/login/`, `src/lib/supabase/`, shared server identity helper, session refresh support as required by the selected setup.
- **Acceptance:** labeled email/password form; submitting state; valid credentials reach `/dashboard`; invalid credentials show useful feedback; login survives refresh; logout ends access to protected server content.
- **Handoff:** document how pages/endpoints obtain the verified user. Teammates must not create competing auth helpers or trust submitted user IDs.
- **Boundary:** coordinate a minimal dashboard destination with Aya before completing the redirect test. Public signup, reset, and callback flows are separate unless the selected login method needs them.

### T2 — Muhammad: course list using fixtures

- **Depends on:** agreed course response and `/courses` route.
- **Files:** `src/app/courses/page.tsx`, `src/components/courses/`, course fixture.
- **Acceptance:** two courses with title, description, membership kind, and detail links; empty state; demonstration of loading/error presentation; instructor create and student join integration placeholders identified.
- **Handoff:** reusable course card, example response, screenshots/demo steps.
- **Boundary:** no claim of persistent creation, enrollment, or access enforcement. Real endpoint integration is a follow-up.

### T3 — Aya: navigation and student dashboard using fixtures

- **Depends on:** dashboard/assignment response examples. Land navigation as a small first PR if others need it.
- **Files:** `src/app/dashboard/`, navigation/dashboard components and fixtures. Coordinate root layout/global CSS changes.
- **Acceptance:** navigation to dashboard/courses; two enrolled course summaries; three upcoming deadlines sorted by time with timezone; empty/error presentation; usable narrow-screen layout.
- **Handoff:** list the response fields needed from course, enrollment, assignment, and feedback owners.
- **Boundary:** fixture content is visibly development data. Replace it with authorized real data once dependencies land.

### T4 — Salman: assignment draft form using fixtures

- **Depends on:** assignment fields and a course fixture ID.
- **Files:** `src/components/assignments/`; proposed UI route `src/app/courses/[id]/assignments/new/page.tsx`, agreed with Muhammad first.
- **Acceptance:** title, instructions, due date/time and explicit timezone, positive maximum score; required-field errors; fixture callback demonstrates submitting/success/error behavior; selected course is clear.
- **Handoff:** example request/response shared with Aya for dashboard/review integration.
- **Boundary:** persistent saving/publishing is a follow-up; the real endpoint must verify course ownership.

### T5 — Muhammad: course details, after T2

- **Depends on:** T2 and agreed details response.
- **Files:** `src/app/courses/[id]/page.tsx`, course components.
- **Acceptance:** known fixture ID shows course details; unknown ID shows unavailable state; materials/assignment sections have agreed integration points; student/instructor controls show intended differences.
- **Boundary:** role-dependent buttons preview the UI; server/database permissions are still required. Do not assign list/details simultaneously to different people without splitting component and contract ownership first.

## When connected work becomes ready

| Feature | Dependency | Owner's completion evidence |
| --- | --- | --- |
| Course create/list/details | Verified identity/instructor capability; course schema/policies | Muhammad creates a persistent course; another instructor cannot edit it. |
| Enrollment | Identity, course records, membership/invite rules | Ahmed enrolls two students, denies outsider access, and avoids duplicate memberships. |
| Assignments | Course ownership/membership, draft/published rules | Salman publishes a real assignment; members can read it, outsiders cannot, drafts stay hidden. |
| Dashboard | Real enrollment/course/assignment responses | Aya shows the signed-in student's own courses/deadlines, loading/errors, and current results. |
| Submissions | Published assignment, active enrollment, deadline/uniqueness rules | Salman shows a persistent receipt; a second student's work stays independent. |
| Feedback | Submission contract, owner permission, score rules | Aya returns a valid score; only the associated student sees their result. |
| Materials | Course access helpers, private storage, metadata/policies | Muhammad publishes a PDF; members can download it and outsiders cannot. |

Ahmed and Muhammad review identity/course/enrollment interfaces early to avoid mutually blocking dependencies or recursive database policies. Every owner writes their feature's migrations, policies, relevant tests, and handoff notes. Ahmed coordinates consistency.

## Lead the work

1. One board: Backlog → Ready → In progress → Review → Done. Every issue has one owner, reviewer, dependency, acceptance criteria, and demo steps. One active issue per person.
2. Distinguish “interface complete with fixtures” from “connected feature complete.” A mock screen does not close the real feature issue.
3. Use small task branches, for example `codex/course-list`. Require a teammate review and relevant checks; coordinate shared schema/configuration changes.
4. Twice weekly ask what runs, what comes next, and the exact blocker. After a day stuck, pair briefly and shrink the task while the owner drives.
5. Demo merged work regularly from a shared build; isolated branches do not prove integration.
6. Protect Ahmed's capacity. Rotate routine release checks and reporting; owners fix their own feature failures. Do not silently take over unfinished features.
7. First complete: instructor creates course → student joins → assignment published → submission → feedback → student sees result. AI, email, calendar grid, and extra polish wait.

## Next checkpoint

Everyone runs the same committed starter and demonstrates their first small PR. Ahmed demonstrates session behavior; Muhammad the list; Salman the form; Aya navigation/dashboard. Review response contracts and assign the next connected slices from [BACKLOG.md](BACKLOG.md). Use [ARCHITECTURE.md](ARCHITECTURE.md) for schema/access agreements and [LEADERSHIP.md](LEADERSHIP.md) for the meeting/review rhythm. Confirm dates rather than assuming the earlier six-week proposal is the actual deadline.
