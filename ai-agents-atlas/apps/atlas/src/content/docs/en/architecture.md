---
title: Architecture
description: How the Atlas is built, from Astro entrypoints to the rendered HTML.
---

The Atlas is a static-first site. Every page is rendered at build time
from typed Markdown. The only runtime JavaScript is the React islands
mounted through Astro's client directives.

## Process model

```
                         ┌─────────────────────────────────────┐
   content/lessons/*.mdx │                                     │
   content/agents/*.mdx  │  Astro build (Vite + Rollup)        │
   content/useCases/*.mdx│                                     │
                         │  - Zod schema validation            │
                         │  - MDX → HTML (Shiki highlighting)  │
                         │  - shadcn primitives compiled       │
                         │  - islands split into chunks        │
                         └────────────────┬────────────────────┘
                                          │
                                          ▼
                                  dist/*.html + _astro/*.js
                                          │
                                          ▼
                          Cloudflare Pages (edge cache)
                                          │
                                          ▼
                                Plausible analytics
```

## Top-level layout

```
src/
├── components/
│   ├── ui/           shadcn primitives — server-renderable, no state
│   ├── atlas/        Feature islands — stateful, client:* mounted
│   └── providers/    React context wrappers (theme)
├── content/
│   ├── config.ts     Zod schemas (one per collection)
│   ├── lessons/      MDX files for the curriculum
│   ├── agents/       MDX files for runnable projects
│   └── useCases/     MDX files for external references
├── layouts/
│   ├── BaseLayout.astro    every page inherits this
│   └── LessonLayout.astro  long-form lesson wrapper
├── pages/            File-based routing
├── lib/
│   ├── store.ts      Zustand + persist — the only persistent state
│   ├── utils.ts      cn(), formatDate, slugify
│   └── reading.ts    WPM-based read time
├── styles/
│   └── globals.css   Tailwind directives + CSS variables
└── types/            Ambient declarations (Pagefind, etc.)
```

## Rendering paths

### Server-rendered HTML

Astro pages (`.astro`) emit plain HTML at build time. They can read
content collections synchronously and pass data into components. There
is no client JavaScript cost unless you opt in with `client:*`.

### React islands

Astro mounts React components only when you write:

- `client:load` — hydrate immediately (e.g. theme toggle).
- `client:idle` — hydrate on `requestIdleCallback` (palette, copy-code).
- `client:visible` — hydrate on intersection (comments below the fold).
- `client:only="react"` — render exclusively on the client.

The Atlas uses `client:load` for stateful widgets the user may
interact with in the first 100 ms, and `client:idle` for everything
else.

## State

There is **one** client store: `useAtlasStore` in `src/lib/store.ts`.
It persists to `localStorage` under the key `ai-agents-atlas:v1`.

State slices:

| Slice             | Purpose                                   | Persisted? |
|-------------------|-------------------------------------------|------------|
| `favorites`       | Saved lesson/agent slugs                  | yes        |
| `recentlyViewed`  | Recently-viewed items (max 20)            | yes        |
| `completedLessons`| Slugs marked done                         | yes        |
| `notes`           | Per-slug personal notes                   | yes        |
| `compareList`     | Up to 3 slugs selected for side-by-side   | yes        |
| `filter`          | Current lesson-list filter                | no — transient |

## Why static-first

- **SEO**: every page is a single HTML document. No JS required for
  crawlers or readers without scripting.
- **Cost**: Cloudflare Pages serves from edge cache for free.
- **Reliability**: no backend means no auth outages, no DB backups,
  no migration anxiety.
- **DX**: frontmatter is type-checked at build time — typos fail
  the PR build, not the reader's screen.

See [six-layer-model.md](./six-layer-model.md) for the *strategic*
framing (Authoring → Content → Build → Distribution → Feedback →
Governance).