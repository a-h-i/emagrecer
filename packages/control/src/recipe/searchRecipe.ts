import { EntityManager } from 'typeorm';
import { Recipe, RecipeSchemaTypeWithTags } from '@emagrecer/storage';

export enum RecipeSort {
  RELEVANCE = 'relevance',
  PROTEIN = 'protein',
  CALORIES = 'calories',
  TIME = 'time',
}

export type RecipeFilters = {
  query: string;
  tags?: string[];
  sort: RecipeSort;
  sort_direction: 'asc' | 'desc';
}

interface RecipeSearchResults {
  recipes: RecipeSchemaTypeWithTags[];
  next_page_token?: string;
}

export async function searchRecipe(manager: EntityManager, filters: RecipeFilters, next_page_token?: string | null): Promise<RecipeSearchResults> {

  let query = manager.createQueryBuilder()
    .select('recipe')
    .from(Recipe, 'recipe')
  ;
  throw new Error('Not implemented');
}