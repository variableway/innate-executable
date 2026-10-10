# AI Agents Atlas

> A continuously published learning platform for AI agent projects — a pnpm workspace monorepo with an Astro + MDX site and a Next.js companion app.

[![Astro](https://img.shields.io/badge/Astro-7-FF5D01?logo=astro)](https://astro.build)
[![MDX](https://img.shields.io/badge/MDX-typed-1A1A1A)](https://mdxjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6)](https://www.typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC)](https://tailwindcss.com)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs)](https://nextjs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

The [500-AI-Agents-Projects](https://github.com/ashishpatel26/500-AI-Agents-Projects)
repository is an open catalogue of 500+ agent implementations. The Atlas is a
continuously-publishable reading layer over that catalogue: typed Markdown
content, full-text search, per-user learning state, and zero backend.

## Monorepo layout

```
apps/
  atlas/        @atlas/web — Astro static site (this project)
  academy/      @atlas/academy — Next.js companion app
packages/
  ui/           @atlas/ui — shared shadcn/ui primitives
```

All packages are linked through a root-level [pnpm workspace](pnpm-workspace.yaml);
run commands with `pnpm --filter <package> …` from the repo root.

## Why a separate project?

The source repo is a collection of runnable code organised by category. The
Atlas treats that material as **content** with strict frontmatter schemas,
discoverability primitives (RSS, sitemap, Pagefind), and publishing
infrastructure (Cloudflare Pages + Decap CMS) so anyone can ship a new lesson
in minutes.

## Stack

| Layer         | Choice                                                    |
|---------------|-----------------------------------------------------------|
| Workspace     | pnpm workspace (`apps/*` + `packages/*`)                  |
| Site          | Astro 7 (static output, island hydration)                 |
| Companion app | Next.js 16 (`apps/academy`)                               |
| Content       | MDX + Content Collections with Zod schemas                |
| UI            | `@atlas/ui` — shared shadcn/ui primitives (New York)      |
| Styling       | Tailwind 4 (CSS-first) + CSS variables                    |
| Reactivity    | React 19 islands (Zustand + persist)                      |
| Search        | cmdk for header palette · Pagefind for full text          |
| Comments      | Giscus (GitHub Discussions)                               |
| Analytics     | Plausible (cookieless)                                    |
| CMS           | Decap CMS (optional, gated by Cloudflare Access)          |
| Hosting       | Cloudflare Pages · preview per PR                         |

See `src/content/docs/en/architecture.md` (inside `apps/atlas`) for the
six-layer architecture rationale.

## Develop

```bash
pnpm install

# Astro site → http://localhost:4321
pnpm --filter @atlas/web dev

# Next.js app → http://localhost:3000
pnpm --filter @atlas/academy dev
```

## Author a new lesson

```bash
pnpm --filter @atlas/web new:lesson "CrewAI production patterns"
```

…then edit `apps/atlas/src/content/lessons/<slug>.mdx`. Frontmatter is validated
against `apps/atlas/src/content.config.ts` at build time — typos get caught by CI.

## Build

```bash
pnpm --filter @atlas/web build            # static site → apps/atlas/dist
pnpm --filter @atlas/web preview:build    # also runs Pagefind indexer
pnpm --filter @atlas/academy build        # Next.js production build
```

## Deploy

Every push to `main` triggers `.github/workflows/deploy.yml`, which builds the
Astro site, runs Pagefind, and ships to Cloudflare Pages. PRs get a per-branch
preview URL posted back to the PR thread.

Required Cloudflare Pages secrets:

| Variable                     | Purpose                              |
|------------------------------|--------------------------------------|
| `PUBLIC_SITE_URL`            | Canonical origin for sitemap + RSS   |
| `PUBLIC_PLAUSIBLE_DOMAIN`    | Plausible site domain                |
| `PUBLIC_FEEDBACK_ENDPOINT`   | Worker URL for thumbs feedback POSTs |
| `PUBLIC_GISCUS_REPO`         | `org/repo` for comments              |
| `PUBLIC_GISCUS_REPO_ID`      | from <https://giscus.app>           |
| `PUBLIC_GISCUS_CATEGORY`     | Discussion category name             |
| `PUBLIC_GISCUS_CATEGORY_ID`  | from <https://giscus.app>           |

See `apps/atlas/.env.example` for the full set.

## Project layout

```
apps/atlas/src/
  content/
    config.ts          Zod schemas (lessons, agents, useCases)
    lessons/           *.mdx — the curriculum
    agents/            *.mdx — runnable projects
    useCases/          *.mdx — external projects
  components/
    atlas/             feature islands (palette, notes, feedback, …)
    providers/         React context wrappers
  layouts/
    BaseLayout.astro   every page
    LessonLayout.astro long-form lesson pages
  pages/
    index.astro
    lessons/{index,[slug]}.astro
    agents/{index,[slug]}.astro
    use-cases/{index,[slug]}.astro
    go/[slug].astro
    404.astro
    rss.xml.ts
  lib/
    store.ts           Zustand + persist (favorites, progress, notes)
    utils.ts

packages/ui/src/
  components/ui/       shared shadcn primitives (button, card, sheet, …)
  lib/utils.ts         cn() helper
```

## License

Code: MIT. Content: CC-BY-SA 4.0 where attributed upstream; otherwise CC-BY 4.0.
See `LICENSE`.
