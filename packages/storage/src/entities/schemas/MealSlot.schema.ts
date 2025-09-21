import { z } from 'zod';
import { MealType } from '../MealType';
import { recipeSchemaWithTagsAndIngredients } from './Recipe.schema';

export const mealSlotCreateSchema = z
  .object({
    plan_id: z.string(),
    day: z.number().min(0).max(6),
    meal: z.enum(MealType),
    recipe_id: z.string(),
    servings: z.number().min(1),
  })
  .strict();

export const mealSlotSchema = mealSlotCreateSchema
  .extend({
    id: z.string(),
    created_at: z.iso.datetime(),
    updated_at: z.iso.datetime(),
  })
  .strict();

export const mealSlotSchemaWithRecipe = mealSlotSchema.extend({
  recipe: recipeSchemaWithTagsAndIngredients,
});

export type MealSlotCreateSchemaType = z.infer<typeof mealSlotCreateSchema>;
export type MealSlotSchemaType = z.infer<typeof mealSlotSchema>;
export type MealSlotSchemaTypeWithRecipe = z.infer<
  typeof mealSlotSchemaWithRecipe
>;
