import { getDS } from '@/lib/getDS';
import { getRecipe } from '@emagrecer/control';
import { notFound } from 'next/navigation';


export default async function Page({params}: {
  params: Promise<{ locale: string, recipeId: string }>;
}) {

  const { locale, recipeId } = await params;

  const source = await getDS();
  const recipe = await getRecipe(source.manager, recipeId).catch(() => notFound());

}