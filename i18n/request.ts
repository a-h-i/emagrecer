
import {getRequestConfig} from 'next-intl/server';

const DEFAULT_LOCALE = 'pt' as const;

const NAMESPACES = ['landing', 'metadata'] as const;

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

export default getRequestConfig(async ({locale}) => {
  const l = locale ?? DEFAULT_LOCALE;

  const parts = await Promise.all(
    NAMESPACES.map((ns) => loadNamespace(l, ns))
  );

  // Merge all subtrees into a single messages object
  const messages = Object.assign({}, ...parts);

  return {locale: l, messages};
});


