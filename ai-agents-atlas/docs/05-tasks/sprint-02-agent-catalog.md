# Sprint 2 — Agent catalog ingestion

## Goal

Replace fragile/manual Agent publication with a deterministic typed ingestion
pipeline and migrate at least 10 runnable source projects for public v1.

## Exit criteria

- Agent source ingestion is idempotent and secure by allowlist.
- Every accepted Agent has a static detail page with source files and commands.
- At least 10 Agents are production-ready; all 21 have accepted/excluded status.
- Catalog filters and up-to-three comparison work responsively.

## Wave A — shared contract

### S2-T01 — Normalized Agent DTO and source policy

- **Role:** Agent-domain contract Agent
- **Depends on:** S1-T01
- **Owns:** `src/lib/agents/types.ts`, `src/lib/agents/schema.ts`, source-policy
  fixtures, any Agent-only schema edits coordinated with S1 owner
- **Work:** freeze authoritative metadata, normalized DTO, allowed file types,
  maximum sizes, exclusion record, and source-root configuration.
- **Acceptance:** DTO can represent current 21 projects; invalid/traversal/secret
  fixtures fail; UI fixture JSON is published for parallel work.

### S2-T02 — Agent detail UI against fixtures

- **Role:** static/interactive frontend Agent
- **Depends on:** S2-T01 fixture contract
- **Owns:** `src/components/atlas/agents/agent-metadata.astro`,
  `agent-file-tabs.tsx`, `run-commands.astro`, detail-page presentation tests
- **Work:** build metadata, source tabs, escaped code, setup/run copy actions,
  related content, and accessible mobile behavior using fixture DTOs.
- **Acceptance:** missing optional fields degrade cleanly; large source expands
  intentionally; no raw `innerHTML` for source text.

## Wave B — parallel after S2-T01 merges

### S2-T03 — Source sync implementation

- **Role:** build-service Agent
- **Depends on:** S2-T01
- **Owns:** `scripts/sync-agents.ts`, `src/lib/agents/ingest.ts`, ingestion tests,
  `src/generated/agents/**` format
- **Work:** enumerate, validate, normalize, hash, and generate Agent records;
  support `--check`; write exclusion manifest.
- **Acceptance:** two runs are identical; traversal, binary, oversized, and
  likely secret files fail; generated order is stable across platforms.

### S2-T04 — Agent catalog filters

- **Role:** interactive frontend Agent
- **Depends on:** S2-T01
- **Owns:** `src/components/atlas/agents/agent-catalog.tsx`, Agent card/index
  components and catalog tests
- **Work:** filter by framework, difficulty, industry, language, tags; URL-sync
  state; provide static fallback list.
- **Acceptance:** combined filters are deterministic; zero-result recovery and
  mobile controls are accessible.

### S2-T05 — Agent comparison

- **Role:** interactive frontend Agent
- **Depends on:** S2-T01, S0-T04
- **Owns:** `src/components/atlas/agents/agent-comparison.tsx`, comparison
  selectors/helpers/tests
- **Work:** namespaced compare selection, cap of three, shareable query route or
  dialog, responsive stacked presentation.
- **Acceptance:** add/remove/clear, duplicate protection, cap feedback, reload
  persistence, and mobile display pass.

### S2-T06 — Migrate Agents batch A

- **Role:** content migration Agent
- **Depends on:** S2-T01, may use S2-T03 beta
- **Owns:** source/sidecar records for Agent slugs `01`–`10` only
- **Work:** complete missing metadata, commands, relationships, and curated
  walkthroughs without changing application code.
- **Acceptance:** every owned Agent is accepted or has a documented exclusion;
  commands reference real files; no placeholder content.

### S2-T07 — Migrate Agents batch B

- **Role:** content migration Agent
- **Depends on:** S2-T01, may use S2-T03 beta
- **Owns:** source/sidecar records for Agent slugs `11`–`21` only
- **Work/acceptance:** same as S2-T06 for the disjoint slug range.

### S2-T08 — Route/build integration

- **Role:** Astro integration Agent
- **Depends on:** S2-T02, S2-T03
- **Owns:** `src/pages/agents/**`, `src/lib/agents/catalog.ts`, shared Agent route
  wiring, Pagefind Agent metadata
- **Work:** join generated DTOs with curated MDX, generate routes, connect
  catalog/detail components, exclude rejected records.
- **Acceptance:** route count matches accepted manifest; every route builds and
  is searchable.

### S2-T09 — Agent catalog acceptance

- **Role:** quality Agent
- **Depends on:** S2-T04 through S2-T08
- **Owns:** `tests/e2e/agents.spec.ts`, ingestion acceptance fixtures, Sprint
  report
- **Work:** verify accepted/excluded accounting, filter, file tab, commands,
  source link, comparison, no secret-like browser assets.
- **Acceptance:** all Sprint exit criteria pass from a clean generated build.

## Suggested concurrency

```text
Wave A: A=S2-T01, B=S2-T02
Wave B: A=S2-T03, B=S2-T04/S2-T05, C=S2-T06, D=S2-T07
Merge:  A or lead=S2-T08, independent D=S2-T09
```
