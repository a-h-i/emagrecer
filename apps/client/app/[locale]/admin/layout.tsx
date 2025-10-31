import { ReactNode } from 'react';
import { hasLocale } from 'next-intl';
import { LOCALES, routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import NextLink from 'next/link';

export const dynamicParams = false;

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const t = await getTranslations({ locale, namespace: 'Admin' });
  return (
    <div className='mx-auto max-w-6xl px-4 py-8'>
      <h1 className='mb-6 text-2xl font-semibold'>Admin</h1>
      <nav className='mb-6 flex gap-3 text-sm'>
        <NextLink href='recipes' className='underline'>
          {t('nav.recipes')}
        </NextLink>
        <NextLink href='ingredients' className='underline'>
          {t('nav.ingredients')}
        </NextLink>
      </nav>
      {children}
    </div>
  );
}
