'use client';

import * as React from 'react';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Lightweight thumbs feedback widget. Stores votes in localStorage
 * keyed by pathname, and POSTs to the configured endpoint when
 * available (e.g. a Cloudflare Pages Function) — otherwise it's
 * a polite no-op.
 */
export function FeedbackWidget({
  endpoint,
  labels,
}: {
  endpoint?: string;
  labels: { question: string; yes: string; no: string; toastUp: string; toastDown: string };
}) {
  const [voted, setVoted] = React.useState<'up' | 'down' | null>(null);

  React.useEffect(() => {
    const stored = window.localStorage.getItem(`atlas:vote:${window.location.pathname}`);
    if (stored === 'up' || stored === 'down') setVoted(stored);
  }, []);

  const send = async (vote: 'up' | 'down') => {
    setVoted(vote);
    window.localStorage.setItem(`atlas:vote:${window.location.pathname}`, vote);
    toast.success(vote === 'up' ? labels.toastUp : labels.toastDown);
    if (!endpoint) return;
    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          vote,
          path: window.location.pathname,
          ts: Date.now(),
        }),
      });
    } catch {
      /* silent — local storage still captured the vote */
    }
  };

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span>{labels.question}</span>
      <button
        type="button"
        aria-label={labels.yes}
        aria-pressed={voted === 'up'}
        onClick={() => send('up')}
        className={`rounded-md border border-border p-1.5 transition-colors hover:bg-accent ${voted === 'up' ? 'bg-accent text-primary' : ''}`}
      >
        <ThumbsUp className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label={labels.no}
        aria-pressed={voted === 'down'}
        onClick={() => send('down')}
        className={`rounded-md border border-border p-1.5 transition-colors hover:bg-accent ${voted === 'down' ? 'bg-accent text-destructive' : ''}`}
      >
        <ThumbsDown className="h-4 w-4" />
      </button>
    </div>
  );
}