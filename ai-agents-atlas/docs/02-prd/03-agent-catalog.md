# PRD M3 — Agent catalog

## Problem

The source project contains 21 runnable Agents, while Atlas publishes only a
small manually created subset. The 500project website proves that source files
can drive pages, but its regex-heavy README parsing makes metadata fragile.

## Users and jobs

- A learner wants to inspect and run a complete Agent example.
- A learner wants to compare frameworks, difficulty, LLM, and industry.
- A maintainer wants new source projects to enter the catalog predictably.
- An author wants source code and published instructions to stay aligned.

## Requirements

### Source ingestion

- Discover Agent folders from a configured source root.
- Treat explicit `metadata.yaml` as authoritative for catalog fields.
- Read known supporting files: README, entrypoint, requirements, and optional
  additional source files.
- Normalize source data into a typed Agent record before UI rendering.
- Fail CI on duplicate slugs, missing required files, invalid enums, unsafe
  paths, or metadata/source mismatch.
- Never make UI components parse YAML or README tables.

### Catalog and detail pages

- Publish a static page for every accepted Agent.
- Show title, description, framework, LLM, industry, language, difficulty,
  tags, source path, objectives, and publication state.
- Provide file tabs for README, entrypoint, requirements, metadata, and selected
  supporting files.
- Provide exact setup and run commands with copy actions.
- Link to the canonical source repository and related lessons/projects.

### Discovery and comparison

- Filter Agents by framework, difficulty, industry, language, and tags.
- Search title, description, metadata, and curated concepts.
- Allow up to three Agents in a side-by-side comparison.
- Comparison fields are deterministic and useful even when optional values are
  absent.

## Acceptance criteria

- The first migration imports all 21 source Agents or records an explicit,
  reviewed exclusion reason for each omitted Agent.
- A changed metadata file produces a deterministic generated record.
- Unsupported or secret-like files are never included in the browser bundle.
- Every published setup command references files that exist.
- The comparison UI works at mobile widths without an unreadable wide table.
- Source-sync output is reproducible in CI.

## Out of scope for v1

- Running Agent code on Atlas servers.
- Validating third-party API credentials.
- Automatically claiming that an example still works against every model
  provider version.

## Metrics

- Agent page visits and source clicks.
- Setup/run command copy actions.
- Filter/search usage.
- Comparison usage.
- Source-ingestion failures by reason.
