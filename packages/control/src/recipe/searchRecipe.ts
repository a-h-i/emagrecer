import { EntityManager } from 'typeorm';
import { Recipe, recipeSchemaWithTagsAndIngredients } from '@emagrecer/storage';
import { z } from 'zod';
import { InvalidPageTokenError } from '../errors';

export enum RecipeSort {
  PROTEIN = 'protein',
  CALORIES = 'calories',
  FAT = 'fat',
  CARBS = 'carbs',
  TIME = 'time',
  RELEVANCE = 'relevance',
}

export type RecipeFilters = {
  query: string;
  tags?: string[];
  sort: RecipeSort;
  sort_direction: 'ASC' | 'DESC';
  locale: 'en' | 'pt';
};

export const recipeSearchResultsSchema = z
  .object({
    recipes: z.array(recipeSchemaWithTagsAndIngredients),
    next_page_token: z.string().optional(),
  })
  .strict();

export type RecipeSearchResults = z.infer<typeof recipeSearchResultsSchema>;

const nextPageTokenSchema = z
  .object({
    sort: z.enum(RecipeSort),
    sort_direction: z.enum(['ASC', 'DESC']),
    last_value: z.string(),
    last_id: z.string(),
  })
  .strict();

type NextPageToken = z.infer<typeof nextPageTokenSchema>;

function serializeNextPageToken(token: NextPageToken): string {
  const json = JSON.stringify(token);
  const buffer = Buffer.from(json, 'utf-8');
  return buffer.toString('base64url');
}

function deserializeNextPageToken(token: string): NextPageToken {
  const buffer = Buffer.from(token, 'base64url');
  const json = buffer.toString('utf-8');
  const parsed = JSON.parse(json);
  const validated = nextPageTokenSchema.safeParse(parsed);
  if (!validated.success) {
    throw new InvalidPageTokenError(
      JSON.stringify(z.treeifyError(validated.error)),
    );
  }
  return validated.data;
}

export async function searchRecipe(
  manager: EntityManager,
  filters: RecipeFilters,
  pageSize: number,
  next_page_token?: string | null,
): Promise<RecipeSearchResults> {
  let query = manager
    .createQueryBuilder()
    .select('recipe')
    .from(Recipe, 'recipe')
    .leftJoinAndSelect('recipe.tags', 'tags')
    .leftJoinAndSelect('recipe.recipe_ingredients', 'recipe_ingredients')
    .leftJoinAndSelect('recipe_ingredients.ingredient', 'ingredient');

  if (filters.tags && filters.tags.length > 0) {
    query = query.andWhere('tags.slug IN (:...tags)', { tags: filters.tags });
  }
  const parsedToken =
    next_page_token != null
      ? deserializeNextPageToken(next_page_token)
      : undefined;
  if (parsedToken != null && parsedToken.sort != filters.sort) {
    throw new InvalidPageTokenError('Invalid sort');
  }
  let lastValueColumn: string;
  const languageConfig = filters.locale === 'en' ? 'english' : 'portuguese';
  const textSearchColumn =
    filters.locale === 'en' ? 'text_searchable_en' : 'text_searchable_pt';
  switch (filters.sort) {
    case RecipeSort.PROTEIN:
      lastValueColumn = 'protein_g_per_serving';
      query = query
        .orderBy('recipe.protein_g_per_serving', filters.sort_direction)
        .addOrderBy('recipe.id', filters.sort_direction);
      break;
    case RecipeSort.CALORIES:
      lastValueColumn = 'kcal_per_serving';
      query = query
        .orderBy('recipe.kcal_per_serving', filters.sort_direction)
        .addOrderBy('recipe.id', filters.sort_direction);
      break;
    case RecipeSort.FAT:
      lastValueColumn = 'fat_g_per_serving';
      query = query
        .orderBy('recipe.fat_g_per_serving', filters.sort_direction)
        .addOrderBy('recipe.id', filters.sort_direction);
      break;
    case RecipeSort.CARBS:
      lastValueColumn = 'carbs_g_per_serving';
      query = query
        .orderBy('recipe.carbs_g_per_serving', filters.sort_direction)
        .addOrderBy('recipe.id', filters.sort_direction);
      break;
    case RecipeSort.TIME:
      lastValueColumn = 'estimated_cook_time_s';
      query = query
        .orderBy('recipe.estimated_cook_time_s', filters.sort_direction)
        .addOrderBy('recipe.id', filters.sort_direction);
      break;
    case RecipeSort.RELEVANCE:
      if (filters.query.trim().length === 0) {
        throw new Error('Query must not be empty when sorting by relevance');
      }
      lastValueColumn = 'rank';
      query.addSelect(
        `ts_rank(${textSearchColumn}, plainto_tsquery(:language_config, :query), 8) as rank`,
      );
      query = query
        .orderBy(`rank`, filters.sort_direction)
        .addOrderBy('recipe.id', filters.sort_direction);
      break;
  }
  if (filters.query.trim().length > 0) {
    query = query.andWhere(
      `${textSearchColumn} @@ plainto_tsquery(:language_config, :query)`,
    );
    query = query
      .setParameter('language_config', languageConfig)
      .setParameter('query', filters.query);
  }
  if (parsedToken != null) {
    const operator = parsedToken.sort_direction === 'ASC' ? '>' : '<';
    query = query.andWhere(
      `(${lastValueColumn}, recipe.id) ${operator} (:last_value, :last_id)`,
      {
        last_value: parsedToken.last_value,
        last_id: parsedToken.last_id,
      },
    );
  }
  query = query.limit(pageSize + 1);
  const queryResults = await query.getRawAndEntities();
  const recipesPage = queryResults.entities.slice(0, pageSize);
  let nextPageToken: NextPageToken | null = null;
  if (queryResults.entities.length > pageSize) {
    const lastValueColumnNameMapped =
      lastValueColumn === 'rank' ? 'rank' : `recipe_${lastValueColumn}`;
    const lastEntity = queryResults.raw[pageSize - 1];
    if (lastValueColumnNameMapped in lastEntity) {
      nextPageToken = {
        sort: filters.sort,
        sort_direction: filters.sort_direction,
        last_value: queryResults.raw[pageSize - 1][
          lastValueColumnNameMapped
        ] as string,
        last_id: queryResults.entities[pageSize - 1].id,
      };
    } else {
      throw new InvalidPageTokenError(
        `Invalid last_value: unable to map ${lastValueColumn}`,
      );
    }
  }
  // all sub-promises are already resolved due to prefetching in the query builder
  const serializedRecipesPromises = recipesPage.map(async (recipe) => {
    const serializedRecipe = (recipe as Recipe).serialize();
    const tags = await recipe.tags;
    const recipe_ingredients = await recipe.recipe_ingredients;
    const ingredients = await recipe.ingredients;
    return {
      ...serializedRecipe,
      tags: tags.map((tag) => tag.serialize()),
      ingredients: ingredients.map((ingredient) => ingredient.serialize()),
      recipe_ingredients: recipe_ingredients.map((recipe_ingredient) =>
        recipe_ingredient.serialize(),
      ),
    };
  });
  return {
    recipes: await Promise.all(serializedRecipesPromises),
    next_page_token:
      nextPageToken != null ? serializeNextPageToken(nextPageToken) : undefined,
  };
}
