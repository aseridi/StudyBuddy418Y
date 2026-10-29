# Ahmed's team-lead playbook

Use this with [PLAN.md](PLAN.md), [BACKLOG.md](BACKLOG.md), and [ARCHITECTURE.md](ARCHITECTURE.md). Lead through small commitments, visible work, and early help. Treat the team as four contributors with unknown experience; do not open with an accusation that people are lazy or disorganized.

## Message to send yourself

The following is a draft for Ahmed to share; no message has been sent.

> Since StudyBuddy started as my personal project, I want our class submission to be something all four of us actually build. I suggest a fresh repository with no copied StudyBuddy code. We can use the idea as a reference and build a smaller course platform with instructor courses, enrollment, shared materials, assignments, submissions, and feedback.
>
> We have about six weeks. My proposed split is: I handle auth/enrollment and coordination; Muhammad handles courses/materials; Salman handles assignments/submissions; Aya handles the student dashboard and instructor review. Each of us owns our feature from interface through data and testing, and we review one another's work. These assignments are open to adjustment based on experience and availability.
>
> Let's meet for 30 minutes, confirm the class requirements and weekly time we can each give, then each finish one small PR within two days. After that we'll have a working demo each week. I can organize the board and integration, but we each need to own our part.

## Kickoff: 30 minutes

| Minutes | Decision / activity | Written result |
| --- | --- | --- |
| 0–5 | Confirm actual deadline, rubric, required documents, and instructor's view on a concept inspired by an existing project. | Due date and deliverables; flag any instructor clarification. |
| 5–10 | Each person describes comfort with Git, TypeScript/React, APIs/SQL, and testing, plus honest weekly availability. | Skills/support needs and capacity; no ranking of teammates. |
| 10–15 | Walk through the single instructor → student → feedback story. Freeze required vs optional scope. | Approved MVP and explicit exclusions. |
| 15–22 | Confirm four owners/reviewers, schema boundary, and the first small tasks. | One first issue per person; shared setup responsibilities. |
| 22–27 | Agree repository access, safe development credentials, board, branch/review rules, and staging responsibility rotation. | Everyone can start; secrets handled outside Git. |
| 27–30 | Set exact times for the first demo, weekly demo, and midweek check. | Calendar commitments and next two-day deliverables. |

Do not spend the meeting designing every screen. Resolve shared contracts; let owners make small reversible implementation choices.

## Weekly rhythm

- **Start of week, async:** each person chooses one ready issue and states deliverable, estimate, and dependency. Ahmed checks total load against available hours.
- **Midweek, 10 minutes:** each person states working evidence, next step, blocker, and any changed commitment. Unblock first; avoid general “how is it going?” discussion.
- **End of week, 20 minutes:** four short demos from the shared build, one integration check, then choose next week's work. Rotate facilitator and note-taker.
- **PR review:** acknowledge within one working day. If the assigned reviewer is unavailable, use another teammate; no single person is the permanent merge gate.

Do not require daily meetings. A short twice-weekly written update and a weekly demo give enough visibility for this project if people follow through.

## Make work visible without micromanaging

Keep one issue board: Backlog → Ready → In progress → Review → Done. “Ready” means its contract/dependency is clear enough to start. One implementation issue in progress per person. Split any issue larger than two focused sessions before it begins.

Use branches such as `feature/course-materials` in the new team repo. Keep PRs small enough for a teammate to explain. One teammate approval and passing checks are the normal merge rule. The owner resolves feedback and demonstrates the feature. Protect the main branch if the repository supports it.

The author includes:

```text
Issue:
What changed and what the user can now do:
Screenshots or short demo steps:
Validation: automated checks and relevant multi-account scenario
Schema/policy/environment changes:
Limitations or follow-up issue:
```

The reviewer checks that the behavior meets the issue, data is real, errors are usable, permissions match the agreed table, and changes stay within scope. A successful local screen with no persistent data is partial progress, not completion.

## Handling blockers and missed work

