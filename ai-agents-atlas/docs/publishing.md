---
title: Publishing & deployment
description: From a merged PR to a live URL on Cloudflare Pages.
---

Publishing on the Atlas is fully automated. The pipeline is intentionally
narrow so the failure modes are obvious.

```
PR merged ──► deploy.yml ──► astro check ──► astro build
                                              │
                                              ├─► postbuild: pagefind-tag
                                              └─► dlx pagefind --site dist
                                                       │
                                                       ▼
                                          Cloudflare Pages artifact
                                                       │
                                                       ▼
                                              Live URL (production)
```

## Workflows

| Workflow                            | Trigger                       | Purpose |
|-------------------------------------|-------------------------------|---------|
| `.github/workflows/deploy.yml`      | push to `main`, manual        | Production deploy |
| `.github/workflows/preview.yml`     | PR open / sync / reopen / close | Per-PR preview URLs |
| `.github/workflows/content-lint.yml`| PR touching `src/content/**`  | Lightweight frontmatter validation |

All three run `pnpm install --frozen-lockfile` first. If the lockfile
is out of sync, the build fails before any code runs.

## Required secrets

Set these in **Cloudflare Pages → Settings → Environment variables**:

| Variable                     | Required | Purpose |
|------------------------------|----------|---------|
| `PUBLIC_SITE_URL`            | yes      | Canonical origin; used by sitemap + RSS |
| `PUBLIC_PLAUSIBLE_DOMAIN`    | no       | When set, the Plausible script is injected |
| `PUBLIC_FEEDBACK_ENDPOINT`   | no       | Worker URL that receives thumbs votes |
| `PUBLIC_GISCUS_REPO`         | no       | `org/repo` for comments |
| `PUBLIC_GISCUS_REPO_ID`      | no       | from <https://giscus.app> |
| `PUBLIC_GISCUS_CATEGORY`     | no       | defaults to `'General'` |
| `PUBLIC_GISCUS_CATEGORY_ID`  | no       | from <https://giscus.app> |

When a `PUBLIC_GISCUS_*` value is missing, the `Comments` island simply
isn't mounted — no error.

## Cloudflare Pages configuration

`wrangler.toml` declares:

```toml
name = "ai-agents-atlas"
compatibility_date = "2026-01-01"
pages_build_output_dir = "./dist"

[build]
command = "pnpm build"
```

`public/_headers` ships cache directives:

- `/_astro/*` → `immutable, max-age=31536000`
- `/og-default.png` → `max-age=86400`
- everything else → `must-revalidate`

`public/_redirects` handles a few legacy paths.

## PR previews

Every PR gets a unique Cloudflare Pages project named
`atlas-pr-<number>`. The preview workflow comments the URL back on the
PR using `sticky-pull-request-comment` so subsequent commits update the
same comment instead of spamming the thread.

When the PR closes, the preview project is garbage-collected by
Cloudflare after ~30 days (Pages' default).

## Manual deploy

If you need to ship without going through GitHub Actions:

```bash
pnpm build
pnpm dlx wrangler pages deploy dist --project-name=ai-agents-atlas
```

Use this sparingly. Anything you ship this way bypasses the content
lint workflow and the lockfile check.

## Rollback

Cloudflare Pages keeps every successful deployment. From the dashboard:

1. Open **Deployments**.
2. Find the last known-good build.
3. Click **⋯ → Rollback to this deploy**.

The rollback is instant and doesn't require a new commit.