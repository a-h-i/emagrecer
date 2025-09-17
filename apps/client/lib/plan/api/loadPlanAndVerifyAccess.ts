import { Session } from 'next-auth';
import { DataSource } from 'typeorm';
import { NextResponse } from 'next/server';
import { MealPlan } from '@emagrecer/storage';

export async function loadPlanAndVerifyAccess(
  session: Session | null,
  planId: string,
  source: DataSource,
) {
  if (session?.user?.id == null) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const plan = await source.manager.findOneBy(MealPlan, { id: planId });
  if (plan == null) {
    return NextResponse.json(
      { error: 'not found' },
      {
        status: 404,
      },
    );
  }
  if (plan.user_id !== session.user.id) {
    return NextResponse.json(
      { error: 'forbidden' },
      {
        status: 403,
      },
    );
  }

  return plan;
}
