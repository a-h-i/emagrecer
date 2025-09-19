import { z } from 'zod';
import { RecipeSort, searchRecipe } from '@emagrecer/control';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDS } from '@/lib/getDS';


const querySchema = z.object({
  query: z.string().min(1),
  tags: z.array(z.string()).optional(),
  sort: z.enum(RecipeSort),
  sort_direction: z.enum(['asc', 'desc']),
  next_page_token: z.string().optional().nullish(),
});

/**
 * Recipe search endpoint
 *
 */
export async function GET(req: NextRequest) {
  const session = await auth();
  if (session?.user?.id == null) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const filters = querySchema.safeParse({
    query: req.nextUrl.searchParams.get('query'),
    tags: req.nextUrl.searchParams.getAll('tags'),
    sort: req.nextUrl.searchParams.get('sort'),
    sort_direction: req.nextUrl.searchParams.get('sort_direction'),
    next_page_token: req.nextUrl.searchParams.get('next_page_token'),
  });
  if (!filters.success) {
    return NextResponse.json({ error: z.treeifyError(filters.error) }, { status: 400 });
  }
  const source = await getDS();
  const searchResult = await searchRecipe(source.manager, filters.data, filters.data.next_page_token);

  return NextResponse.json(searchResult);

}