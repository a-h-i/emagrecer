import { EntityManager } from 'typeorm';
import { Recipe } from '@emagrecer/storage';

export async function getRecipe(manager: EntityManager, recipeId: string) {
  return manager.findOneOrFail(Recipe, {
    where: {
      id: recipeId,
    },
    relations: {
      tags: true,
    },
  });
}
