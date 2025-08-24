import { getTranslations } from 'next-intl/server';
import Figure from '@/ui/components/Figure';

export default async function Gallery() {
  const t = await getTranslations('Landing.Gallery');
  return (
    <section className='mt-20'>
      <h2 className='text-xl font-semibold md:text-2xl'>{t('title')}</h2>
      <div className='mt-6 grid gap-6 md:grid-cols-3'>
        <Figure src='/images/landing/hero-planner.png' caption={t('cap1')} />
        <Figure src='/images/landing/list-aisles.png' caption={t('cap2')} />
        <Figure src='/images/landing/budget-store.png' caption={t('cap3')} />
      </div>
    </section>
  );
}
