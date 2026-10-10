# Spec M2 — Learning experience

Related PRD: [`../02-prd/02-learning-experience.md`](../02-prd/02-learning-experience.md)

## 1. Persistent state contract

Use one Zustand store and localStorage key `ai-agents-atlas:v2`.

```ts
type ContentRef = {
  kind: 'lesson' | 'agent' | 'project' | 'useCase';
  slug: string;
};

type QuizAttempt = {
  quizId: string;
  version: number;
  answers: Record<string, string[]>;
  correct: number;
  total: number;
  completedAt: number;
};

type LearningStateV2 = {
  version: 2;
  favorites: string[]; // `${kind}:${slug}`
  recentlyViewed: Array<ContentRef & { title: string; href: string; ts: number }>;
  completedLessons: string[];
  completedProjects: string[];
  quizResults: Record<string, QuizAttempt[]>;
  scenarioAnswers: Record<string, { optionId: string; score: 0 | 1 | 2; ts: number }>;
  notes: Record<string, { id: string; body: string; updatedAt: number }>;
  lastLessonByCourse: Record<string, string>;
  projectChecklists: Record<string, string[]>;
  lastVisitDate?: string;
  streak: number;
};
```

Large diagram payloads remain outside the root state until M4 and use a
separate versioned storage adapter to avoid rewriting the entire learner state
on pointer movement.

### Migration

- The Zustand `persist` version is `2`.
- Migrate unnamespaced v1 favorites by resolving known content collections at
  build/page input; ambiguous slugs default to `lesson` only when present there.
- Preserve completed lessons and notes.
- Migration is pure and covered by fixtures.
- On corrupt JSON, retain a downloadable raw value when possible and offer a
  safe reset; do not loop on hydration failure.

## 2. Quiz content contract

Store quizzes as YAML under `src/content/quizzes/<slug>.yaml`.

```ts
type Quiz = {
  lesson: string;
  version: number;
  passingPercent?: number;
  questions: Array<{
    id: string;
    type: 'single' | 'multiple';
    prompt: string;
    explanation: string;
    options: Array<{
      id: string;
      text: string;
      feedback: string;
    }>;
    answers: string[];
  }>;
};
```

Validation:

- Question and option IDs are unique within scope.
- `single` has exactly one answer; `multiple` has at least one.
- Every answer references an option.
- Every option has nonempty feedback.
- Changing scoring semantics requires incrementing `version`.

## 3. Frontend specification

### Islands

```text
src/components/atlas/learning/
├── lesson-actions.tsx
├── quiz.tsx
├── quiz-question.tsx
├── course-progress.tsx
├── learner-dashboard.tsx
├── continue-learning.tsx
├── notes-editor.tsx
├── favorites-list.tsx
└── learning-data-controls.tsx
```

- Quiz is mounted `client:visible` unless it is above the fold.
- Dashboard is one `client:load` island so selectors share a hydration boundary.
- Lesson actions and notes may remain separate islands because Zustand is an
  external store; they must still render stable server fallbacks.

### Progress calculation

- Lesson completion is boolean by slug.
- Module progress is completed public lessons divided by public lessons.
- Course progress uses the same calculation across all modules.
- Project completion is displayed separately and does not change lesson
  percentage unless a course explicitly declares it required.
- Empty denominators render `0%`, never `NaN`.

### Continue learning

1. Use `lastLessonByCourse[course]` if it belongs to the course and is
   incomplete.
2. Otherwise select the first incomplete lesson.
3. If complete, link to course review/dashboard.

## 4. Build-time backend

- Serialize quiz DTOs into lesson props only when a lesson references a quiz.
- Never send answer keys in a separate hidden API request; public static quizzes
  cannot keep answers secret. The goal is learning feedback, not secure exams.
- Supply course outline DTOs to progress islands.
- Validate quiz/lesson one-to-one relationships unless explicitly configured.

## 5. Runtime backend

None for v1. A future sync adapter is described in M6. TanStack Query is not a
dependency of local-only learning islands.

## 6. Test specification

- Unit: state v1→v2 migration, progress math, quiz scoring, continue-learning.
- Component: hydration, answer feedback, retry, notes autosave.
- Browser: complete quiz, reload, dashboard reflects result.
- Storage failure fixture: reading and quiz interaction remain usable with a
  visible persistence warning.
- Accessibility: keyboard answer selection, error/final feedback announcements.
