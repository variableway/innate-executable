---
title: Frontmatter schema reference
description: Every field on every collection, with examples and defaults.
---

Schemas live in `src/content/config.ts`. They're enforced at build time
by `astro:content`. If a field is wrong, the build fails with a
specific message — fix the file, don't edit the schema.

## `lessons` collection

Path: `src/content/lessons/<slug>.mdx`

| Field           | Type                          | Required | Default        | Notes |
|-----------------|-------------------------------|----------|----------------|-------|
| `title`         | string                        | ✓        |                |       |
| `description`   | string                        | ✓        |                |       |
| `author`        | string                        |          | `'Atlas Team'` |       |
| `publishedAt`   | ISO date                      | ✓        |                | coerces strings to Date |
| `updatedAt`     | ISO date                      |          |                |       |
| `level`         | enum                          | ✓        |                | `'beginner' \| 'intermediate' \| 'advanced'` |
| `framework`     | enum                          | ✓        |                | see below |
| `industry`      | string                        |          |                |       |
| `tags`          | string[]                      |          | `[]`           |       |
| `duration`      | number (minutes, int > 0)     |          | computed       | read time from body if unset |
| `prerequisites` | string[]                      |          | `[]`           | free-form text — render with care |
| `related`       | string[]                      |          | `[]`           | slugs of related lessons |
| `cover`         | `{ src: string; alt: string }`|          |                |       |
| `resources`     | array of resource objects     |          | `[]`           | see below |
| `draft`         | boolean                       |          | `false`        | drafts excluded from build |
| `objectives`    | string[]                      |          | `[]`           | 3–5 bullets recommended |

### Framework enum

`crewai | langgraph | autogen | agno | llamaindex | cross`

Pick `cross` only for lessons that explicitly compare two or more
frameworks. For lessons that *use* a single framework in passing, pick
the dominant one.

### Resource object

```yaml
resources:
  - label: 'LangGraph docs'
    url: 'https://langchain-ai.github.io/langgraph/'
    type: docs
```

`type` is one of `'github' | 'docs' | 'video' | 'paper' | 'colab'`.

## `agents` collection

Path: `src/content/agents/<slug>.mdx`

| Field         | Type                | Required | Default         |
|---------------|---------------------|----------|-----------------|
| `title`       | string              | ✓        |                 |
| `description` | string              | ✓        |                 |
| `framework`   | enum (as above)     | ✓        |                 |
| `llm`         | string              |          | `'Configurable'`|
| `industry`    | string              |          | `'General'`     |
| `difficulty`  | enum (level-like)   | ✓        |                 |
| `tags`        | string[]            |          | `[]`            |
| `language`    | string              |          | `'Python'`      |
| `entrypoint`  | string              |          | `'agent.py'`    |
| `requirements`| string              |          | `'requirements.txt'` |
| `githubPath`  | string              | ✓        |                 |
| `objectives`  | string[]            |          | `[]`            |
| `publishedAt` | ISO date            | ✓        |                 |
| `order`       | number (int)        |          | `0`             |

## `useCases` collection

Path: `src/content/useCases/<slug>.mdx`

| Field           | Type                | Required | Default      |
|-----------------|---------------------|----------|--------------|
| `title`         | string              | ✓        |              |
| `description`   | string              | ✓        |              |
| `framework`     | enum                | ✓        |              |
| `industry`      | string              |          | `'General'`  |
| `url`           | URL string          |          |              |
| `resourceType`  | enum                |          | `'Link'`     |
| `sourceHeading` | string              | ✓        |              |
| `tags`          | string[]            |          | `[]`         |
| `publishedAt`   | ISO date            |          |              |

`resourceType` is one of `'Notebook' | 'Code' | 'Link' | 'Paper'`.

## Example lesson

```yaml
---
title: "Your first CrewAI agent"
description: "Build a single researcher agent with CrewAI."
author: "Atlas Team"
publishedAt: 2025-08-12
level: beginner
framework: crewai
industry: Research
tags: [crewai, agent-basics, single-agent]
duration: 12
objectives:
  - "Install crewai and configure an OpenAI key"
  - "Define a single agent with role + goal + backstory"
  - "Run one task and inspect the response path"
resources:
  - label: 'CrewAI docs'
    url: 'https://docs.crewai.com/'
    type: docs
draft: false
---

Body in Markdown below the closing `---`.
```