import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDS } from '@/lib/getDS';
import { Recipe } from '@emagrecer/storage';

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
  throw new Error('not implemented');
}
