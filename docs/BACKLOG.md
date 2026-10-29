# Assignable backlog

Create these as issues in the **new team repository** after the kickoff. They are written assignments, not issues already created or messages already sent. Every issue has one implementation owner and one reviewer; everyone may contribute through explicitly recorded pairing.

Sizing: **S** = roughly one focused session (1–2 hours); **M** = two sessions (3–4 hours); **L** = split before starting. Estimates include relevant tests and a short handoff but exclude weekly meetings. Re-estimate after the first two days. Keep planned implementation to roughly 75% of available implementation hours; optional issues do not belong in the committed workload.

## First two days: individual evidence

Do F1 together first. F2–F5 can then proceed independently using synthetic response fixtures. These are small working PRs, not slides or assurances that someone understands the task.

| ID | Owner → reviewer | Size | Deliverable and acceptance |
| --- | --- | --- | --- |
| F1 | All; Muhammad opens PR, Salman reviews | S per person | Agree scope/rubric, create new repository with a minimal app and setup guide; everyone runs it. Ahmed records contracts, Muhammad creates skeleton, Salman adds automated checks, Aya adds shared navigation. No existing source copied. |
| F2 | Ahmed → Aya | S | Login form/session skeleton: successful test-account login and signout, visible error state; identify the server session boundary. Supabase configuration may be the only shared setup dependency. |
| F3 | Muhammad → Ahmed | S | Course form and list against a documented fixture: required title validation, submit callback, empty state; explain how a real create call will replace the fixture. |
| F4 | Salman → Muhammad | S | Assignment draft form against a fixture: title, instructions, due time/timezone, max score; invalid data blocked with a useful error. |
| F5 | Aya → Salman | S | Student overview against fixtures: two courses and three deadlines sorted by time, plus empty/loading states; review-screen wireframe with score/feedback fields. |

Each person runs their work in a 3–5 minute walkthrough, explains one design decision, and reviews a teammate's PR. Ask what help/time they need. Rebalance work after this; do not infer skills or motivation from names or an uncertain first conversation.

## Ahmed: identity, membership, and coordination

| ID / target | Size / depends on | Acceptance criteria |
| --- | --- | --- |
| A1 — week 1: trusted identity foundation | M; F1, F2 | Authenticated server client; own `/me`; protected instructor capability; test accounts documented; missing session denied; profile edits cannot grant instructor status. Provisioning steps reproducible without putting secrets in Git. |
| A2 — week 2: enrollment and invite flow | M; A1, M1 | Owner generates/rotates code; code stored as hash and not in student responses; student join/leave UI and API; invalid-code error and attempt limit; duplicate join/rejoin idempotent; direct enrollment insertion cannot bypass join validation. |
| A3 — week 2: shared access helpers | M; A1, M1, A2 | Agreed owner/member checks and non-recursive database helpers; member and outsider fixtures; at least one integration example other owners can use. Other owners still write their feature policies. |
| A4 — weeks 3–4: membership/access regression | M; A2, A3, M3, S3, Y2 | Tests for outsider access, instructor in wrong course, role escalation, leaving/rejoining, and archive permissions; each found issue assigned to its feature owner; access failures block release. |

Weekly coordination: maintain priorities, record decisions, surface blockers, and check integration. Budget about two hours/week including reviews/meetings. Do not add deployment, all migrations, all testing, and everybody's unfinished features to this workstream.

## Muhammad: instructor courses and materials

| ID / target | Size / depends on | Acceptance criteria |
| --- | --- | --- |
| M1 — weeks 1–2: course vertical slice | M; A1, F3 | Own course migration/policies plus create/list/detail/edit screens and endpoints; owner derived from session; instructor J cannot edit I's course; enrolled read policy connected when A2 lands. |
| M2 — week 2: roster, archive, invite integration | M; M1, A2 | Owner sees roster and membership status; student cannot read whole roster; archive blocks new activity and preserves participant read access; course screen calls Ahmed's invite endpoint. |
| M3 — weeks 2–3: material upload and sharing | M; M1, A3 | Private bucket, metadata, upload/publish/list/download screens/API; valid PDF up to 10 MB works; draft hidden from students; outsider blocked by database and storage policies; short-lived URL issued only after access check. |
| M4 — weeks 3–4: material failure paths | M; M3 | Invalid/oversized PDF rejected, upload/metadata failure has cleanup/recovery, delete failure is visible, missing file/expired URL is recoverable; storage tests use normal authenticated clients. |
| M5 — week 5: setup and fresh-install verification | S; core integrated | Document course/material setup; run migrations and seed demo on an empty staging/test environment with a teammate; repair setup gaps. Do not run reset against the reference project's live database. |

If M3 exceeds four focused hours, split upload/metadata from publish/download while keeping Muhammad as owner. Ahmed may pair on permissions but must not take over the feature.

## Salman: assignments and submissions

