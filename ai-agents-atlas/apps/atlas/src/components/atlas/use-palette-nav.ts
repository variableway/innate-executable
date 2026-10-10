'use client';

import * as React from 'react';

/**
 * Keyboard navigation for hand-rolled command palettes (⌘K overlay and
 * Pagefind search). Manages the active option index, Arrow/Home/End/Enter
 * handling, `aria-activedescendant` wiring, and scroll-into-view.
 * Replaces the behaviour we previously got from cmdk.
 */
export function usePaletteNav<T>(
  options: T[],
  { onSelect, listId }: { onSelect: (option: T) => void; listId: string },
) {
  const [activeIndex, setActiveIndex] = React.useState(0);

  // Reset highlight whenever the option set changes (new query, new results).
  React.useEffect(() => setActiveIndex(0), [options]);

  React.useEffect(() => {
    if (activeIndex < 0) return;
    document
      .getElementById(`${listId}-option-${activeIndex}`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, listId]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (options.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % options.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + options.length) % options.length);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveIndex(options.length - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const option = options[activeIndex];
      if (option) onSelect(option);
    }
  };

  const inputProps = {
    role: 'combobox' as const,
    'aria-expanded': true,
    'aria-controls': listId,
    'aria-activedescendant':
      options.length > 0 && activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined,
    onKeyDown,
  };

  const listProps = { role: 'listbox' as const, id: listId };

  const optionProps = (index: number) => ({
    role: 'option' as const,
    id: `${listId}-option-${index}`,
    'aria-selected': index === activeIndex,
    onMouseMove: () => setActiveIndex(index),
  });

  return { activeIndex, inputProps, listProps, optionProps };
}
