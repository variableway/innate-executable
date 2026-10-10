# PRD M2 — Learning experience

## Problem

Atlas currently lets readers mark lessons complete, save favorites, and write
notes. It does not yet provide a full loop of course progress, assessment,
feedback, continuation, or recovery of learning state.

## Users and jobs

- A learner wants to resume from the last meaningful point.
- A learner wants immediate explanation after answering a question.
- A learner wants progress without creating an account.
- A returning learner wants to export or reset personal state safely.

## Requirements

### Local learner profile

- Persist completion, quiz results, favorites, notes, recent views, course
  position, project completion, scenarios, streak data, and later diagrams.
- Version persisted state and migrate older versions without silent data loss.
- Provide export, import, and reset controls.
- Keep filters and temporary UI state non-persistent unless explicitly needed.

### Progress and continuation

- Show lesson, module, and course completion percentages.
- A dashboard shows continue learning, recent content, course progress,
  favorites, quiz accuracy, and project progress.
- Completion may be explicit. A course can optionally require a passing quiz,
  but reading is never blocked.
- Continue learning uses last position first, then the first incomplete lesson.

### Quiz

- Support single-choice and multiple-choice questions in v1.
- Every option contains feedback, including incorrect options.
- Show correctness, explanation, retry, and attempt history summary.
- Persist latest/best result by quiz version.
- Content validation rejects missing options, invalid answer IDs, and missing
  feedback.

### Notes and favorites

- Notes autosave locally with clear saved state.
- Empty notes delete the record.
- Favorites support lesson, Agent, project, and use-case content types without
  slug collisions.
- Users can browse all favorites from the dashboard.

### Privacy and resilience

- Explain that state is stored in the current browser.
- All learning UI handles unavailable or full localStorage gracefully.
- Hydration never flashes a false completed state as if it were authoritative.

## UX flow

```text
Open lesson
  → read and take notes
  → answer quiz
  → receive option-specific feedback
  → mark complete
  → dashboard and course progress update
  → continue to next lesson
```

## Acceptance criteria

- Progress survives reload and browser restart.
- A stored v1 Atlas state migrates to the new schema in an automated test.
- Quiz feedback is available for every answer and never reveals correctness
  before submission.
- Exported state can be re-imported into a clean profile.
- Reset requires confirmation and preserves theme unless the user requests a
  full reset.
- All core actions are keyboard accessible and announced appropriately.

## Out of scope for v1

- Server-authoritative grades.
- Certificates and instructor grading.
- Cross-device sync and social leaderboards.

## Metrics

- Quiz submit, retry, and completion rates.
- Course continuation after lesson completion.
- Returning learners with restored state.
- Note and favorite usage.
- State import/reset errors.
