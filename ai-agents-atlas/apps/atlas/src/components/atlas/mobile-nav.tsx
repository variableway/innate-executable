'use client';

import * as React from 'react';
import { Menu, Search, BookOpen, Bot, Briefcase, Blocks, FileText } from 'lucide-react';
import { Button } from '@atlas/ui/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@atlas/ui/components/ui/sheet';
import { cn } from '@/lib/utils';
import { OPEN_COMMAND_PALETTE_EVENT } from './events';

export interface SidebarLink {
  href: string;
  label: string;
}

export interface SidebarGroup {
  label: string;
  icon: string;
  items: SidebarLink[];
}

const iconMap: Record<string, React.ReactNode> = {
  book: <BookOpen className="h-4 w-4" />,
  bot: <Bot className="h-4 w-4" />,
  briefcase: <Briefcase className="h-4 w-4" />,
  blocks: <Blocks className="h-4 w-4" />,
  'file-text': <FileText className="h-4 w-4" />,
};

interface MobileNavProps {
  groups: SidebarGroup[];
  /** Unprefixed path (no /en), matched against unprefixed item hrefs. */
  currentPath: string;
  searchLabel: string;
  menuLabel: string;
}

/**
 * Hamburger menu + search entry for viewports below `md`, where the
 * desktop sidebar and header nav are hidden. Opens a left-side drawer
 * rendering the same grouped navigation as the desktop sidebar.
 */
export function MobileNav({ groups, currentPath, searchLabel, menuLabel }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);

  const openSearch = () => {
    setOpen(false);
    window.dispatchEvent(new CustomEvent(OPEN_COMMAND_PALETTE_EVENT));
  };

  // Item hrefs may carry the /en prefix; currentPath never does.
  const isActive = (href: string) => currentPath === (href.replace(/^\/en/, '') || '/');

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            aria-label={menuLabel}
          />
        }
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-72 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>AI Agents Atlas</SheetTitle>
        </SheetHeader>
        <nav aria-label="Mobile" className="mt-6 space-y-6">
          {groups.map((group) => (
            <div key={group.label}>
              <div className="mb-2 flex items-center justify-between px-3">
                <h3 className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  {iconMap[group.icon]}
                  {group.label}
                </h3>
                <span className="rounded bg-secondary px-1.5 py-0.5 text-xs text-muted-foreground">
                  {group.items.length - 1}
                </span>
              </div>
              <ul className="flex flex-col gap-0.5">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      aria-current={isActive(item.href) ? 'page' : undefined}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'block truncate rounded-lg px-3 py-2 text-sm transition-colors',
                        isActive(item.href)
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                      )}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="mt-6 flex flex-col gap-1 border-t border-border pt-4">
          <button
            type="button"
            onClick={openSearch}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Search className="h-4 w-4" />
            {searchLabel}
          </button>
          <a
            href="https://github.com/ashishpatel26/500-AI-Agents-Projects"
            target="_blank"
            rel="noreferrer"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            GitHub ↗
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
