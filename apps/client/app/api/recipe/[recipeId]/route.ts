import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDS } from '@/lib/getDS';
import { getRecipe } from '@emagrecer/control';
import { EntityNotFoundError } from 'typeorm';
import { RecipeSchemaTypeWithTagsAndIngredients } from '@emagrecer/storage';

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<'/api/recipe/[recipeId]'>,
) {
  const session = await auth();
  if (session?.user?.id == null) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const { recipeId } = await ctx.params;
  const source = await getDS();
  try {
    const recipe = await getRecipe(source.manager, recipeId);
    // Relations are preloaded.
    const tags = await recipe.tags;
    const ingredients = await recipe.ingredients;
    const recipeIngredients = await recipe.recipe_ingredients;
    const serializedRecipe: RecipeSchemaTypeWithTagsAndIngredients = {
      ...recipe.serialize(),
      tags: tags.map((tag) => tag.serialize()),
      ingredients: ingredients.map((ingredient) => ingredient.serialize()),
      recipe_ingredients: recipeIngredients.map((recipeIngredient) =>
        recipeIngredient.serialize(),
      ),
    };
    return NextResponse.json({
      recipe: serializedRecipe,
    });
  } catch (err) {
    if (err instanceof EntityNotFoundError) {
      return NextResponse.json({ error: 'not found' }, { status: 404 });
    } else {
      console.error(err);
      return NextResponse.json({ error: 'unknown error' }, { status: 500 });
    }
  }
}
