# Sprint 5 — Advanced learning tools

## Goal

Add the architecture playground and interview studio as isolated, lazy-loaded
tools without increasing the JavaScript cost of ordinary lesson pages.

## Release position

This Sprint is post-v1 by default. It may move before launch only if public-v1
metrics require these tools and S4 quality gates are already complete.

## Exit criteria

- Playground supports edit, connect, template, autosave, validated import, and
  export.
- Projects can open valid starter diagrams.
- Interview sessions support timer, hints, notes, reference, and rubric.
- Advanced bundles are absent from lesson route dependency graphs.

## Wave A — contracts

### S5-T01 — Diagram model and persistence adapter

- **Role:** tool-domain Agent
- **Depends on:** S4-T01
- **Owns:** `src/lib/practice/diagram-types.ts`,
  `src/lib/practice/diagram-storage.ts`, import validators/tests
- **Work:** versioned nodes/edges, starter-template schema, dedicated storage,
  debounce policy, migration, and safe import replace semantics.
- **Acceptance:** invalid edges, duplicate IDs, traversal-like payload keys,
  oversized imports, and corrupt stored state are rejected/recovered.

### S5-T02 — Interview model and timer engine

- **Role:** tool-domain Agent
- **Depends on:** S3-T01
- **Owns:** interview schema/domain helpers, monotonic timer hook/service tests,
  representative interview content
- **Work:** prompt, hints, rubric, notes/session state, target-timestamp timer,
  pause/resume/reset semantics.
- **Acceptance:** background-tab time fixture, reload resume, hint limits, and
  rubric validation pass.

## Wave B — parallel after contracts merge

### S5-T03 — Playground canvas core

- **Role:** interactive visualization Agent
- **Depends on:** S5-T01
- **Owns:** `architecture-playground.tsx`, node/edge visual components, canvas
  interaction tests
- **Work:** integrate `@xyflow/react`; add/move/connect/select/edit/duplicate/
  delete; keyboard-accessible alternate controls for essential operations.
- **Acceptance:** core edit flow works by pointer and supported keyboard controls;
  state saves through adapter, not direct localStorage calls.

### S5-T04 — Playground templates and import/export

- **Role:** interactive tools Agent
- **Depends on:** S5-T01; coordinates public component API with S5-T03
- **Owns:** template picker, import/export dialogs, SVG/PNG/JSON helpers/tests
- **Work:** load starter/project templates, preview replacement, validated JSON
  import, deterministic JSON export, image export, reset confirmation.
- **Acceptance:** import never replaces current work before validation/confirm;
  exported JSON round-trips.

### S5-T05 — Interview studio UI

- **Role:** interactive frontend Agent
- **Depends on:** S5-T02
- **Owns:** interview route, `interview-studio.tsx`, timer/rubric UI tests
- **Work:** prompt selection, timer, hints, notes, reference reveal, rubric,
  session reset and persistence.
- **Acceptance:** timer roles/announcements are not noisy; notes survive reload;
  reference is clearly learner-triggered.

### S5-T06 — Advanced route and bundle isolation

- **Role:** Astro performance Agent
- **Depends on:** S5-T03, S5-T04, S5-T05
- **Owns:** playground route, advanced-route loading boundaries, Vite bundle
  assertions, project starter-diagram integration
- **Work:** mount route-level lazy islands, connect project templates, verify
  dependency isolation and static fallback copy.
- **Acceptance:** React Flow/interview chunks are absent from lesson page loads;
  direct advanced URLs render loading/error boundaries correctly.

### S5-T07 — Advanced-tool browser acceptance

- **Role:** quality Agent
- **Depends on:** S5-T06
- **Owns:** `tests/e2e/playground.spec.ts`, `interview.spec.ts`, bundle report
- **Work:** full diagram edit/import/export/reload; project template; interview
  timer/hints/notes/rubric; reduced motion and mobile smoke.
- **Acceptance:** all Sprint exit criteria pass with failure artifacts.

## Suggested concurrency

```text
Wave A: A=S5-T01, D=S5-T02
Wave B: A=S5-T03, B=S5-T04, C=S5-T05, D=S5-T06 preparation
Merge:  D=S5-T06, independent quality Agent=S5-T07
```
