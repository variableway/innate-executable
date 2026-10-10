# Sprint delivery plan

## Delivery objective

Deliver a public v1 tutorial platform in dependency-aware Sprints while making
each work packet small enough for a separate AI Agent to implement and verify.

## Sprint summary

| Sprint | Theme | Exit milestone | Estimate |
|---|---|---|---|
| S0 | Stabilize platform | One deployment path, tests, storage migration base | 3–5 days |
| S1 | Typed curriculum | Course/module/content relations and navigation | 1 week |
| S2 | Agent catalog | Normalized source ingestion and at least 10 Agents | 1–2 weeks |
| S3 | Learning loop | Quiz, progress, dashboard; internal MVP | 2 weeks |
| S4 | Projects and practice | 3 projects, scenarios, calculators; public v1 candidate | 2 weeks |
| S5 | Advanced tools | Playground and interview studio, optional post-v1 | 2–3 weeks |
| S6 | Launch and operations | Analytics, quality audit, CMS/launch runbook | 1 week |

Sprint details:

- [`sprint-00-platform.md`](sprint-00-platform.md)
- [`sprint-01-curriculum.md`](sprint-01-curriculum.md)
- [`sprint-02-agent-catalog.md`](sprint-02-agent-catalog.md)
- [`sprint-03-learning-loop.md`](sprint-03-learning-loop.md)
- [`sprint-04-projects-practice.md`](sprint-04-projects-practice.md)
- [`sprint-05-advanced-tools.md`](sprint-05-advanced-tools.md)
- [`sprint-06-launch.md`](sprint-06-launch.md)

## Agent execution protocol

Before starting a task, an Agent reads:

1. [`../01-foundation/README.md`](../01-foundation/README.md)
2. the relevant PRD under [`../02-prd/`](../02-prd/README.md)
3. the relevant spec under [`../04-spec/`](../04-spec/README.md)
4. the Sprint file and task entry

Each task has:

- stable task ID;
- dependency IDs;
- recommended Agent role;
- exclusive primary file ownership;
- output and acceptance checks;
- integration notes.

## Parallel work rules

1. Use one branch/worktree per task when multiple Agents are active.
2. Do not modify a file owned by another active task.
3. Shared contracts land in Wave A before dependent Wave B tasks merge.
4. UI tasks develop against typed fixture DTOs when build-time ingestion is
   being implemented in parallel.
5. Content migration tasks edit disjoint slug ranges/directories.
6. Only the Sprint integration task updates shared navigation, aggregate
   exports, and release documentation unless ownership says otherwise.
7. `package.json`, the lockfile, `src/content/config.ts`, `src/lib/store.ts`,
   and global layouts are serialized ownership surfaces.
8. If a new dependency is needed, the task records the exact package and reason;
   the designated package owner performs the install.

## Definition of ready

A task is ready when:

- all dependency tasks are merged or their contract is frozen;
- input fixtures exist;
- owned files do not overlap another active task;
- acceptance commands are available or explicitly delegated to integration.

## Definition of done

- Implementation matches the referenced spec.
- Unit/content/component tests cover changed behavior.
- Accessibility and empty/error/loading states are handled.
- No unrelated files are reformatted.
- Required commands pass for the task surface.
- The task report lists files changed, decisions, tests, and follow-up risks.
- Integration notes identify any new route, script, environment variable,
  dependency, persisted-state change, or content migration.

## Task report template

```markdown
# Sx-Tyy completion report

- Outcome:
- Files changed:
- Contract/API changes:
- Tests run:
- Remaining risks:
- Integration instructions:
```

## Dependency overview

```text
S0 platform
  └── S1 content contracts
       ├── S2 Agent catalog
       └── S3 learning loop
            └── S4 projects/practice
                 ├── public v1
                 └── S5 advanced tools

S6 launch work starts during S3/S4 where independent,
but final launch gate depends on S4.
```

## Recommended concurrent lanes

With four Agents, use these lanes:

| Lane | Typical ownership |
|---|---|
| A Contracts/platform | Schemas, shared types, persistence, build config |
| B Static frontend | Astro routes and server-rendered components |
| C Interactive frontend | React islands and local state consumers |
| D Content/quality | Migration, fixtures, validators, Playwright/a11y |

Never keep all four Agents working on the same page or shared configuration
file. Prefer vertical tasks with an explicit integration seam.
