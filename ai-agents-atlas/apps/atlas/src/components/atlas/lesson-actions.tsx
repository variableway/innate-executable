'use client';

import { Bookmark, BookmarkCheck, CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAtlasStore, useHydrated } from '@/lib/store';
import { Button } from '@atlas/ui/components/ui/button';
import { cn } from '@/lib/utils';

export type LessonActionsLabels = {
  complete: string;
  completed: string;
  save: string;
  saved: string;
  /** Toast templates — `{title}` is replaced with the lesson title. */
  toastCompleted: string;
  toastUnmarked: string;
  toastSaved: string;
  toastRemoved: string;
};

/**
 * Lesson-level actions:
 *  - "Mark complete" toggle, persisted in localStorage
 *  - "Save for later" favorite toggle
 *  Both are hydration-safe — they render inert placeholders until the
 *  persistent store has rehydrated, then swap to live state.
 *  Strings arrive via `labels` so the island follows the page locale.
 */
export function LessonActions({
  slug,
  title,
  labels,
}: {
  slug: string;
  title: string;
  labels: LessonActionsLabels;
}) {
  const hydrated = useHydrated();
  const done = useAtlasStore((s) => s.completedLessons.includes(slug));
  const fav = useAtlasStore((s) => s.favorites.includes(slug));
  const markLessonDone = useAtlasStore((s) => s.markLessonDone);
  const toggleFavorite = useAtlasStore((s) => s.toggleFavorite);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant={done ? 'default' : 'outline'}
        size="sm"
        disabled={!hydrated}
        onClick={() => {
          markLessonDone(slug, !done);
          toast.success(
            (done ? labels.toastUnmarked : labels.toastCompleted).replace('{title}', title),
          );
        }}
      >
        {done ? (
          <CheckCircle2 className="mr-1 h-4 w-4" />
        ) : hydrated ? (
          <Circle className="mr-1 h-4 w-4" />
        ) : (
          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
        )}
        {done ? labels.completed : labels.complete}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        disabled={!hydrated}
        onClick={() => {
          toggleFavorite(slug);
          toast.success(fav ? labels.toastRemoved : labels.toastSaved);
        }}
        className={cn(fav && 'text-primary')}
      >
        {fav ? (
          <BookmarkCheck className="mr-1 h-4 w-4" />
        ) : (
          <Bookmark className="mr-1 h-4 w-4" />
        )}
        {fav ? labels.saved : labels.save}
      </Button>
    </div>
  );
}
