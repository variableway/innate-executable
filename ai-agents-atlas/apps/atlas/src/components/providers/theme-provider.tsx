'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

type Props = React.ComponentProps<typeof NextThemesProvider>;

/**
 * Theme provider wrapped from `next-themes`. It must run client-side
 * because it injects a `<script>` to avoid a flash of unstyled content.
 */
export function ThemeProvider({ children, ...props }: Props) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}