---
title: "ADR-0001: Astro over Next.js"
description: Why we picked Astro for the Atlas.
date: 2026-08-01
status: accepted
---

## Context

The Atlas is a reading layer over a static codebase. We needed a site
generator that:

- Renders Markdown with strict frontmatter typing.
- Defaults to static output, with islands for interactive widgets.
- Has a mature MDX story.
- Supports Cloudflare Pages as a first-class deploy target.

Two finalists were **Astro 4** and **Next.js 15 (static export)**.

## Decision

**Astro 4.** All routes use `output: 'static'`. The single React island
runtime is React 18; everything else is HTML.

## Consequences

### Positive

- The dev server boots in under a second; cold rebuilds are < 5 s.
- We don't ship a Next.js runtime. Page weight on the home route is
  ~80 kB of JS (excluding the `lessons-list` chunk, which is split).
- Content Collections + Zod schemas are native — no plugin chain.
- The Cloudflare Pages adapter is well-trodden, including the
  Pages-only compatibility date we use in `wrangler.toml`.

### Negative

- We can't reuse Next.js-flavored libraries (no `next/link`, no
  `next/navigation`, no `next/image`). When we imported them by
  accident, the build failed with clear errors — see
  [troubleshooting.md](../troubleshooting.md).
- Astro's docs assume v5 in many places. We're on v4.16 for the
  Content Collections legacy path. Any tutorial snippets that use
  `defineCollection({ loader })` need adaptation before they work here.

### Mitigations

- The Content Collections schemas (`src/content/config.ts`) make frontmatter
  type-checked; we don't need a CMS plugin to get validation.
- We pin Astro and `@astrojs/*` versions tightly to avoid mid-major
  surprises.
- The decision is reversible: every page is a single file under
  `src/pages/`. Migrating to Eleventy or Next static export would be a
  refactor, not a rewrite.