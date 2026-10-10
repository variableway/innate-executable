# Sprint 0 — Platform stabilization

## Goal

Remove architectural ambiguity and establish the test, deployment, and state
foundations required by later parallel work.

## Exit criteria

- Cloudflare Pages is the only production deployment implementation.
- Canonical URL is environment-driven.
- Documentation no longer relies on manual two-way mirroring.
- Unit and browser test scaffolds run in CI.
- Persisted state has a tested migration mechanism.
- Current type check and build pass without critical warnings.

## Wave A — may run in parallel

### S0-T01 — Unify deployment provider

- **Role:** infrastructure Agent
- **Depends on:** none
- **Owns:** `.github/workflows/deploy.yml`, `.github/workflows/preview.yml`,
  `wrangler.toml`, deployment sections of `docs/publishing.md`
- **Work:** replace GitHub Pages deployment actions with the selected
  Cloudflare Pages flow; keep preview and production behavior distinct; document
  required secrets and rollback.
- **Acceptance:** workflow syntax validates; no `actions/deploy-pages` remains;
  docs and workflow name the same provider and output directory.
- **Parallel note:** do not edit Astro config or package files.

### S0-T02 — Canonical URL and platform warning cleanup

- **Role:** Astro platform Agent
- **Depends on:** none
- **Owns:** `astro.config.mjs`, `src/layouts/BaseLayout.astro`,
  `src/layouts/LessonLayout.astro`, focused platform tests
- **Work:** read site URL from validated environment/default for local builds;
  fix inline-script hints and investigate browser-side Sharp imports; preserve
  output and JSON-LD.
- **Acceptance:** `pnpm check` reports zero errors and no addressed hints;
  production build contains the configured canonical origin.
- **Parallel note:** record dependency changes but do not install them.

### S0-T03 — Documentation single-source sync

- **Role:** tooling Agent
- **Depends on:** none
- **Owns:** `scripts/sync-docs.ts`, docs-sync tests, generated-file headers
- **Work:** implement deterministic one-way sync from `docs/` to the renderable
  docs collection, with `--check`, exclusions for delivery-only files if needed,
  and stale-file deletion limited to the generated target.
- **Acceptance:** a second sync produces no diff; `--check` fails after a source
  edit; unrelated content is never deleted.
- **Parallel note:** package scripts are wired by S0-T06.

### S0-T04 — Learning-state migration foundation

- **Role:** state Agent
- **Depends on:** none
- **Owns:** `src/lib/store.ts`, `src/lib/learning/migrations.ts`, migration tests
- **Work:** extract pure v1 migration, namespace favorites where possible, add
  persist version handling and corruption-safe fallback without yet adding all
  Sprint 3 fields.
- **Acceptance:** existing favorites, recent views, completed lessons, notes,
  and comparison state survive migration fixtures; hydration remains stable.
- **Parallel note:** no dashboard or quiz components in this task.

## Wave B — start after Wave A contracts are visible

### S0-T05 — Test scaffold

- **Role:** quality Agent
- **Depends on:** S0-T02 contract visibility
- **Owns:** `vitest.config.*`, `playwright.config.*`, `tests/unit/**`,
  `tests/e2e/smoke.spec.ts`, test setup files
- **Work:** add Vitest and Playwright configuration, a pure-unit example, and
  smoke coverage for home, lessons, one lesson, Agents, and 404.
- **Acceptance:** tests run locally against a production build; artifacts are
  retained only on failure; selectors use accessible roles where possible.
- **Parallel note:** dependency installation and package scripts belong to
  S0-T06.

### S0-T06 — Package and CI integration

- **Role:** Sprint integration Agent
- **Depends on:** S0-T01, S0-T03, S0-T04, S0-T05
- **Owns:** `package.json`, `pnpm-lock.yaml`,
  `.github/workflows/content-lint.yml`, any new shared CI workflow
- **Work:** install agreed tooling, add stable scripts from the authoring spec,
  wire docs check, unit test, type check, build, Pagefind, and browser smoke into
  CI with cache reuse.
- **Acceptance:** frozen-lockfile clean checkout passes the CI command sequence;
  content changes trigger build and validation.

### S0-T07 — Platform regression verification

- **Role:** independent verification Agent
- **Depends on:** S0-T06
- **Owns:** `tests/e2e/platform.spec.ts`, Sprint completion report only
- **Work:** verify theme, command palette, Pagefind presence, notes persistence,
  security headers configuration, canonical URL, and no-JS lesson readability.
- **Acceptance:** documented test evidence; defects become new task IDs rather
  than hidden edits across owned implementation files.

## Suggested concurrency

```text
Agent A: S0-T01 ───────────────┐
Agent B: S0-T02 ───────────────┤
Agent C: S0-T03 ───────────────┼─> Agent A or lead: S0-T06
Agent D: S0-T04 → S0-T05 ─────┘                    │
                                                   └─> S0-T07
```
