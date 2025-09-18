import { z } from 'zod';

export const recipeSchema = z
  .object({
    id: z.string(),
    title_en: z.string(),
    title_pt: z.string(),
    slug: z.string(),
    servings: z.string(),
    instructions_md_en: z.string().optional().nullish(),
    instructions_md_pt: z.string().optional().nullish(),
    tags: z.array(z.string()),
    kcal_per_serving: z.number(),
    protein_g_per_serving: z.number(),
    carbs_g_per_serving: z.number(),
    fat_g_per_serving: z.number(),
    created_by_user_id: z.string().optional().nullish(),
    created_at: z.iso.datetime(),
    updated_at: z.iso.datetime(),
  })
  .strict();

export type RecipeSchemaType = z.infer<typeof recipeSchema>;
