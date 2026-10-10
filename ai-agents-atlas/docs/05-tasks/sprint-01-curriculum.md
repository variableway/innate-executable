# Sprint 1 — Typed curriculum and discovery

## Goal

Introduce Course → Module → Lesson structure, strict cross-content relations,
and deterministic learning navigation while preserving static rendering.

## Exit criteria

- Course, project, quiz, and scenario schemas exist.
- One representative course renders with modules and valid navigation.
- Broken content references fail before build completion.
- Search/filter metadata supports the expanded content model.
- Authors can scaffold the new content types.

## Wave A — contract freeze

### S1-T01 — Content schema expansion

- **Role:** content-contract Agent
- **Depends on:** S0-T06
- **Owns:** `src/content/config.ts`, `src/lib/content/types.ts`, schema tests
- **Work:** define Course, extended Lesson, Project, Quiz, Scenario, and optional
  Interview collections; export stable enums once; provide valid/invalid
  fixtures.
- **Acceptance:** all current content still builds or has an explicit migration;
  invalid enum/date/quiz answer/project section fixtures fail clearly.
- **Conflict rule:** this is the only Sprint task allowed to edit
  `src/content/config.ts`.

### S1-T02 — Representative curriculum content

- **Role:** content Agent
- **Depends on:** S1-T01 schema draft
- **Owns:** `src/content/courses/ai-agent-engineering.yaml`, up to three new or
  migrated lesson files, one quiz fixture
- **Work:** author the smallest realistic course spanning at least two modules;
  populate real references and metadata used by UI/tests.
- **Acceptance:** no placeholder prose; relationships match the frozen schema;
  content renders without custom route edits.

## Wave B — parallel after S1-T01 merges

### S1-T03 — Relationship validator and course graph

- **Role:** build-service Agent
- **Depends on:** S1-T01, S1-T02 fixture visibility
- **Owns:** `src/lib/content/relations.ts`, `src/lib/content/course-graph.ts`,
  `scripts/validate-content.ts`, unit tests
- **Work:** validate references, draft/public rules, duplicate membership, and
  deterministic previous/next; emit path-rich errors.
- **Acceptance:** fixtures cover unknown targets, duplicate lesson, empty module,
  draft leakage, and valid graph flattening.

### S1-T04 — Course catalog and detail pages

- **Role:** static frontend Agent
- **Depends on:** S1-T01, S1-T02
- **Owns:** `src/pages/courses/**`, `src/components/atlas/content/course-*`,
  route-specific styles/tests
- **Work:** implement `/courses` and `/courses/[slug]` with static module/lesson
  links and a fixture progress slot; avoid reading Zustand in Astro code.
- **Acceptance:** useful no-JS output, mobile layout, empty/draft handling, SEO
  metadata, accessible heading structure.

### S1-T05 — Lesson context and navigation

- **Role:** static frontend Agent
- **Depends on:** S1-T03 course-graph contract
- **Owns:** `src/components/atlas/content/breadcrumb.astro`,
  `lesson-navigation.astro`, targeted lesson page/layout changes
- **Work:** add course/module breadcrumb, prerequisites, previous/next, related
  content, and canonical context to lesson pages.
- **Acceptance:** first/middle/last lesson fixtures behave correctly; absent
  primary course omits navigation safely.

### S1-T06 — Taxonomy and URL-synced filtering

- **Role:** interactive frontend Agent
- **Depends on:** S1-T01
- **Owns:** `src/lib/content/taxonomy.ts`, taxonomy filter components, tag and
  framework detail routes except files owned by S1-T04/S1-T05
- **Work:** normalize taxonomy, add type/framework/level/tag filter contract,
  restore filters from URL, and keep noscript indexes.
- **Acceptance:** shareable filter URL, back/forward restoration, unknown-value
  tolerance, mobile controls.

### S1-T07 — Scaffolding commands

- **Role:** authoring-tool Agent
- **Depends on:** S1-T01
- **Owns:** `scripts/scaffold.ts`, scaffold templates and tests
- **Work:** create course/project/quiz/scenario/Agent templates with slug
  validation and collision refusal; never overwrite existing content.
- **Acceptance:** generated files pass schemas; invalid or existing slug exits
  nonzero without partial writes.

### S1-T08 — Sprint integration and browser acceptance

- **Role:** integration/quality Agent
- **Depends on:** S1-T03 through S1-T07
- **Owns:** shared nav additions, aggregate exports, `tests/e2e/curriculum.spec.ts`,
  Sprint report
- **Work:** wire course navigation and scripts, run relation validation in CI,
  verify course → lesson → next lesson and filter flows.
- **Acceptance:** all Sprint exit criteria pass in a production build.

## Suggested concurrency

```text
Wave A: A=S1-T01, D=S1-T02
Wave B: A=S1-T03, B=S1-T04, C=S1-T05/S1-T06, D=S1-T07
Merge:  integration Agent=S1-T08
```
