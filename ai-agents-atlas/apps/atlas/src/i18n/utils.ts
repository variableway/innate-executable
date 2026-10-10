import { defaultLocale, locales, type Locale } from './ui';

/**
 * Prefix an internal href for the given locale. The default locale
 * (zh) is unprefixed; every other locale gets `/<locale>` in front.
 * Anchor-only hrefs (e.g. `/frameworks#crewai`) are preserved.
 */
export function localePath(locale: Locale, href: string): string {
  if (locale === defaultLocale) return href;
  return `/en${href === '/' ? '' : href}`;
}

/** True when the pathname belongs to the English (/en) tree. */
export function isLocalePath(pathname: string, locale: Locale): boolean {
  return pathname === `/${locale}` || pathname.startsWith(`/${locale}/`);
}

/**
 * The URL of the current page in the *other* language — used by the
 * header language switcher. `/en/lessons` ↔ `/lessons`.
 */
export function otherLocalePath(pathname: string): string {
  for (const locale of locales) {
    if (locale === defaultLocale) continue;
    if (isLocalePath(pathname, locale)) {
      const stripped = pathname.slice(locale.length + 1);
      return stripped === '' ? '/' : stripped;
    }
  }
  return pathname === '/' ? '/en' : `/en${pathname}`;
}

/** The locale a pathname belongs to. */
export function localeFromPath(pathname: string): Locale {
  for (const locale of locales) {
    if (locale === defaultLocale) continue;
    if (isLocalePath(pathname, locale)) return locale;
  }
  return defaultLocale;
}
