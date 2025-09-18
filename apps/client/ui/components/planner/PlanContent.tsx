'use client';

import { useAppDispatch } from '@/lib/redux/hooks';
import { ensurePlan, loadSlots } from '@/lib/redux/plan/plan-slice';
import { useEffect } from 'react';
import MacroSummary from '@/ui/components/planner/MacroSummary';
import PlanGrid from '@/ui/components/planner/PlanGrid';

interface PlanContentProps {
  weekStart: Date;
}

export default function PlanContent(props: PlanContentProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      const action = await dispatch(ensurePlan(props.weekStart));
      if (action.payload.plan.id) {
        await dispatch(loadSlots(action.payload.plan.id));
      }
    })();
  }, [dispatch, props.weekStart]);

  return (
    <div className='grid gap-6 lg:grid-cols-[1fr_340px]'>
      <div className='space-y-4'>
        <MacroSummary />
        <PlanGrid onRecipeAdd={() => true}/>
      </div>
      <aside className='h-fit lg:sticky lg:top-6'>{/*<RecipePanel />*/}</aside>
    </div>
  );
}
