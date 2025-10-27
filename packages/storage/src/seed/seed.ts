import { EntityManager } from 'typeorm';
import { createRecipes } from './createRecipes';

export async function seed(manager: EntityManager) {
  await createRecipes(manager);
}
