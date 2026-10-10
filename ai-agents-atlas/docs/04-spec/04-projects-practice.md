# Spec M4 — Projects and practice

Related PRD: [`../02-prd/04-projects-practice.md`](../02-prd/04-projects-practice.md)

## 1. Project content contract

Store project prose in `src/content/projects/<slug>.mdx`; keep structured
metadata and required design sections in frontmatter or referenced YAML.

```ts
type Project = {
  title: string;
  description: string;
  level: Level;
  frameworks: FrameworkSlug[];
  tags: string[];
  duration?: number;
  lessons: string[];
  agents: string[];
  scenarios: string[];
  objectives: string[];
  checklist: Array<{ id: string; text: string }>;
  problem: string;
  functional: string[];
  nonFunctional: string[];
  assumptions: string[];
  capacity: Array<{ label: string; value: string }>;
  api: Array<{ method: string; path: string; purpose: string }>;
  dataModel: Array<{ entity: string; fields: string; purpose: string }>;
  architecture: Array<{ label: string; detail: string }>;
  requestFlow: string[];
  database: string[];
  caching: string[];
  scaling: string[];
  reliability: string[];
  security: string[];
  observability: string[];
  failures: string[];
  bottlenecks: string[];
  tradeoffs: string[];
  cost: string[];
  improvements: string[];
  interviewPoints: string[];
  starterDiagram?: string;
  draft: boolean;
};
```

The exact schema may group large sections into referenced YAML to keep
frontmatter readable, but every field remains typed and validated.

## 2. Scenario contract

```ts
type Scenario = {
  title: string;
  category: string;
  context: string;
  question: string;
  lesson: string;
  options: Array<{
    id: string;
    text: string;
    score: 0 | 1 | 2;
    feedback: string;
  }>;
};
```

Each scenario has exactly four options and at least one score-2 option.

## 3. Frontend specification

### Static routes

- `/projects`
- `/projects/[slug]`
- `/practice/scenarios`
- `/tools/capacity`
- `/tools/playground` post-v1
- `/practice/interview` post-v1

### Components

```text
src/components/atlas/practice/
├── project-card.astro
├── project-outline.astro
├── project-checklist.tsx
├── reference-solution.tsx
├── scenario-player.tsx
├── capacity-calculator.tsx
├── architecture-playground.tsx
└── interview-studio.tsx
```

Project prose and reference architecture render statically. Checklists,
scenarios, calculators, playground, and interview studio are independent
islands and must not share a single application-sized root.

## 4. Calculator specification

Calculation functions live in `src/lib/practice/calculators.ts` and are pure.
Inputs use explicit units; internal calculations use base units.

Minimum functions:

- `requestsPerSecond(requests, periodSeconds)`
- `peakRps(averageRps, peakMultiplier)`
- `concurrency(rps, latencySeconds)`
- `storageGrowth(recordsPerSecond, bytesPerRecord, retentionSeconds, replicas)`
- `bandwidth(rps, bytesPerRequest, bytesPerResponse)`
- `cacheSize(workingSetBytes, targetHitSetPercent, overheadPercent)`
- `serverCount(peakRps, safeRpsPerServer, failureReserve)`

Every function validates finite nonnegative inputs and returns a typed result or
typed error. UI formatting is separate from calculation.

## 5. Playground specification — post-v1

Use `@xyflow/react` inside one `client:only="react"` or `client:load` route-level
island.

```ts
type DiagramV1 = {
  version: 1;
  nodes: Array<{
    id: string;
    type: string;
    label: string;
    description?: string;
    position: { x: number; y: number };
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    label?: string;
  }>;
};
```

- Store diagrams under a dedicated IndexedDB/localStorage adapter with version.
- Validate imported JSON before replacing the current diagram.
- SVG/PNG export happens in the browser.
- Autosave is debounced and never writes on every pointer event.

## 6. Interview specification — post-v1

- Timer uses a monotonic target timestamp so background tabs do not drift.
- Notes persist by prompt ID.
- Rubric categories and score ranges are content data.
- Hints reveal progressively and persist during a session.

## 7. Build-time backend

- Validate project completeness and all relationships.
- Transform starter diagram content into validated DTOs.
- Exclude reference solutions from catalog summaries, not from the public static
  artifact; these are self-study materials, not secure examinations.

## 8. Runtime backend

None for public v1. Collaborative diagrams or graded submissions would require
a new spec and authorization model.

## 9. Test specification

- Unit: every calculator with normal, zero, boundary, and invalid fixtures.
- Content: project required fields and scenario score/reference checks.
- Component: scenario feedback and project checklist persistence.
- Browser: start/complete project and dashboard update.
- Post-v1: diagram import validation, autosave debounce, export, timer drift.
