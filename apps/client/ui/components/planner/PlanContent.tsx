'use client';

import { useAppDispatch } from '@/lib/redux/hooks';
import { ensurePlan, setSelectedDay } from '@/lib/redux/plan/plan-slice';
import { useEffect } from 'react';
import MacroSummary from '@/ui/components/planner/MacroSummary';
import PlanGrid from '@/ui/components/planner/PlanGrid';
import RecipePanel from '@/ui/components/planner/RecipePanel';

interface PlanContentProps {
  weekStart: Date;
}

export default function PlanContent(props: PlanContentProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(ensurePlan(props.weekStart));
    const now = new Date();
    let dayOfWeek = now.getDay();
    // Our week starts on monday, so we need to subtract 1 to get the correct day of the week
    dayOfWeek = dayOfWeek - 1;
    if (dayOfWeek < 0) {
      dayOfWeek = 6;
    }
    dispatch(setSelectedDay(dayOfWeek))
  }, [dispatch, props.weekStart]);

  return (
    <div className='grid gap-6 lg:grid-cols-[1fr_340px]'>
      <div className='space-y-4'>
        <MacroSummary />
        <PlanGrid onRecipeAdd={() => true} />
      </div>
      <aside className='h-fit lg:sticky lg:top-6'>
        <RecipePanel />
      </aside>
    </div>
  );
}
