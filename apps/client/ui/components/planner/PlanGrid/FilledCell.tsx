import { MealSlotSchemaTypeWithRecipe } from '@emagrecer/storage';
import { useFormatter, useLocale, useTranslations } from 'next-intl';
import { LOCALES } from '@/i18n/routing';
import { useMemo } from 'react';
import { CellSkeleton } from '@/ui/components/planner/PlanGrid/CellSkeleton';

interface FilledCellProps {
  slot: MealSlotSchemaTypeWithRecipe;
  onClear: () => void;
  onDec: () => void;
  onInc: () => void;
  isLoading?: boolean;
}

export function FilledCell(props: FilledCellProps) {
  const locale = useLocale() as (typeof LOCALES)[number];
  const title =
    locale === 'pt' ? props.slot.recipe.title_pt : props.slot.recipe.title_en;
  const format = useFormatter();
  const t = useTranslations('Planner');
  const kcal = useMemo(() => {
    return format.number(props.slot.recipe.kcal_per_serving, {
      style: 'decimal',
      maximumFractionDigits: 2,
    });
  }, [format, props.slot.recipe.kcal_per_serving]);
  const totalKCals = useMemo(() => {
    return format.number(
      Math.round(props.slot.recipe.kcal_per_serving * props.slot.servings),
      { style: 'decimal', maximumFractionDigits: 2 },
    );
  }, [format, props.slot.recipe.kcal_per_serving, props.slot.servings]);
  const formattedServings = useMemo(() => {
    return format.number(props.slot.servings, {
      style: 'decimal',
      maximumFractionDigits: 2,
    });
  }, [format, props.slot.servings]);
  if (props.isLoading) {
    return <CellSkeleton />;
  }
  return (
    <div className='flex h-full flex-col rounded-xl border border-neutral-200 p-2'>
      <div className='flex items-start justify-between gap-2'>
        <div className='min-w-0'>
          <p className='truncate text-sm font-medium text-neutral-900'>
            {title}
          </p>
          <p className='mt-0.5 text-xs text-neutral-500'>
            ≈{kcal} {t('summary.kcalUnit')} / {t('summary.serving')}
          </p>
        </div>
        <button
          onClick={props.onClear}
          className='rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700'
          aria-label='Clear slot'
          title='Clear'
        >
          <svg width='16' height='16' viewBox='0 0 24 24' aria-hidden>
            <path
              d='M6 6l12 12M18 6L6 18'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
            />
          </svg>
        </button>
      </div>

      <div className='mt-2 flex items-center justify-between'>
        <div className='inline-flex items-center gap-1 rounded-lg border border-neutral-200'>
          <button
            onClick={props.onDec}
            className='px-2 py-1 text-neutral-700 hover:bg-neutral-100'
            aria-label='Decrease servings'
            title='–'
          >
            –
          </button>
          <span className='px-2 text-sm tabular-nums'>
            {formattedServings} {t('slot.servings')} ×
          </span>
          <button
            onClick={props.onInc}
            className='px-2 py-1 text-neutral-700 hover:bg-neutral-100'
            aria-label='Increase servings'
            title='+'
          >
            +
          </button>
        </div>

        <span className='text-xs text-neutral-500'>
          ≈ {totalKCals} {t('summary.kcalUnit')}
        </span>
      </div>
    </div>
  );
}
