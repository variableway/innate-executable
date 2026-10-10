'use client';

import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useAtlasStore, useHydrated } from '@/lib/store';
import { Button } from '@atlas/ui/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Compact favorite toggle for card lists. The lesson page has the
 * full LessonActions group; this is for index cards.
 */
export function FavoriteButton({ slug, label = 'Favorite' }: { slug: string; label?: string }) {
  const hydrated = useHydrated();
  const fav = useAtlasStore((s) => s.favorites.includes(slug));
  const toggle = useAtlasStore((s) => s.toggleFavorite);

  return (
    <Button
      variant="ghost"
      size="icon"
      disabled={!hydrated}
      aria-label={label}
      aria-pressed={fav}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
        toast.success(fav ? 'Removed from favorites' : 'Saved to favorites');
      }}
      className={cn('h-8 w-8', fav && 'text-rose-500 hover:text-rose-600')}
    >
      <Heart className={cn('h-4 w-4', fav && 'fill-current')} />
    </Button>
  );
}