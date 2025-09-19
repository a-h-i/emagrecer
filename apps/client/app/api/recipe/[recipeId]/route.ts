import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDS } from '@/lib/getDS';
import { getRecipe } from '@emagrecer/control';
import { EntityNotFoundError } from 'typeorm';
import { RecipeSchemaTypeWithTags } from '@emagrecer/storage';

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
    const tags = await recipe.tags;
    const serializedRecipe: RecipeSchemaTypeWithTags = {
      ...recipe.serialize(),
      tags: tags.map((tag) => tag.serialize()),
    }
    return NextResponse.json({
      recipe: serializedRecipe,
    });
  } catch (err) {
    if (err instanceof  EntityNotFoundError) {
      return NextResponse.json({error: 'not found'}, {status: 404})
    } else {
      console.error(err);
      return NextResponse.json({error: 'unknown error'}, {status: 500});
    }
  }
}
