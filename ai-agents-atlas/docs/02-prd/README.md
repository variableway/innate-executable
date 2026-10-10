# Product requirements index

## Product objective

Evolve Atlas from a small content preview into a complete, static-first
tutorial platform without losing its low operational cost or authoring
simplicity.

## Product modules

| Module | PRD | Primary outcome |
|---|---|---|
| M1 Content and discovery | [`01-content-discovery.md`](01-content-discovery.md) | Readers find and navigate a coherent curriculum |
| M2 Learning experience | [`02-learning-experience.md`](02-learning-experience.md) | Readers complete a measurable learning loop |
| M3 Agent catalog | [`03-agent-catalog.md`](03-agent-catalog.md) | Runnable projects stay connected to source code |
| M4 Projects and practice | [`04-projects-practice.md`](04-projects-practice.md) | Readers apply knowledge through structured practice |
| M5 Authoring and publishing | [`05-authoring-publishing.md`](05-authoring-publishing.md) | Authors publish valid content safely and quickly |
| M6 Feedback and accounts | [`06-feedback-accounts.md`](06-feedback-accounts.md) | Maintainers receive signal; remote accounts remain optional |

## Release levels

### Internal MVP

- One complete course path.
- Lesson navigation and local progress.
- Per-lesson quizzes.
- At least 10 normalized Agent pages.
- Search, filters, notes, favorites, and a learner dashboard.

### Public v1

- At least 10–15 lessons, 10 Agents, and 3 guided projects.
- CI content-quality gates and production deployment.
- Scenario practice and basic calculators.
- Analytics, feedback, accessibility, and performance verification.

### Post-v1

- Architecture playground, interview studio, authentication, remote sync,
  multilingual content, and hosted execution.

## Global product constraints

- Public content remains readable without JavaScript or authentication.
- All persistent entity references use stable slugs.
- A third-party service failure cannot prevent reading a lesson.
- Content schema changes require migration notes and an ADR when they affect
  URLs or persisted learner state.
- Every P0/P1 feature requires an automated acceptance check or a documented
  manual release check.

## Global success metrics

- Lesson-to-quiz engagement.
- Quiz completion and retry rate.
- Course completion and next-lesson continuation.
- Search success: result click after a query.
- Agent source/run-command click-through.
- Project start and completion.
- Per-page helpful/not-helpful ratio.
- Build failure reasons and median content PR lead time.
