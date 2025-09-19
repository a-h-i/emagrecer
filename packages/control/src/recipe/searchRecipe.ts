import { EntityManager } from 'typeorm';
import { Recipe } from '@emagrecer/storage';

export type RecipeFilters = {
  query: string;
  tags: string[];
  sort: 'relevance' | 'protein' | 'calories' | 'time'
  sort_direction: 'asc' | 'desc';
}

export async function searchRecipe(manager: EntityManager, filters: RecipeFilters, next_page_token?: string | null) {

  let query = manager.createQueryBuilder()
    .select('recipe')
    .from(Recipe, 'recipe')
  ;
}