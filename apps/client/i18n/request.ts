import { getRequestConfig } from 'next-intl/server';
import { DEFAULT_LOCALE, routing } from '@/i18n/routing';
import { hasLocale } from 'next-intl';

const NAMESPACES = ['landing', 'metadata', 'auth'] as const;

async function loadNamespace(locale: string, ns: string) {
  try {
    // Statically analyzable import => bundled by Next
    const mod = await import(`../messages/${locale}/${ns}.json`);
    return mod.default;
  } catch {
    if (locale !== DEFAULT_LOCALE) {
      const fallback = await import(`../messages/${DEFAULT_LOCALE}/${ns}.json`);
      return fallback.default;
    }
    return {};
  }
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const parts = await Promise.all(
    NAMESPACES.map((ns) => loadNamespace(locale, ns)),
  );

  // Merge all subtrees into a single messages object
  const messages = Object.assign({}, ...parts);

  return { locale: locale, messages };
});
