# Atlas Tutorial Platform — shared foundation

## 1. Purpose

Atlas is a continuously publishable tutorial platform for learning how to
design, build, evaluate, and operate AI agents. It combines three proven ideas:

- **AI Agents Atlas:** static-first, typed MDX, good SEO, small React islands,
  and a low-cost publishing pipeline.
- **500 AI Agents Projects:** runnable code, README files, dependency files,
  and metadata live next to the project they describe.
- **System Design Academy:** structured learning paths, quizzes, projects,
  scenarios, calculators, progress tracking, and interview practice.

The product must let an author publish a valid tutorial quickly and let a
reader move from discovery to practice without requiring an account.

## 2. Product promise

> Learn a concept, inspect working code, check understanding, complete a
> project, and continue from the same place on the next visit.

Atlas is not just a catalog of links and it is not a general-purpose learning
management system. It is a focused technical tutorial platform whose content
and runnable examples are versioned together.

## 3. Target users

### Reader

- Discovers a topic through search, framework, level, tag, or course.
- Reads without signing in.
- Runs examples locally using exact commands.
- Completes quizzes and projects.
- Keeps local progress, notes, and favorites.

### Author

- Creates a lesson, project, quiz, or Agent using a scaffold.
- Writes Markdown/MDX instead of editing application code.
- Sees schema and relationship errors before review.
- Receives a preview URL for every pull request.

### Maintainer

- Reviews content and code through Git.
- Can trace each feature to a PRD, spec, and task ID.
- Can roll back a static deployment.
- Uses aggregate, privacy-friendly feedback to improve content.

## 4. Success outcomes

Initial product outcomes:

- A reader can complete the full loop: course → lesson → quiz → completion →
  next lesson.
- An author can scaffold and preview a lesson without changing route code.
- Every published entity passes typed schema and relationship validation.
- At least 10 lessons, 10 runnable Agents, and 3 projects are production-ready
  before public v1.
- Tutorial content remains readable when client JavaScript fails.
- Anonymous reading, search, and local progress require no backend.

Operational targets:

- Production build succeeds from a clean checkout.
- No broken internal content references reach `main`.
- Core reading pages meet WCAG 2.2 AA expectations.
- Static lesson pages remain within the agreed Lighthouse performance budget.

## 5. Scope

### Public v1

- Courses, modules, lessons, Agents, projects, use cases, and framework pages.
- Full-text search, filters, related content, and previous/next navigation.
- Local progress, favorites, notes, recent views, quizzes, and a dashboard.
- Runnable code display with source, requirements, setup, and run commands.
- Project-based learning, reference answers, and basic capacity calculators.
- Static SEO, RSS, sitemap, analytics, comments, and page feedback.
- Typed authoring, CI validation, pull-request previews, and automated deploys.

### Later phases

- Architecture playground and timed interview studio.
- Authentication and cross-device progress sync.
- Instructor, cohort, certificates, payments, and private content.
- Internationalization and translated content workflows.
- Safe hosted code execution.

## 6. Non-goals

- Do not turn the site into a client-side SPA.
- Do not require login to read free tutorials.
- Do not infer authoritative metadata from arbitrary README formatting.
- Do not execute user-provided Agent code or expose model API keys in the
  browser.
- Do not introduce Next.js or TanStack Router while Astro owns routing.
- Do not add a database until a feature requires shared remote state.

## 7. Architecture principles

1. **Static by default.** Astro renders content routes at build time.
2. **Interactive by exception.** React islands handle stateful widgets only.
3. **Content is typed.** Zod schemas and relation checks fail the build early.
4. **One source of truth.** A fact is authored once and referenced elsewhere.
5. **Local-first learning state.** Anonymous progress survives reloads without a
   server.
6. **Remote state is optional.** TanStack Query appears only when an API exists.
7. **Stable identifiers.** Slugs and IDs are durable storage and URL keys.
8. **Progressive enhancement.** Reading and navigation work without hydration.
9. **Narrow modules.** Content, learning, catalog, practice, and operations
   communicate through documented contracts.
10. **Reversible infrastructure.** Hosting and feedback services can be swapped
    without rewriting content.

## 8. Target technical architecture

```text
Authoring
  MDX / YAML / Decap CMS / scaffolding scripts
         │
         ▼
Content platform
  Astro Content Collections + Zod + relation validator
         │
         ├───────────── Agent source sync ─────────────┐
         ▼                                             │
Static build                                           │
  Astro + Shiki + Pagefind + RSS + sitemap + JSON-LD  │
         │                                             │
         ▼                                             │
Delivery                                               │
  Cloudflare Pages + cache headers + preview builds   │
         │                                             │
         ▼                                             │
Browser                                                │
  Static HTML + React islands                          │
         │                                             │
         ├── Zustand persist: local learning state     │
         ├── Giscus/Plausible: optional external tools │
         └── TanStack Query: future remote sync        │
                                                       │
Runnable Agent folders ── metadata + code + README ────┘
```

