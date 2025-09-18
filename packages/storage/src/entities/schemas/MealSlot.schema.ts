import { z } from 'zod';
import { MealType } from '../MealType';
import { recipeSchema } from './Recipe.schema';

export const mealSlotSchema = z
  .object({
    id: z.string(),
    plan_id: z.string(),
    day: z.number().min(0).max(6),
    meal: z.enum(MealType),
    recipe_id: z.string(),
    servings: z.string(),
    created_at: z.iso.datetime(),
    updated_at: z.iso.datetime(),
  })
  .strict();

export const mealSlotSchemaWithRecipe = mealSlotSchema.extend({
  recipe: recipeSchema,
});

export type MealSlotSchemaType = z.infer<typeof mealSlotSchema>;
export type MealSlotSchemaTypeWithRecipe = z.infer<
  typeof mealSlotSchemaWithRecipe
>;
