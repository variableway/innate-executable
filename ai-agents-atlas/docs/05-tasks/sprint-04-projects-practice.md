# Sprint 4 — Projects and practice

## Goal

Add guided projects, scored scenarios, and capacity calculators so readers can
apply knowledge beyond passive lesson completion.

## Exit criteria

- At least three complete guided projects are public.
- Project start/checklist/completion persist and appear on the dashboard.
- Scenario feedback and retry work with valid references.
- Capacity calculators are correct, transparent, and accessible.
- Project and practice flows pass browser acceptance.

This Sprint produces the **public v1 candidate**.

## Wave A — shared contracts

### S4-T01 — Project and scenario domain services

- **Role:** practice-domain Agent
- **Depends on:** S1-T01, S3-T01
- **Owns:** `src/lib/practice/types.ts`, project/scenario validation helpers,
  domain unit tests; coordinates any schema-only change with the config owner
- **Work:** freeze project sections, checklist IDs, relations, scenario score
  rules, and public DTOs.
- **Acceptance:** valid System Design-derived fixtures pass; missing required
  section, bad reference, invalid score, or duplicate option fails clearly.

### S4-T02 — Calculator engine

- **Role:** domain logic Agent
- **Depends on:** none beyond TypeScript test scaffold
- **Owns:** `src/lib/practice/calculators.ts`, calculator unit/property fixtures
- **Work:** implement RPS, peak, concurrency, storage, bandwidth, cache, and
  server-count pure functions with typed errors and unit conversion.
- **Acceptance:** normal/zero/boundary/invalid fixtures match independently
  calculated expected values; no formatting code in engine.

## Wave B — parallel after S4-T01 merges

### S4-T03 — Project routes and static presentation

- **Role:** static frontend Agent
- **Depends on:** S4-T01
- **Owns:** `src/pages/projects/**`, `src/components/atlas/practice/project-*.astro`,
  project static snapshots
- **Work:** catalog/detail pages, requirements, API/data tables, flows,
  trade-offs, related lessons/Agents, reference solution boundary.
- **Acceptance:** no-JS project is complete; long tables work on mobile; missing
  optional sections do not break layout.

### S4-T04 — Project progress islands

- **Role:** interactive frontend Agent
- **Depends on:** S3-T01, S4-T01
- **Owns:** `project-checklist.tsx`, `reference-solution.tsx`, project learning
  selectors/tests
- **Work:** started/completed actions, checklist persistence, reference reveal,
  dashboard project summary contract.
- **Acceptance:** reload persistence, completion rules, accessible checklist and
  reveal controls.

### S4-T05 — Scenario player

- **Role:** interactive frontend Agent
- **Depends on:** S3-T01, S4-T01
- **Owns:** scenario routes, `scenario-player.tsx`, scenario component tests
- **Work:** question navigation, one-choice submit, score-specific feedback,
  retry, related lesson link, persisted latest answer.
- **Acceptance:** no answer feedback leak before submit; all 0/1/2 outcomes and
  retry pass.

### S4-T06 — Capacity calculator UI

- **Role:** interactive frontend Agent
- **Depends on:** S4-T02
- **Owns:** `/tools/capacity` route, `capacity-calculator.tsx`, UI tests
- **Work:** structured inputs, unit selection, formula/assumption display,
  localized formatting, typed error rendering.
- **Acceptance:** keyboard usable; invalid values never show stale valid result,
  infinity, or `NaN`; mobile layout passes.

### S4-T07 — Migrate projects batch A

- **Role:** content migration Agent
- **Depends on:** S4-T01
- **Owns:** first disjoint half of selected project slugs and related scenarios
- **Work:** migrate complete project content from System Design Academy into the
  new schema; adapt domain language to Atlas where needed.
- **Acceptance:** at least two complete projects or the assigned half; every
  claim and reference reviewed; no JavaScript object syntax in content.

### S4-T08 — Migrate projects batch B

- **Role:** content migration Agent
- **Depends on:** S4-T01
- **Owns:** second disjoint half of selected project slugs and scenarios
- **Work/acceptance:** same as S4-T07, producing at least one additional complete
  project for the public-v1 minimum.

### S4-T09 — Dashboard and navigation integration

- **Role:** integration Agent
- **Depends on:** S4-T03 through S4-T08
- **Owns:** dashboard project section, shared navigation additions, aggregate
  practice exports, Pagefind metadata
- **Work:** connect project/scenario/tool routes, progress summary, related links,
  and search.
- **Acceptance:** every public project and scenario is discoverable and progress
  updates dashboard.

### S4-T10 — Public-v1 candidate verification

- **Role:** quality Agent
- **Depends on:** S4-T09
- **Owns:** `tests/e2e/projects-practice.spec.ts`, content coverage report,
  Sprint report
- **Work:** project start/checklist/complete, scenario all score classes,
  calculator fixtures, reload/dashboard, no-JS project reading.
- **Acceptance:** Sprint exit criteria pass; public-v1 content counts are
  reported from build output.

## Suggested concurrency

```text
Wave A: A=S4-T01, C=S4-T02
Wave B: A=S4-T03, B=S4-T04/S4-T05, C=S4-T06, D=S4-T07/S4-T08 split
Merge:  lead=S4-T09, independent quality Agent=S4-T10
```
