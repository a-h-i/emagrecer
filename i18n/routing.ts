import { defineRouting } from 'next-intl/routing';

export const LOCALES = ['en', 'pt'];



export const routing = defineRouting({
  // A list of all locales that are supported
  locales: LOCALES,

  // Used when no locale matches
  defaultLocale: 'en',
});
