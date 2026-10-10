---
title: The six-layer model
description: Authoring → Content → Build → Distribution → Feedback → Governance.
---

The Atlas treats "publishing" as six distinct layers. Each layer has a
single owner, a single deliverable, and a single failure mode you can
alert on. Most CMSes fold three of these layers into one tool; the
Atlas keeps them separate so each can be replaced cheaply.

## 1. Authoring

**Tool:** `pnpm new:lesson`, Decap CMS, or any text editor.
**Deliverable:** Markdown + frontmatter in a PR.
**Failure mode:** Author gets stuck.

Mitigations: a scaffolder (`scripts/new-lesson.mjs`), a frontmatter
schema reference ([frontmatter-schema.md](./frontmatter-schema.md)),
and editorial guidelines ([authoring.md](./authoring.md)).

## 2. Content

**Tool:** Markdown files in `src/content/` + Zod schemas in
`src/content/config.ts`.
**Deliverable:** Valid, typed content collections.
**Failure mode:** Schema drift, broken cross-references.

Mitigations: schemas are enforced at build time, and the content-lint
workflow (`.github/workflows/content-lint.yml`) checks every PR.

## 3. Build

**Tool:** Astro 4 + Rollup + Vite. The Atlas is `output: 'static'`.
**Deliverable:** `./dist/` containing HTML, JS chunks, RSS, sitemap,
and (post-build) the Pagefind index.
**Failure mode:** A dependency upgrade breaks the build.

Mitigations: pnpm overrides for known-broken transitives
(`hast-util-to-estree: 3.1.0`, `zod-to-json-schema: 3.23.5`),
`astro check` in CI, and dependency pinning for `@astrojs/sitemap`
(see [decisions/0003-sitemap-3-2-1.md](./decisions/0003-sitemap-3-2-1.md)).

## 4. Distribution

**Tool:** Cloudflare Pages + GitHub Actions + Pagefind.
**Deliverable:** Live URLs (per-PR preview + production).
**Failure mode:** DNS, edge cache poisoning, CDN outage.

Mitigations: static build means a CDN outage is the only way the site
goes down. PR previews give reviewers a real environment to test
against. Sitemap + RSS give readers alternatives if the CDN flakes.

## 5. Feedback

**Tool:** Giscus (comments) + thumbs widget (per-page) + Plausible
(aggregate).
**Deliverable:** Conversation + signal.
**Failure mode:** Either too much noise or none.

Mitigations: Giscus comments live on GitHub Discussions, so spam
moderation comes for free with repo settings. The thumbs widget is
`localStorage`-only and only POSTs to a configurable Worker endpoint;
without one configured, it's a polite no-op.

## 6. Governance

**Tool:** This `docs/` folder + ADRs + `LICENSE` + `CONTRIBUTING.md`.
**Deliverable:** "Why" explanations for every non-obvious choice.
**Failure mode:** New contributors repeat past mistakes.

Mitigations: ADRs are immutable historical records. Each non-trivial
choice (sitemap version, directory naming, Pagefind detection
mechanism) has its own file under `docs/decisions/`. Add a new ADR
when introducing a new convention; reference the existing ones when
rejecting an alternative.

## Why split the layers?

Because replacing any one of them should be a contained change:

- Swap Astro for Eleventy → only Layer 3 changes.
- Replace Giscus with Disqus → only Layer 5 changes.
- Move from Cloudflare Pages to Netlify → only Layer 4 changes.
- Rewrite schemas in JSON Schema → only Layer 2 changes.

If a change touches three or more layers, it's almost certainly an
over-reach and should be split into smaller PRs.