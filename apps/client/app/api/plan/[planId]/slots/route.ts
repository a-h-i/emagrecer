import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDS } from '@/lib/getDS';
import { MealPlan, MealSlot } from '@emagrecer/storage';

export async function GET(
  req: NextRequest,
  ctx: RouteContext<'/api/plan/[planId]/slots'>,
) {
  const session = await auth();
  if (session?.user?.id == null) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const { planId } = await ctx.params;

  const source = await getDS();
  const plan = await source.manager.findOneBy(MealPlan, { id: planId });
  if (plan == null) {
    return NextResponse.json({ error: 'not found', status: 404 });
  }
  if (plan.user_id !== session.user.id) {
    return NextResponse.json({ error: 'forbidden', status: 403 });
  }

  const slots = await source.manager.find(MealSlot, {
    where: {
      plan_id: plan.id,
    },
    relations: {
      recipe: true,
    },
  });

  const serializedSlotsPromises = slots.map(async (slot) => {
    const serializedSlot = slot.serialize();
    const recipe = await slot.recipe;
    return {
      ...serializedSlot,
      recipe: recipe.serialize(),
    };
  });

  return NextResponse.json({
    slots: await Promise.all(serializedSlotsPromises),
  });
}
