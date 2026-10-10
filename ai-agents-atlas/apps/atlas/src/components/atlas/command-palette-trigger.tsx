'use client';

import { Search } from 'lucide-react';
import { Button } from '@atlas/ui/components/ui/button';
import { OPEN_COMMAND_PALETTE_EVENT } from './events';

/**
 * Server-renderable trigger that broadcasts a global event. The
 * `CommandPalette` island listens for the event and opens itself —
 * this avoids prop drilling and keeps the button cheap to render.
 * `label` comes from the server so the trigger follows the page locale.
 */
export function CommandPaletteTrigger({
  iconOnly = false,
  label,
}: {
  iconOnly?: boolean;
  label: string;
}) {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent(OPEN_COMMAND_PALETTE_EVENT));
  };

  if (iconOnly) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
        className="text-muted-foreground md:hidden"
        aria-label={label}
      >
        <Search className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      className="hidden gap-2 text-muted-foreground md:inline-flex"
    >
      <Search className="h-3.5 w-3.5" />
      <span>{label}</span>
      <kbd className="ml-2 hidden rounded border border-border bg-muted px-1 py-0.5 text-[10px] font-medium lg:inline">
        ⌘K
      </kbd>
    </Button>
  );
}
