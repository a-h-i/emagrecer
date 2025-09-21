import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDS } from '@/lib/getDS';
import {
  MealPlan,
  mealSlotCreateSchema,
  MealSlotSchemaTypeWithRecipe,
  Recipe,
} from '@emagrecer/storage';
import { z } from 'zod';
import { createSlot, getPlanSlots } from '@emagrecer/control';
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

  const slots: MealSlotSchemaTypeWithRecipe[] = await getPlanSlots(source.manager, plan.id);

  return NextResponse.json({
    slots,
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
  const parseResult = mealSlotCreateSchema.safeParse(json);
  if (!parseResult.success) {
    return NextResponse.json(
      {
        error: z.treeifyError(parseResult.error),
      },
      { status: 400 },
    );
  }

  const slot = await createSlot(source.manager, parseResult.data);
  const serializedSlot = slot.serialize();
  const recipe = await source.manager.findOneOrFail(Recipe, {
    where: {
      id: slot.recipe_id,
    },
    relations: {
      tags: true,
      ingredients: true,
    },
  });
  const serializedRecipe = {
    ...recipe.serialize(),
    ingredients: (await recipe.ingredients).map((ingredient) =>
      ingredient.serialize(),
    ),
    tags: (await recipe.tags).map((tag) => tag.serialize()),
    recipe_ingredients: (await recipe.recipe_ingredients).map((recipeIngredient) =>
      recipeIngredient.serialize(),
    ),
  };
  const serializedData: MealSlotSchemaTypeWithRecipe = {
    ...serializedSlot,
    recipe: serializedRecipe,
  };
  return NextResponse.json(
    {
      slot: serializedData,
    },
    { status: 201 },
  );
}
