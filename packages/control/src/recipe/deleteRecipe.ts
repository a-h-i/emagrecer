import { EntityManager } from 'typeorm';
import { ProfileRole, Recipe } from '@emagrecer/storage';
import { ForbiddenError } from '../errors';

export async function deleteRecipe(
  manager: EntityManager,
  recipeId: string,
  userId: string,
) {
  const isAdmin = await manager.findOneBy(ProfileRole, {
    user_id: userId,
    is_admin: true,
  });
  if (!isAdmin) {
    throw new ForbiddenError('User is not an admin');
  }
  await manager.delete(Recipe, recipeId);
}
