import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { ButtonLink } from '@/ui/components/Button';

export default async function Hero() {
  const t = await getTranslations('Landing.Hero');
  return (
    <section className='grid items-center gap-8 md:grid-cols-2'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight md:text-5xl'>
          {t('h1')}
        </h1>
        <p className='mt-4 text-neutral-600 md:text-lg'>{t('sub')}</p>
        <div className='mt-6 flex items-center gap-3'>
          <ButtonLink
            href='/plan'
            variant='primary'
            className='rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white shadow hover:opacity-90'
          >
            {t('cta')}
          </ButtonLink>
        </div>
        <p className='mt-4 text-sm text-neutral-500'>{t('stores')}</p>
      </div>
      <div className='relative h-64 w-full md:h-96'>
        <Image
          src='/images/landing/hero-planner.png'
          alt='Weekly planner screenshot'
          fill
          className='rounded-2xl object-cover shadow-lg'
          priority
        />
      </div>
    </section>
  );
}