## 9. Technology decisions

| Concern | Selection | Boundary |
|---|---|---|
| Site framework | Astro, static output | Owns routes, content rendering, SEO |
| Interactive UI | React 18 islands | Quiz, progress, notes, tools |
| Language | TypeScript strict | Application and scripts |
| Content | MDX for prose, YAML for structured data | One entity per file |
| Validation | Astro collections + Zod + custom relations | Build-time |
| Styling | Tailwind + shadcn/ui/Radix | Shared design system |
| Local state | Zustand persist | Anonymous learner state |
| Remote state | TanStack Query, deferred | Only after an API exists |
| Search | Pagefind | Build-generated, no search server |
| Code rendering | Shiki | Build-time highlighting |
| Static diagrams | Mermaid | Explanatory content |
| Interactive diagrams | `@xyflow/react`, later | One isolated React island |
| Tests | Vitest, Playwright, axe | Unit, integration, browser, a11y |
| Hosting | Cloudflare Pages | One selected deployment target |
| Feedback | Plausible, Giscus, optional Worker | Replaceable adapters |
| Future sync | Supabase or equivalent | Auth and cross-device state only |

Astro remains on the currently pinned major version while integration work is
underway. A major-version upgrade is a separate ADR and Sprint task, never a
side effect of feature work.

## 10. Module map

### M1 — Content and discovery

Owns content collections, courses, modules, lessons, taxonomy, search,
navigation, related items, RSS, and sitemap.

### M2 — Learning experience

Owns progress, completion, quizzes, notes, favorites, recent activity,
recommendations, learner dashboard, and local state migration.

### M3 — Agent catalog

Owns Agent source ingestion, metadata, source-file views, setup/run commands,
filters, framework pages, and comparisons.

### M4 — Projects and practice

Owns project guides, scenarios, calculators, reference solutions,
architecture playground, and interview practice.

### M5 — Authoring and publishing

Owns scaffolds, CMS configuration, validation, previews, CI, deploy, redirects,
cache policy, and release runbooks.

### M6 — Feedback and account services

Owns analytics, comments, thumbs feedback, privacy, optional authentication,
and future remote progress synchronization.

## 11. Module boundaries

- M1 supplies typed content DTOs; it does not write learner state.
- M2 references content by stable slug; it does not parse MDX or source files.
- M3 emits normalized Agent records; presentation components never parse YAML.
- M4 reuses M2 persistence actions but owns project/scenario/diagram payloads.
- M5 may fail a build but must not silently rewrite authored content.
- M6 cannot make public reading dependent on a remote service.

## 12. Repository conventions

Target layout:

```text
src/
├── content/
│   ├── courses/
│   ├── lessons/
│   ├── agents/
│   ├── projects/
│   ├── quizzes/
│   ├── scenarios/
│   ├── interviews/
│   ├── useCases/
│   └── docs/
├── components/
│   ├── ui/
│   └── atlas/
│       ├── content/
│       ├── learning/
│       ├── agents/
│       └── practice/
├── lib/
│   ├── content/
│   ├── learning/
│   └── validation/
├── pages/
└── styles/
scripts/
tests/
```

Generated content, if needed, belongs under `src/generated/` and must include a
header naming its generator. Components must not import directly from the
upstream 500project directory.

## 13. Shared vocabulary

| Term | Meaning |
|---|---|
| Course | Ordered learning product made of modules |
| Module | Named ordered group of lesson slugs within a course |
| Lesson | Long-form instructional MDX page |
| Agent | Runnable source project with metadata and code files |
| Project | Guided end-to-end learner deliverable |
| Quiz | Structured questions linked to a lesson or module |
| Scenario | Decision exercise with scored, option-specific feedback |
| Use case | Curated external resource, not owned runnable code |
| Completion | Explicit learner action or accepted assessment result |
| Local-first | State works without auth and is stored in the browser |
| Build service | Script/CI behavior that acts like a backend during build |

## 14. Source references

- Current Atlas architecture: [`../architecture.md`](../architecture.md)
- Current content schema: [`../frontmatter-schema.md`](../frontmatter-schema.md)
- Interactive state: [`../interactive-widgets.md`](../interactive-widgets.md)
- Publishing model: [`../six-layer-model.md`](../six-layer-model.md)
- Product requirements: [`../02-prd/README.md`](../02-prd/README.md)
- Technical specifications: [`../04-spec/README.md`](../04-spec/README.md)
- Delivery plan: [`../05-tasks/README.md`](../05-tasks/README.md)
