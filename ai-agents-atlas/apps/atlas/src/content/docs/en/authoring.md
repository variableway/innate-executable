---
title: Authoring content
description: Conventions for writing lessons, agent pages, and use-case entries.
---

The Atlas treats content as code. Every page has the same shape:

1. **Frontmatter** — typed metadata. See [frontmatter-schema.md](./frontmatter-schema.md).
2. **Body** — MDX. Markdown that may include React components.
3. **A PR** — the only way content reaches production.

## Lessons

Use `pnpm new:lesson "<title>"` to scaffold. Then:

1. Set `publishedAt` to the actual publish date (not today's date).
2. Pick a `level` honestly. `beginner` should not assume the reader has
   built an agent before.
3. Pick `framework` from the enum. If you compare two frameworks, use
   `cross` and explain why in the body.
4. Keep `objectives` to 3–5 short bullets. They render in the right rail.
5. Aim for 8–20 minutes of read time.

MDX tips:

- Code fences inherit Shiki highlighting — pick a language tag.
- Use `<Callout>`-style components sparingly; an `aside` or blockquote
  is usually enough.
- Avoid inline `<style>` and `<script>` — there's no hydration context
  in lesson prose.

## Agents

Agent pages describe a runnable project. They have:

- A **Run in 5 minutes** sidebar card with the exact commands.
- A **Metadata** sidebar card listing framework, difficulty, LLM, etc.
- A **Source** sidebar card linking to the upstream repo.
- The body — a Markdown walk-through of what the agent does.

The `githubPath` field is what makes the sidebar's "View on GitHub"
button work. It must match the upstream folder exactly:

```
githubPath: "agents/01-web-research-agent"
```

## Use cases

Use cases are external projects. Their URL must be present and live.
They render with a 3-second redirect page (`/go/<slug>`) so readers
can opt out before leaving the atlas.

If the upstream project disappears, **delete the entry**. Don't leave
a tombstone — the upstream is supposed to be the source of truth.

## Voice

- Short sentences. One idea per paragraph.
- Prefer concrete code over abstract diagrams. When you do diagram,
  use a `mermaid` block.
- Reference other lessons with `[link text](/lessons/<slug>)` so the
  pages are cross-linked.
- Cite external sources inline with `[descriptive text](url)`.

## What NOT to do

- Don't duplicate the upstream README — link to it instead.
- Don't write framework advocacy. If `framework` is `crewai`, the
  lesson is about CrewAI; not about why CrewAI is best.
- Don't add marketing CTAs to LLM vendor landing pages.
- Don't ship without setting `publishedAt` to a real date.