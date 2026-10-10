# Spec M5 — Authoring and publishing

Related PRD: [`../02-prd/05-authoring-publishing.md`](../02-prd/05-authoring-publishing.md)

## 1. Canonical source policy

`src/content/` is canonical for content rendered by Astro. Root-level `docs/`
is canonical for delivery and engineering documents until the duplication issue
is resolved in Sprint 0.

Target resolution:

- Keep delivery documentation under `docs/`.
- Generate or copy its renderable subset to `src/content/docs/` using
  `scripts/sync-docs.ts` during validation/build.
- Generated copies are not manually edited.
- `pnpm docs:check` fails if generated output is stale.

An alternative to make `src/content/docs/` canonical requires an ADR before
implementation. In either case, manual two-way mirroring is removed.

## 2. Command contract

Add or standardize:

```json
{
  "check": "astro check",
  "test": "vitest run",
  "test:e2e": "playwright test",
  "build": "astro build",
  "search:index": "pagefind --site dist",
  "content:validate": "tsx scripts/validate-content.ts",
  "agents:sync": "tsx scripts/sync-agents.ts",
  "docs:sync": "tsx scripts/sync-docs.ts",
  "docs:check": "tsx scripts/sync-docs.ts --check",
  "new:lesson": "node scripts/new-lesson.mjs",
  "new:course": "tsx scripts/scaffold.ts course",
  "new:project": "tsx scripts/scaffold.ts project",
  "new:quiz": "tsx scripts/scaffold.ts quiz",
  "new:scenario": "tsx scripts/scaffold.ts scenario"
}
```

Exact command implementation may consolidate scaffolds, but documented names
remain stable once released.

## 3. CI workflow specification

### Pull requests

Jobs may run in parallel after install/cache setup:

1. `types-and-unit`: `pnpm check`, `pnpm test`.
2. `content`: docs check, Agent sync check, content relationship validation.
3. `build`: static build and Pagefind generation.
4. `browser`: Playwright against the built preview.
5. `preview`: deploy only after build/content succeed.

Use path filters only to skip genuinely irrelevant jobs. A content change still
requires static build and relationship validation.

### Production

- Trigger: push to `main` and manual dispatch.
- Install with frozen lockfile.
- Run the same required checks as PR.
- Build with canonical production `PUBLIC_SITE_URL`.
- Generate Pagefind index.
- Deploy `dist/` to Cloudflare Pages using one documented mechanism.
- Record commit SHA and deployment URL.

Current `actions/deploy-pages` usage must be replaced if Cloudflare remains the
chosen target; GitHub Pages actions and Cloudflare Wrangler configuration must
not coexist as competing release paths.

## 4. Environment contract

| Variable | Visibility | Required | Purpose |
|---|---|---:|---|
| `PUBLIC_SITE_URL` | public | yes | Canonical origin |
| `PUBLIC_PLAUSIBLE_DOMAIN` | public | no | Analytics enablement |
| `PUBLIC_FEEDBACK_ENDPOINT` | public | no | Feedback POST target |
| `PUBLIC_GISCUS_REPO` | public | no | Comments repository |
| `PUBLIC_GISCUS_REPO_ID` | public | no | Giscus repository ID |
| `PUBLIC_GISCUS_CATEGORY` | public | no | Discussion category |
| `PUBLIC_GISCUS_CATEGORY_ID` | public | no | Giscus category ID |
| `CLOUDFLARE_API_TOKEN` | secret | deploy | CI deployment |
| `CLOUDFLARE_ACCOUNT_ID` | secret | deploy | CI deployment |

The Astro `site` option reads the canonical URL configuration; it is not left
as `atlas.example.com` in production.

## 5. Validation output

Validation errors follow:

```text
[collection/entity/field] message (source-file:line-if-known)
```

Example:

```text
[courses/ai-agents/modules[1].lessons[2]] unknown lesson "agent-memory"
  src/content/courses/ai-agents.yaml
```

Exit code is nonzero when any error exists. Warnings are reserved for valid but
discouraged conditions and are counted in CI output.

## 6. CMS specification

- `/admin` is hidden from primary navigation until proxy auth is verified.
- Decap fields match Zod enums and defaults.
- Editorial workflow creates branches/PRs rather than direct production edits.
- CMS media uses `public/media/<year>/<month>/` and requires alt text at the
  content schema boundary.
- CMS does not edit generated Agent or documentation mirror files.

## 7. Deployment and rollback

- `_headers`, `_redirects`, `wrangler.toml`, and workflow behavior are tested in
  a preview deployment.
- Hashed assets cache for one year immutable; HTML revalidates.
- Rollback uses the hosting provider's previous deployment artifact.
- A release runbook records deploy, smoke test, rollback, and incident contacts.

## 8. Test specification

- Clean-checkout CI test in the supported Node/pnpm versions.
- Broken-schema and broken-reference fixture tests.
- Docs and Agent generation idempotence tests.
- Preview smoke: home, course, lesson, Agent, project, search index.
- Header/redirect assertions against a deployed preview before public v1.