| ID / target | Size / depends on | Acceptance criteria |
| --- | --- | --- |
| S1 — weeks 1–2: assignment vertical slice | M; A1, M1, F4 | New assignment migration/policies; owner drafts and publishes; member reads published only; course owner derived through course; request cannot choose arbitrary ownership; agreed fixture shared with Aya. |
| S2 — weeks 2–3: independent student progress | S; S1, A2 | Student can set own not-started/in-progress state; other students' progress unchanged; submitted/returned state derived from records; student cannot edit shared assignment definition. |
| S3 — week 3: text submission and receipt | M; S1, A3 | One accepted text submission per assignment/student; time from database; published/current course and enrollment checked atomically; instructor lists own-course submissions, student sees own only; receipt survives reload. |
| S4 — weeks 3–4: submission and deadline edges | M; S3 | Tests for forged IDs/time, duplicate concurrent submissions, late submission, archived course, and outsider writes; one row after retries; published edits obey agreed restrictions; new deadline visible to dashboard. |
| S5 — week 5: automated release checks | S; core integrated | Type/lint/test/build checks run on PRs in new repository; document how to run them; feature owners fix their own failures. Include a route-level instructor → student scenario plus database permission checks. |

Text submission is sufficient for the required product. File submission, revisions/resubmission, and AI validation are separate optional scope and must not delay S3.

## Aya: student overview and instructor review

| ID / target | Size / depends on | Acceptance criteria |
| --- | --- | --- |
| Y1 — weeks 1–2: student overview on real data | M; F5, M1, A2, S1 | `/dashboard` query plus enrolled-course list and chronological deadline agenda; own progress/status only; loading/empty/error states; timestamps shown with timezone. Begin with fixtures while dependencies land. |
| Y2 — week 3: review and returned result | M; S3 | Instructor review screen consumes Salman's endpoint; own feedback migration/policies and write endpoint; score bound enforced against assignment; reviewer derived from session; student result appears in detail/overview after refetch. |
| Y3 — weeks 3–4: independent results and usability | M; Y1, Y2, S2 | Instructor J cannot grade I's course; A sees own feedback, B cannot; score overflow denied by database; keyboard-usable forms with labeled fields; refresh/revisit reflects new data; submitted and returned states independent per student. |
| Y4 — week 5: acceptance checklist and demo fixture | S; core integrated | Shared demo dataset with two instructors, two students, outsider; reset instructions and flow script; another member follows it successfully. Everyone supplies acceptance evidence for their own slice. |
| Y5 — weeks 5–6: overview/review docs and rehearsal | S; Y4 | Document status/feedback behavior; rehearse own segment and collect each member's short segment for backup recording. Everyone writes/presents their own section. |

## Shared milestone issues

| ID / target | Accountable coordinator | Acceptance |
| --- | --- | --- |
| G1 — end week 1: contracts and baseline | Ahmed; all approve | Schema/API fixtures, permission table, availability, rubric, contribution log, and no-source-copy agreement recorded. Features may start with fixtures; auth/course contracts must be ready for week 2. |
| G2 — end week 2: multi-account checkpoint | Muhammad | Live course, two enrollments, published assignment, and blocked outsider demonstrated in staging. Teammates own fixes in their slices. |
| G3 — end week 3: complete workflow | Salman | Live material access, text submission, returned feedback, updated student overview; two-student isolation demonstrated. No optional work until this passes. |
| G4 — end week 4: tested required scope | Aya | Required access/error tests pass; each owner demonstrates their feature and reviews another. Decide together whether there is room for one enhancement. |
| G5 — end week 5: release candidate | Muhammad | Fresh setup, passing checks, draft report/slides, evidence links, and feature freeze. |
| G6 — week 6: final hand-in | Ahmed; all sign off | Rehearsal, recorded fallback, release tag, final report and rubric checklist. Every member owns a presentation segment and confirms contribution accuracy. |

Coordination does not transfer implementation responsibility. These checkpoints do not count as extra feature work assigned to their coordinator.

## Optional, in priority order

Only select one after G4; name an owner, reviewer, estimate, and removal date first.

1. Submission file attachment, jointly scoped by Salman and Muhammad; same privacy and deadline guarantees as text.
2. Instructor announcements, with Muhammad/Aya agreeing authoring and student display contracts.
3. Calendar grid using Aya's existing deadline data; keep the agenda if incomplete.
4. AI course-material summary/chat only if explicitly valued by the rubric and budgeted after core. Every retrieval must enforce current course access; no instructor access to private student conversations and no AI-produced official grades.

## Scope reduction rules

- If anyone has fewer than six hours/week, re-estimate before committing. Reduce extras and visual polish; keep one demonstrable feature per person.
- If G2 slips, cancel all enhancements; use provisioned accounts and an agenda only. Pair immediately on auth/course blockers.
- If G3 slips, keep text-only submission, no resubmission, PDF-only materials, and immediate score/feedback return. Remove AI, email, calendar grid, and attachments from discussion until core passes.
- Do not remove enrollment authorization, private student results, or the end-to-end demonstration to preserve a cosmetic feature.
- If a feature still cannot fit, agree the revised deliverable with the team and instructor early; do not mark incomplete fixture-only screens as done.

## Copyable issue template

```text
Title: [ID] Observable feature or bug
Owner / reviewer:
Target week / estimate:
Depends on:
User story:
Acceptance criteria:
- Observable successful behavior
- Relevant denied/invalid behavior
Data/API contract touched:
Verification/demo steps:
Evidence: PR, check output, demo note
Status / blocker / next update:
```
