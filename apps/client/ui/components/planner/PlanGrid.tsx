'use client';

import { MealType } from '@emagrecer/storage';
import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { selectPlan, setSelectedDay } from '@/lib/redux/plan/plan-slice';
import clsx from 'clsx';
import { Row } from '@/ui/components/planner/PlanGrid/Row';
import PlanGridSkeleton from '@/ui/components/planner/PlanGrid/PlanGridSkeleton';

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
      <div className='relative grid min-w-[760px] grid-cols-[140px_repeat(7,1fr)]'>
        {/* Header Row */}
        <div className='sticky left-0 bg-neutral-50/70 p-3 text-sm font-medium text-neutral-700'>
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
            aria-label={t(`daysShort.${dayIndex}`)}
          >
            {t(`daysShort.${dayIndex}`)}
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
