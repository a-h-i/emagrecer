import { defineRouting } from 'next-intl/routing';

export const LOCALES = ['en', 'pt'] as const;
export const DEFAULT_LOCALE = 'pt' as const;

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: LOCALES,

  // Used when no locale matches
  defaultLocale: DEFAULT_LOCALE,
});
