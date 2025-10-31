import { getTranslations } from 'next-intl/server';
import { LOCALES } from '@/i18n/routing';

export const dynamicParams = false;

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Admin' });
  return <h1 className='text-xl'>{t('title')}</h1>;
}
