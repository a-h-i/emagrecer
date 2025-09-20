import { z } from 'zod';
import { UnitEnum } from '../UnitEnum';
import { nutritionInfoSchema } from './NutritionInfo.schema';
import { Allergens } from '../Allergens';


export const ingredientSchema = z.object({
  id: z.string(),
  name_en: z.string(),
  name_pt: z.string(),
  aisle_slug: z.string(),
  unit_base: z.enum(UnitEnum),
  density_g_per_ml: z.string().optional().nullish(),
  nutrition_per_100g: nutritionInfoSchema,
  allergens: z.array(z.enum(Allergens)),
  is_active: z.boolean(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
}).strict();

export type IngredientSchemaType = z.infer<typeof ingredientSchema>;