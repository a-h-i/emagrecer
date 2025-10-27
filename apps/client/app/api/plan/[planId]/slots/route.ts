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
import { createSlot, ForbiddenError, getPlanSlots } from '@emagrecer/control';
import { loadPlanAndVerifyAccess } from '@/lib/plan/api/loadPlanAndVerifyAccess';
import { EntityNotFoundError } from 'typeorm';

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

  const slots: MealSlotSchemaTypeWithRecipe[] = await getPlanSlots(
    source.manager,
    plan.id,
  );

  return NextResponse.json({
    slots,
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  if (userId == null) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const source = await getDS();
  const data = await req.json();
  const parseResult = mealSlotCreateSchema.safeParse(data);
  if (!parseResult.success) {
    return NextResponse.json(
      {
        error: z.treeifyError(parseResult.error),
      },
      { status: 400 },
    );
  }
  try {
    const slot = await source.manager.transaction(async (transaction) => {
      const slot = await createSlot(transaction, parseResult.data, userId);
      const serializedSlot = slot.serialize();
      const recipe = await transaction.findOneOrFail(Recipe, {
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
        recipe_ingredients: (await recipe.recipe_ingredients).map(
          (recipeIngredient) => recipeIngredient.serialize(),
        ),
      };
      const serializedData: MealSlotSchemaTypeWithRecipe = {
        ...serializedSlot,
        recipe: serializedRecipe,
      };
      return serializedData;
    });
    return NextResponse.json(
      {
        slot,
      },
      {
        status: 201,
      },
    );
  } catch (err) {
    if (err instanceof ForbiddenError) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }
    if (err instanceof EntityNotFoundError) {
      return NextResponse.json({ error: 'not found' }, { status: 404 });
    }
    console.error(err);
    return NextResponse.json({ error: 'unknown error' }, { status: 500 });
  }
}
