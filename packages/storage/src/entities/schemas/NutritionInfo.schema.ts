import { z } from 'zod';

export const nutritionInfoSchema = z
  .object({
    kcal: z.number(),
    protein_g: z.number(),
    carbs_g: z.number(),
    fat_g: z.number(),
    fiber_g: z.number().optional().nullish(),
    sugar_g: z.number().optional().nullish(),
    sodium_mg: z.number().optional().nullish(),
  })
  .strict();

export type NutritionInfoSchemaType = z.infer<typeof nutritionInfoSchema>;
