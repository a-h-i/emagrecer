import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDS } from '@/lib/getDS';
import { MealPlan, MealSlot, mealSlotSchema } from '@emagrecer/storage';
import { z } from 'zod';
import { createSlot } from '@emagrecer/control';
import { loadPlanAndVerifyAccess } from '@/lib/plan/api/loadPlanAndVerifyAccess';

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<'/api/plan/[planId]/slots'>,
) {
  const session = await auth();
  const { planId } = await ctx.params;
  const source = await getDS();
  const plan = await loadPlanAndVerifyAccess(session, planId, source);
  if (!(plan instanceof MealPlan)) {
    return plan;
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

export async function POST(
  req: NextRequest,
  ctx: RouteContext<'/api/plan/[planId]/slots'>,
) {
  const session = await auth();
  const { planId } = await ctx.params;
  const source = await getDS();
  const plan = await loadPlanAndVerifyAccess(session, planId, source);
  if (!(plan instanceof MealPlan)) {
    return plan;
  }
  const json = await req.json();
  const parseResult = mealSlotSchema.safeParse(json);
  if (!parseResult.success) {
    return NextResponse.json(
      {
        error: z.treeifyError(parseResult.error),
      },
      { status: 400 },
    );
  }

  const slot = await createSlot(source.manager, parseResult.data, plan);
  const serializedSlot = slot.serialize();
  const recipe = await slot.recipe;
  const serializedData = {
    ...serializedSlot,
    recipe: recipe.serialize(),
  };
  return NextResponse.json(
    {
      slot: serializedData,
    },
    { status: 201 },
  );
}
