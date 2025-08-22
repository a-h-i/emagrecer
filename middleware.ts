import createMiddleware from 'next-intl/middleware';
import { LOCALES, routing } from './i18n/routing';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';

const handleI18nRouting = createMiddleware(routing);

const PUBLIC_PATHS = ['/', '/login', '/privacy'];

function stripLocale(pathname: string): { locale: string; path: string } {
  const segments = pathname.split('/', 3);

  if (segments.length >= 2 && LOCALES.includes(segments[1])) {
    const rest = pathname.slice(segments[1].length + 1) || '/';
    return {
      locale: segments[1],
      path: rest.startsWith('/') ? rest : `/${rest}`,
    };
  }
  return { locale: 'pt', path: pathname };
}

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // first we need to test if we need to handle internationalization on this route
  const isApi = pathname.startsWith('/api/');
  const isAuthApi = pathname.startsWith('/api/auth');
  const isMetadataImage =
    pathname.endsWith('/opengraph-image') ||
    pathname.endsWith('/twitter-image') ||
    pathname.endsWith('/icon') ||
    pathname.endsWith('/apple-icon');
  // Files ending with an extension (robots.txt, sitemap.xml, images, etc.)
  const hasExtension = /\.[a-z0-9]+$/i.test(pathname);

  // Only pages (no API, no metadata images, no files) should pass through intl
  const shouldRunIntl = !isApi && !isMetadataImage && !hasExtension;
  const intlResponse = shouldRunIntl
    ? handleI18nRouting(req)
    : NextResponse.next();

  // page protection
  if (!isApi) {
    const { locale, path: strippedPath } = stripLocale(pathname);
    const isPublic = PUBLIC_PATHS.includes(strippedPath);
    if (!isPublic && !req.auth) {
      const url = new URL(`${locale}/login`, req.nextUrl);
      url.searchParams.set('callbackUrl', req.nextUrl.href);
      return NextResponse.redirect(url);
    }
  }
  if (isApi && !isAuthApi) {
    return NextResponse.next();
  }
  return intlResponse;
});

// Matcher rules:
//  - Pages: everything except Next internals, files, metadata image routes, AND not /api
//  - API: every /api/* EXCEPT /api/auth/* (Auth.js callback endpoints must bypass middleware)
export const config = {
  matcher: [
    // Pages (locale-aware)
    '/((?!_next|.*\\..*|opengraph-image|twitter-image|icon|apple-icon|api).*)',
    // API (but not /api/auth)
    '/api/(!auth)(.*)',
  ],
};
