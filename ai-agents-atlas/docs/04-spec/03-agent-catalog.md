# Spec M3 — Agent catalog

Related PRD: [`../02-prd/03-agent-catalog.md`](../02-prd/03-agent-catalog.md)

## 1. Source contract

Each source Agent directory contains:

```text
<agent-slug>/
├── metadata.yaml       required
├── README.md           required
├── agent.py            default entrypoint; metadata may override
├── requirements.txt    required unless metadata declares another file
└── supporting files    optional, allowlisted
```

Authoritative metadata:

```ts
type AgentMetadata = {
  slug: string;
  title: string;
  description: string;
  framework: FrameworkSlug;
  llm: string;
  industry: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  language: string;
  entrypoint: string;
  requirements: string;
  sourceUrl: string;
  publishedAt: string;
  order?: number;
  files?: string[];
  setupCommands?: string[];
  runCommands?: string[];
  relatedLessons?: string[];
  relatedProjects?: string[];
};
```

If the upstream metadata lacks fields, the migration task may create an Atlas
sidecar manifest. It must not silently derive authoritative values from a
README heading or table.

## 2. Ingestion pipeline

Implement `scripts/sync-agents.ts`:

```text
configured source root
  → enumerate direct child directories
  → parse metadata with YAML library
  → validate schema and paths
  → read allowlisted files as UTF-8 with size limits
  → create normalized Agent DTOs
  → emit deterministic generated data or MDX sidecars
  → write manifest with source hash and exclusions
```

Rules:

- Sort all directories/files deterministically.
- Resolve and verify every path remains under the Agent directory.
- Deny `.env`, credentials, keys, binary files, lockfiles, hidden files, and
  files over the configured maximum.
- Redact nothing silently: suspected secret content fails validation and names
  the file, not the matched secret.
- Generation must be idempotent; a second run has no diff.
- `--check` compares current generated output without writing.

Recommended output:

```text
src/generated/agents/
├── manifest.json
├── 01-web-research-agent.json
└── files/
    └── 01-web-research-agent/
        ├── README.md.txt
        ├── agent.py.txt
        └── requirements.txt.txt
```

Generated files are data, not Astro content entries. A curated
`src/content/agents/<slug>.mdx` may provide additional walkthrough prose and
overrides, joined by slug at build time.

## 3. Frontend specification

### Routes

- `/agents`: static catalog shell with filter/comparison island.
- `/agents/[slug]`: static detail page with file-tabs island.
- `/compare/agents?items=a,b,c`: shareable comparison route or dialog state.

### Components

```text
src/components/atlas/agents/
├── agent-card.astro
├── agent-catalog.tsx
├── agent-metadata.astro
├── agent-file-tabs.tsx
├── run-commands.astro
├── agent-actions.tsx
└── agent-comparison.tsx
```

- Files render escaped text only; Markdown README may be rendered through the
  trusted build pipeline, never assigned directly to `innerHTML` in the browser.
- Large code files use a height limit and explicit expansion.
- Comparison stacks fields vertically on small screens rather than forcing a
  full desktop-width table.

## 4. Build-time backend

- `src/lib/agents/catalog.ts` joins generated records with optional curated MDX.
- `getStaticPaths` receives only normalized, public records.
- Pagefind metadata includes framework, difficulty, language, industry, tags.
- CI runs `pnpm agents:sync --check` before build.

## 5. Runtime backend

None. Source files are part of the static artifact. GitHub links point to the
canonical repository; Atlas does not proxy or execute code.

## 6. Test specification

- Unit fixtures: valid Agent, missing entrypoint, traversal, oversized file,
  duplicate slug, suspect secret filename, deterministic ordering.
- Snapshot normalized DTOs, not full HTML pages.
- Browser: filter, file tab, copy setup command, source link, comparison cap.
- Build assertion: all accepted source directories have a route or an explicit
  manifest exclusion.
