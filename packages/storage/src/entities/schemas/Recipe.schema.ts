import { z } from 'zod';
import { recipeTagSchema } from './RecipeTag.schema';
import { ingredientSchema, recipeIngredientSchema } from './Ingredient.schema';

export const recipeSchema = z
  .object({
    id: z.string(),
    title_en: z.string(),
    title_pt: z.string(),
    slug: z.string(),
    servings: z.number().min(1),
    instructions_md_en: z.string().optional().nullish(),
    instructions_md_pt: z.string().optional().nullish(),
    kcal_per_serving: z.number(),
    protein_g_per_serving: z.number(),
    carbs_g_per_serving: z.number(),
    fat_g_per_serving: z.number(),
    estimated_cook_time_s: z.number(),
    created_by_user_id: z.string().optional().nullish(),
    created_at: z.iso.datetime(),
    updated_at: z.iso.datetime(),
  })
  .strict();

export const recipeSchemaWithTags = recipeSchema
  .extend({
    tags: z.array(recipeTagSchema),
  })
  .strict();

export const recipeSchemaWithTagsAndIngredients = recipeSchemaWithTags
  .extend({
    ingredients: z.array(ingredientSchema),
    recipe_ingredients: z.array(recipeIngredientSchema),
  })
  .strict();

export type RecipeSchemaType = z.infer<typeof recipeSchema>;
export type RecipeSchemaTypeWithTags = z.infer<typeof recipeSchemaWithTags>;
export type RecipeSchemaTypeWithTagsAndIngredients = z.infer<
  typeof recipeSchemaWithTagsAndIngredients
>;
