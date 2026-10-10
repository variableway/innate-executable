'use client';

import * as React from 'react';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useAtlasStore, useHydrated } from '@/lib/store';
import { cn } from '@/lib/utils';

type NoteKind = 'lesson' | 'agent' | 'useCase';

/**
 * Debounced personal notes editor. Backed entirely by `localStorage`
 * via the persistent Zustand store. Survives reloads; never sent to a
 * server.
 */
export function NotesEditor({
  kind,
  slug,
  label = 'Your notes',
  labels = {
    saved: 'Saved',
    saving: 'Saving…',
    placeholder: 'Write your private notes here…',
    loading: 'Loading…',
    toastSaved: 'Note saved',
    hint: 'Saved locally on this device. Never sent anywhere.',
  },
}: {
  kind: NoteKind;
  slug: string;
  label?: string;
  labels?: {
    saved: string;
    saving: string;
    placeholder: string;
    loading: string;
    toastSaved: string;
    hint: string;
  };
}) {
  const hydrated = useHydrated();
  const id = `${kind}:${slug}` as const;
  const stored = useAtlasStore((s) => s.notes[id]?.body ?? '');
  const setNote = useAtlasStore((s) => s.setNote);

  const [draft, setDraft] = React.useState(stored);
  const [saved, setSaved] = React.useState(true);

  // Sync draft when slug changes
  React.useEffect(() => {
    setDraft(stored);
    setSaved(true);
  }, [stored, id]);

  // Debounced save
  React.useEffect(() => {
    if (!hydrated) return;
    if (draft === stored) return;
    setSaved(false);
    const t = setTimeout(() => {
      setNote(kind, slug, draft);
      setSaved(true);
      if (draft.trim()) toast.success(labels.toastSaved);
    }, 600);
    return () => clearTimeout(t);
  }, [draft, stored, hydrated, kind, slug, setNote, labels.toastSaved]);

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-2 flex items-center justify-between">
        <label
          htmlFor={`notes-${id}`}
          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          {label}
        </label>
        <span
          className={cn(
            'flex items-center gap-1 text-[10px] uppercase tracking-wider',
            saved ? 'text-muted-foreground' : 'text-primary',
          )}
        >
          {saved ? <Save className="h-3 w-3" /> : <Loader2 className="h-3 w-3 animate-spin" />}
          {saved ? labels.saved : labels.saving}
        </span>
      </div>
      <textarea
        id={`notes-${id}`}
        value={draft}
        disabled={!hydrated}
        placeholder={hydrated ? labels.placeholder : labels.loading}
        onChange={(e) => setDraft(e.target.value)}
        className="min-h-[120px] w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
      />
      <p className="mt-2 text-[11px] text-muted-foreground">
        {labels.hint}
      </p>
    </div>
  );
}