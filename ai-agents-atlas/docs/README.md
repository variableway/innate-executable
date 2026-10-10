# Atlas documentation (canonical source)

These Markdown files are the **source of truth** for how the Atlas works and
how its planned implementation is delivered.

The site currently renders a manually mirrored subset at
<https://atlas.example.com/docs/> from `src/content/docs/`. Numbered delivery
documents remain repository-facing until the one-way sync policy in
[`04-spec/05-authoring-publishing.md`](04-spec/05-authoring-publishing.md) is
implemented.

> Until Sprint task `S0-T03` lands, edits to an existing rendered document must
> still be mirrored manually into `src/content/docs/`. New numbered delivery
> documents do not need a manual mirror.

## Layout

```
docs/
├── 01-foundation/                shared product and architecture context
├── 02-prd/                       module-level product requirements
├── 04-spec/                      frontend, build-time, and backend contracts
├── 05-tasks/                     sprint plans and parallel Agent work packets
├── getting-started.md            install + first change
├── architecture.md               current layered view of the codebase
├── six-layer-model.md            Authoring → Governance model
├── authoring.md                  conventions for writing content
├── frontmatter-schema.md         current collection fields
├── interactive-widgets.md        React islands + the Zustand store
├── publishing.md                 deployment notes
├── feedback.md                   feedback channels
├── troubleshooting.md            common build errors + fixes
└── decisions/                    ADRs (Architecture Decision Records)
    ├── 0001-astro-over-next.md
    ├── 0002-use-cases-camelcase.md
    ├── 0003-sitemap-3-2-1.md
    ├── 0004-pagefind-runtime-detection.md
    └── 0005-zustand-persist.md
```

## Delivery documentation

The numbered folders describe the planned evolution of Atlas into a complete
tutorial platform. Read them in this order:

1. [`01-foundation/`](01-foundation/README.md) — purpose, boundaries,
   architecture, modules, shared vocabulary, and non-negotiable decisions.
2. [`02-prd/`](02-prd/README.md) — product behavior and acceptance criteria by
   module.
3. [`04-spec/`](04-spec/README.md) — content models, frontend components,
   build-time services, optional runtime APIs, and test contracts.
4. [`05-tasks/`](05-tasks/README.md) — dependency-aware Sprint work that can
   be distributed to multiple AI Agents.

The numbering intentionally follows the requested delivery convention. There
is no `03` directory at present.

## Conventions

- One page per file. Filename matches the slug.
- ADRs are immutable. To override, write a new ADR and supersede the old one.
- The `date` field on ADRs is the decision date; the file content
  records context and consequences.
- Cross-references use relative paths: `[architecture](architecture.md)`.
- Code blocks default to no syntax (e.g. plain output) unless the
  language matters.
- Planned work uses stable IDs such as `S2-T03`. Do not renumber an ID after
  another document or pull request refers to it.
- A task owns a narrow set of files. Parallel Agents must not edit another
  task's owned files without coordinating through the task's integration note.