1. **One day stuck:** ask for the specific error or incomplete behavior. Schedule a 20–30 minute pairing session; the owner drives and explains the fix.
2. **First missed commitment:** ask what changed and agree a smaller deliverable with a new time. Record the adjustment on the issue without judgment.
3. **Repeated missed commitments:** have a private conversation, bring concrete dates/issues, and ask what work they can reliably own. Reassign explicitly with the team's knowledge and update the contribution record.
4. **Continuing lack of participation:** use the syllabus/instructor's team-contribution or peer-evaluation process before the final week. Bring factual evidence, including support offered and revised commitments.

Suggested wording:

> We agreed that the course form would be runnable by Thursday, and it isn't ready for integration yet. What's blocking the next working step? Let's agree on a smaller result you can demonstrate tomorrow and record any help needed.

For repeated slips:

> We have missed this commitment twice, which is blocking the assignment flow. We need to revise the task and ownership today. I can pair for half an hour, but I can't take over the whole feature. What part can you reliably complete by the next checkpoint?

Do not manufacture commits, assign token documentation tasks to imply equal implementation, or silently rescue all late work. Pairing and reassignment are legitimate when recorded honestly. Evaluate outcomes and communication, not commit counts or line counts.

## Avoid making Ahmed the bottleneck

- Keep coordination/review within the planned time budget. If it expands, remove some of Ahmed's implementation scope openly rather than adding overtime by default.
- Each owner writes their own feature migrations, permission tests, docs, and demo steps. Use shared review for cross-cutting changes.
- Rotate release checks, minutes, demo facilitation, and reporting work. Ahmed does not write the entire final report.
- For a 20-minute technical disagreement, write the options and choose the simplest reversible one that satisfies the acceptance criteria. Record the decision; do not redesign the whole app.
- When a shared dependency is late, agree a response fixture and build independent UI work, while fixing the real dependency early. Do not let fixture work conceal an integration delay.

## Contribution and decision records

Maintain this in the new team repository or board. Link PRs and issue evidence, not just verbal summaries.

| Week | Person | Built / fixed | Reviewed / paired | Evidence | Blocker / next commitment |
| --- | --- | --- | --- | --- | --- |
| 1 | Ahmed | To fill after work | To fill | Issue / PR / demo | To fill |
| 1 | Muhammad | To fill after work | To fill | Issue / PR / demo | To fill |
| 1 | Salman | To fill after work | To fill | Issue / PR / demo | To fill |
| 1 | Aya | To fill after work | To fill | Issue / PR / demo | To fill |

For important decisions record: date, problem, chosen behavior, reason, affected contracts, and who agreed. Start with: independent implementation; provisioned accounts; instructor capability; code enrollment; one submission per assignment; text-only submissions; deadline semantics; archive/leave behavior; no required AI.

Keep a provenance note: “StudyBuddy, Ahmed's prior personal project, informed the concept. This application was implemented by the team.” Add any framework-generated scaffolding, third-party assets/libraries, or AI assistance according to class rules. Record any approved exception to the no-copy agreement before importing source. A new repository alone does not establish originality.

## Final demonstration and class report

Target an 8–10 minute walkthrough, adjusted to the class's actual presentation time:

1. **Ahmed:** explain independent build and show student authentication/enrollment; establish instructor, two students, and outsider identities.
2. **Muhammad:** instructor creates a course, shares invite, uploads/publishes a PDF; student accesses it while outsider is denied.
3. **Salman:** instructor publishes an assignment; student A submits text and gets receipt; student B remains unsubmitted.
4. **Aya:** instructor returns A's score/feedback; A sees the result and updated dashboard; B cannot see A's submission/result.

Pre-seed accounts and some content so setup does not consume the presentation. Rehearse with separate browser profiles/sessions. Verify that reload preserves data. Have a short recording and screenshots of the same release available if network access fails.

Each person writes the report section for their feature and supplies evidence. Review the report together for consistency. Likely sections are requirements/use cases, architecture/data model, implementation ownership, testing, collaboration process, limitations, and references; the rubric determines the actual required format.

At feature freeze, confirm the required story works, permission checks pass, setup is reproducible, all four can explain their code, contribution statements are accurate, and all class deliverables have named owners. Reserve the last week for fixes and rehearsal.
