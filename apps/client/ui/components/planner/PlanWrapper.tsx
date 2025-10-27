'use client';

import { makeStore } from '@/lib/redux/store';
import { Provider } from 'react-redux';
import PlanContent from '@/ui/components/planner/PlanContent';

interface PlanWrapperProps {
  weekStart: Date;
}

export default function PlanWrapper(props: PlanWrapperProps) {
  const store = makeStore();
  return (
    <Provider store={store}>
      <PlanContent weekStart={props.weekStart} />
    </Provider>
  );
}
