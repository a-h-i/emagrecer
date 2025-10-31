'use server';

import { getSession } from 'next-auth/react';
import { forbidden, unauthorized } from 'next/navigation';
import { getDS } from '@/lib/getDS';
import {
  deleteRecipe,
  ForbiddenError,
  getOrCreateProfile,
} from '@emagrecer/control';

export default async function deleteRecipeAction(recipeId: string) {
  const session = await getSession();
  if (!session || !session.user?.id) {
    return unauthorized();
  }
  const ds = await getDS();
  const profile = await getOrCreateProfile(ds, session.user.id);

  try {
    await deleteRecipe(ds.manager, recipeId, profile.user_id);
  } catch (err) {
    if (err instanceof ForbiddenError) {
      return forbidden();
    } else {
      console.error(err);
      throw err;
    }
  }
}
