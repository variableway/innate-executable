# PRD M4 — Projects and practice

## Problem

Reading and code inspection are not enough to demonstrate understanding. The
System Design Academy has strong project, scenario, calculator, playground,
and interview patterns that should be generalized without moving its monolithic
JavaScript architecture into Atlas.

## Users and jobs

- A learner wants an end-to-end assignment after a group of lessons.
- A learner wants immediate feedback on architecture decisions.
- A learner wants small calculators and diagrams to support reasoning.
- An interview candidate wants timed, repeatable practice later.

## Requirements

### Guided projects

- Projects include problem, functional and non-functional requirements,
  assumptions, capacity, API, data model, architecture, request flow, storage,
  caching, scaling, reliability, security, observability, failures,
  bottlenecks, trade-offs, cost, improvements, and interview points.
- A project may reference lessons, Agents, scenarios, and an optional starter
  diagram.
- Users can mark projects started/completed and maintain a local checklist.
- Reference solutions are clearly separated from the learner prompt.

### Scenarios

- Present context, a decision question, and scored options.
- Scores use `2` recommended, `1` defensible but incomplete, and `0` risky.
- Every option has answer-specific feedback and links to a relevant lesson.
- Users can retry and review previous choices.

### Calculators

- Provide capacity tools for request rate, concurrency, storage growth,
  bandwidth, cache sizing, and failure-aware instance count.
- Show units, assumptions, formula, and result—not only a number.
- Reject invalid values and avoid `NaN`, infinity, or misleading precision.

### Architecture playground — post-v1

- Drag components, connect nodes, label edges, edit/duplicate/delete items,
  load templates, autosave, and import/export JSON and images.
- Project starter architectures can open in the playground.
- The playground is a single lazy React island and must not increase lesson
  JavaScript payloads.

### Interview studio — post-v1

- Provide prompts, 45-minute timer, progressive hints, notes, reference
  solution, and rubric-based self-scoring.

## Acceptance criteria

- Public v1 contains at least three complete projects.
- All required project sections pass content validation.
- Every scenario has four options, valid scores, feedback, and a valid lesson
  reference.
- Calculator fixtures match independently verified expected results.
- Project completion contributes to dashboard progress.
- Advanced tool failures never prevent access to project prose.

## Out of scope for v1

- Automatic grading of free-form architecture submissions.
- Multi-user collaborative diagrams.
- Hosted execution of untrusted code.

## Metrics

- Project starts and completions.
- Scenario choice distribution and retries.
- Calculator usage.
- Playground exports and interview sessions after launch.
