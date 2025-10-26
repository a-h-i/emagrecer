import { getDS } from '@/lib/getDS';
import { RecipeTag } from '@emagrecer/storage';

export async function GET() {
  const source = await getDS();
  const tags = await source.manager.find(RecipeTag);
  return Response.json(tags.map((tag) => tag.serialize()));
}
