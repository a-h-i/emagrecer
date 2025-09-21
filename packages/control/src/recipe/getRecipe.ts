import { EntityManager } from 'typeorm';
import { Recipe } from '@emagrecer/storage';

/**
 * Retrieves a recipe by its ID, including its associated tags and ingredients (preloaded).
 *
 * @param {EntityManager} manager - The entity manager used to interact with the database.
 * @param {string} recipeId - The unique identifier of the recipe to retrieve.
 * @return {Promise<Recipe>} A promise that resolves to the requested recipe with its associated data.
 */
export async function getRecipe(
  manager: EntityManager,
  recipeId: string,
): Promise<Recipe> {
  return manager.findOneOrFail(Recipe, {
    where: {
      id: recipeId,
    },
    relations: {
      tags: true,
      ingredients: true,
    },
  });
}
