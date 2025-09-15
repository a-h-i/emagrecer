'use client';

import { Button } from '@/ui/components/Button';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

interface ConsentBannerProps {
  open: boolean;
  onClose: () => void;
  onSave: (c: { analytics: boolean }) => void;
}

export default function ConsentBanner(props: ConsentBannerProps) {
  if (!props.open) return null;
  const t = useTranslations('Consent');
  return (
    <div
      role='dialog'
      aria-modal='true'
      aria-labelledby='consent-title'
      className='fixed inset-x-0 bottom-4 z-50 flex justify-center px-4'
    >
      <div className='w-full max-w-3xl rounded-2xl border border-neutral-200 bg-white p-4 shadow-lg md:p-5'>
        <div className='flex items-start gap-4'>
          <div className='flex-1'>
            <h2
              id='consent-title'
              className='text-base font-semibold text-neutral-900'
            >
              {t('title')}
            </h2>
            <p className='mt-1 text-sm text-neutral-600'>
              {t('body')}{' '}
              <Link href='/privacy' className='underline underline-offset-2'>
                {t('learnMore')}
              </Link>
              .
            </p>
          </div>
        </div>

        <div className='mt-4 flex flex-wrap items-center justify-between gap-3'>
          <div className='text-xs text-neutral-500'>{t('note')}</div>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              onClick={() => props.onSave({ analytics: false })}
            >
              {t('reject')}
            </Button>
            <Button
              variant='primary'
              onClick={() => props.onSave({ analytics: true })}
            >
              {t('accept')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
