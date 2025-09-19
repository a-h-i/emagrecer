import { z } from 'zod';


export const recipeTagSchema = z.object({
  slug: z.string(),
  slug_en: z.string(),
  slug_pt: z.string(),
}).strict();


export type RecipeTagSchemaType = z.infer<typeof recipeTagSchema>;