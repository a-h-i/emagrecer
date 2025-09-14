import { getTranslations } from 'next-intl/server';
import { format, isThisWeek, nextMonday, previousMonday } from 'date-fns';
import { pt as ptLocale } from 'date-fns/locale/pt';
import { enGB as enLocale } from 'date-fns/locale/en-GB';
import clsx from 'clsx';
import { Link } from '@/i18n/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WeekSwitcherProps {
  locale: string;
  currentWeek: Date;
  className?: string;
}


export default async function WeekSwitcher(props: WeekSwitcherProps) {
  const t = await getTranslations({
    locale: props.locale,
    namespace: 'Planner'
  });
  const prev = previousMonday(props.currentWeek);
  const next = nextMonday(props.currentWeek);
  const isCurrentWeek = isThisWeek(props.currentWeek);
  const today = new Date();

  const labelDate = format(props.currentWeek, 'd LLLL yyyy', {
    locale: props.locale == 'pt' ? ptLocale : enLocale
  });
  const btnClass =
    'inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm ' +
    'text-neutral-900 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 ' +
    'focus-visible:ring-neutral-900/40 focus-visible:ring-offset-2';

  return (
    <nav
      aria-label={t('week.label', {date: labelDate})}
      className={clsx('flex items-center gap-3', props.className)}
    >
      <Link
        className={btnClass}
        aria-label={t('week.prev')}
        href={{pathname: '/plan', query: {week: prev.toISOString()}}}
      >
        <ChevronLeft className="h-4 w-4" />
        <span>{t('week.prev')}</span>
      </Link>

      <span className="select-none rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-700">
        {t('week.label', {date: labelDate})}
      </span>

      <Link
        href={{pathname: '/plan', query: {week: next.toISOString()}}}
        className={btnClass}
        aria-label={t('week.next')}
      >
        <span>{t('week.next')}</span>
        <ChevronRight className="h-4 w-4" />
      </Link>


      {isCurrentWeek ? (
        <span
          aria-disabled
          className={clsx(
            'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-neutral-500',
            'cursor-not-allowed'
          )}
          title={t('week.today')}
        >
          {t('week.today')}
        </span>
      ) : (
        <Link
          href={{pathname: '/plan', query: {week: today.toISOString()}}}
          className={btnClass}
        >
          {t('week.today')}
        </Link>
      )}

    </nav>
  )
}