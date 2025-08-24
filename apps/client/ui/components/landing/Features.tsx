import { getTranslations } from 'next-intl/server';

export default async function Features() {
  const t = await getTranslations('Landing.Features');

  return (
    <section className='mt-20'>
      <h2 className='text-xl font-semibold md:text-2xl'>{t('title')}</h2>
      <ul className='mt-6 grid list-disc gap-3 pl-5 md:grid-cols-2'>
        <li>{t('f1')}</li>
        <li>{t('f2')}</li>
        <li>{t('f3')}</li>
        <li>{t('f4')}</li>
        <li>{t('f5')}</li>
        <li>{t('f6')}</li>
      </ul>
    </section>
  );
}
