'use client';

import { useAppDispatch } from '@/lib/redux/hooks';
import { ensurePlan, loadSlots, selectPlan } from '@/lib/redux/plan/plan-slice';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import MacroSummary from '@/ui/components/planner/MacroSummary';

interface PlanContentProps {
  weekStart: Date;
}

export default function PlanContent(props: PlanContentProps) {
  const dispatch = useAppDispatch();
  const { planId, selectedDay } = useSelector(selectPlan);

  useEffect(() => {
    (async () => {
      const res = await dispatch(ensurePlan(props.weekStart));
      if (res.payload?.id) {
        await dispatch(loadSlots(res.payload.id));
      }
    })();
  }, [dispatch, props.weekStart]);

  return (
    <div className='grid gap-6 lg:grid-cols-[1fr_340px]'>
      <div className='space-y-4'>
        <MacroSummary />
        {/*<PlanGrid />*/}
      </div>
      <aside className='h-fit lg:sticky lg:top-6'>
        {/*<RecipePanel />*/}
      </aside>
    </div>
  );
}
