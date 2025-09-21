'use client';

import { MealSlotSchemaTypeWithRecipe, MealType } from '@emagrecer/storage';
import { useFormatter, useLocale, useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  clearSlot,
  decrementSlotServings,
  incrementSlotServings,
  selectPlan,
  setSelectedDay,
  SlotKey,
} from '@/lib/redux/plan/plan-slice';
import PlanGridSkeleton from '@/ui/components/planner/PlanGridSkeleton';
import clsx from 'clsx';
import { LOCALES } from '@/i18n/routing';
import { useMemo } from 'react';

interface PlanGridProps {
  onRecipeAdd: (day: number, meal: MealType) => void;
}

const MEALS: MealType[] = [
  MealType.BREAKFAST,
  MealType.LUNCH,
  MealType.DINNER,
  MealType.SNACK,
  MealType.DESSERT,
];

export default function PlanGrid(props: PlanGridProps) {
  const t = useTranslations('Planner');
  const dispatch = useAppDispatch();
  const plan = useAppSelector(selectPlan);

  if (plan.status === 'loading') {
    return <PlanGridSkeleton />;
  }

  return (
    <div className='overflow-x-auto rounded-2xl border border-neutral-200'>
      <div className='grid min-w-[760px] grid-cols-[140px_repeat(7,1fr)]'>
        {/* Header Row */}
        <div className='sticky left-0 z-10 bg-neutral-50/70 p-3 text-sm font-medium text-neutral-700'>
          {/* empty corner cell */}
        </div>
        {Array.from({ length: 7 }, (_, dayIndex) => (
          <button
            key={`header-${dayIndex}`}
            onClick={() => dispatch(setSelectedDay(dayIndex))}
            className={clsx('p-3 text-center text-sm font-medium', {
              'bg-neutral-900 text-white': plan.selectedDay === dayIndex,
              'bg-neutral-50 text-neutral-800 hover:bg-neutral-100':
                plan.selectedDay !== dayIndex,
            })}
            aria-pressed={plan.selectedDay === dayIndex}
            aria-label={t(`dayShort.${dayIndex}`)}
          >
            {t(`dayShort.${dayIndex}`)}
          </button>
        ))}

        {/* Row for each meal type */}
        {MEALS.map((meal) => (
          <Row
            key={meal}
            meal={meal}
            label={t(`meals.${meal}`)}
            selectedDay={plan.selectedDay}
            onRecipeAdd={props.onRecipeAdd}
          />
        ))}
      </div>
    </div>
  );
}

interface RowProps {
  meal: MealType;
  label: string;
  selectedDay: number;
  onRecipeAdd: (day: number, meal: MealType) => void;
}
function Row(props: RowProps) {
  const slotsByKey = useAppSelector((state) => state.plan.slotsByKey);
  const dispatch = useAppDispatch();
  return (
    <>
      {/* sticky meal label */}
      <div className='sticky left-0 z-10 bg-white p-3 text-sm font-medium text-neutral-700'>
        {props.label}
      </div>

      {/* 7 day cells */}
      {Array.from({ length: 7 }, (_, dayIndex) => {
        const slotKey = `${dayIndex}:${props.meal}`;
        const slot =
          slotKey in slotsByKey ? slotsByKey[slotKey as SlotKey] : null;
        const isSelectedDay = props.selectedDay === dayIndex;
        const baseCell =
          'min-h-24 border-t border-neutral-100 p-2 text-sm outline-none';

        return (
          <div
            key={slotKey}
            className={clsx(baseCell, {
              'bg-neutral-50': isSelectedDay,
              'bg-white': !isSelectedDay,
            })}
          >
            {slot == null ? (
              <EmptyCell
                onRecipeAdd={() => props.onRecipeAdd(dayIndex, props.meal)}
              />
            ) : (
              <FilledCell
                slot={slot}
                onInc={() =>
                  dispatch(
                    incrementSlotServings({
                      meal: slot.meal,
                      day: slot.day,
                      increment: 1,
                    }),
                  )
                }
                onDec={() =>
                  dispatch(
                    decrementSlotServings({
                      meal: slot.meal,
                      day: slot.day,
                      decrement: 1,
                    }),
                  )
                }
                onClear={() => dispatch(clearSlot(slot))}
              />
            )}
          </div>
        );
      })}
    </>
  );
}

interface EmptyCellProps {
  onRecipeAdd: () => void;
}
function EmptyCell(props: EmptyCellProps) {
  const t = useTranslations('Planner');

  return (
    <button
      onClick={props.onRecipeAdd}
      className={clsx(
        'flex w-full items-center justify-center rounded-xl border border-dashed border-neutral-300',
        'px-3 py-6 text-neutral-500 hover:border-neutral-400 hover:bg-neutral-50',
      )}
      title={t('slot.empty')}
    >
      <svg
        width='16'
        height='16'
        viewBox='0 0 24 24'
        aria-hidden
        className='mr-2'
      >
        <path
          d='M12 5v14M5 12h14'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
        />
      </svg>
      {t('slot.empty')}
    </button>
  );
}

interface FilledCellProps {
  slot: MealSlotSchemaTypeWithRecipe;
  onClear: () => void;
  onDec: () => void;
  onInc: () => void;
}

function FilledCell(props: FilledCellProps) {
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
