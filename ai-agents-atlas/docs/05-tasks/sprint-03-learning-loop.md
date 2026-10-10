# Sprint 3 — Core learning loop

## Goal

Deliver the complete anonymous learning loop: resume a course, read, answer a
quiz, receive feedback, complete the lesson, and see progress on a dashboard.

## Exit criteria

- Learning state v2 and migration are production-ready.
- Per-lesson Quiz works with option-specific feedback and persistence.
- Course/module/lesson progress and continue-learning are correct.
- Dashboard, export/import/reset, notes, and favorites work together.
- The end-to-end learning flow passes after reload.

This Sprint produces the **internal MVP**.

## Wave A — shared contracts

### S3-T01 — Learning state v2

- **Role:** state-contract Agent
- **Depends on:** S0-T04, S1-T01
- **Owns:** `src/lib/store.ts`, `src/lib/learning/types.ts`,
  `src/lib/learning/migrations.ts`, state/migration tests
- **Work:** add quiz results, completed projects, scenarios, course position,
  checklist, streak, namespaced favorites, exportable state; expose narrow
  actions/selectors.
- **Acceptance:** v1 migration is lossless for supported fields; selectors avoid
  unnecessary whole-store subscriptions; corrupt storage is recoverable.
- **Conflict rule:** only this task edits `src/lib/store.ts` in Sprint 3.

### S3-T02 — Quiz content and scoring service

- **Role:** assessment-domain Agent
- **Depends on:** S1-T01
- **Owns:** `src/lib/learning/quiz.ts`, quiz validators/fixtures, initial real
  quiz YAML files
- **Work:** implement typed scoring for single/multiple choice, passing percent,
  version rules, and presentation DTO that preserves per-option feedback.
- **Acceptance:** boundary and invalid fixtures pass; scoring is independent of
  React and Zustand.

## Wave B — parallel after contracts merge

### S3-T03 — Quiz React island

- **Role:** interactive frontend Agent
- **Depends on:** S3-T01, S3-T02
- **Owns:** `src/components/atlas/learning/quiz*.tsx`, component tests
- **Work:** selection, submission, per-option feedback, explanation, score,
  retry, attempt persistence, keyboard and screen-reader behavior.
- **Acceptance:** answers are not visually revealed before submit; reload shows
  prior summary; retry creates the expected attempt record.

### S3-T04 — Course progress and continue learning

- **Role:** interactive frontend Agent
- **Depends on:** S1-T03, S3-T01
- **Owns:** `src/lib/learning/progress.ts`, `course-progress.tsx`,
  `continue-learning.tsx`, tests
- **Work:** calculate lesson/module/course percentages and deterministic next
  action; integrate course outline status through DTOs.
- **Acceptance:** zero, partial, full, draft-excluded, and stale-last-position
  fixtures pass; no `NaN`.

### S3-T05 — Learner dashboard

- **Role:** interactive frontend Agent
- **Depends on:** S3-T01, S3-T04 contract
- **Owns:** `src/pages/dashboard.astro`,
  `src/components/atlas/learning/learner-dashboard.tsx` and child dashboard
  components only
- **Work:** continue card, course progress, recent views, favorites, quiz
  accuracy, project placeholder, local-state explanation.
- **Acceptance:** useful empty state, hydrated state, responsive layout, no
  content parsing in the island.

### S3-T06 — Learning data controls

- **Role:** interactive frontend Agent
- **Depends on:** S3-T01
- **Owns:** `src/components/atlas/learning/learning-data-controls.tsx`,
  import/export validation helpers/tests
- **Work:** download JSON, validate/import, reset learning while retaining theme,
  optional full reset, clear confirmation and error handling.
- **Acceptance:** round-trip fixture succeeds; wrong schema/corrupt file does not
  modify state; reset behaviors are distinct and tested.

### S3-T07 — Lesson integration

- **Role:** Astro integration Agent
- **Depends on:** S3-T02, S3-T03, S3-T04
- **Owns:** lesson route/layout integration points, quiz serialization,
  course-outline integration, shared learning navigation additions
- **Work:** mount quiz, progress, completion, notes, and next action using the
  lightest hydration directives; retain static prose/no-JS navigation.
- **Acceptance:** lesson with and without quiz both render; unrelated lessons do
  not load quiz data; no hydration mismatch.

### S3-T08 — Learning-flow browser acceptance

- **Role:** quality Agent
- **Depends on:** S3-T03 through S3-T07
- **Owns:** `tests/e2e/learning.spec.ts`, a11y assertions, Sprint report
- **Work:** course start → lesson → quiz → completion → reload → dashboard → next
  lesson; storage-disabled and reset/import cases.
- **Acceptance:** all Sprint exit criteria and keyboard-critical path pass.

## Suggested concurrency

```text
Wave A: A=S3-T01, D=S3-T02
Wave B: A=S3-T04, B=S3-T05, C=S3-T03/S3-T06, D=S3-T07 preparation
Merge:  D=S3-T07, independent quality Agent=S3-T08
```
