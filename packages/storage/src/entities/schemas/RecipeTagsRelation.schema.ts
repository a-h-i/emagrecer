import { z } from 'zod';


export const recipeTagsRelationSchema = z.object({
  tag: z.string(),
  recipe_id: z.string(),
}).strict();

export type RecipeTagsRelationSchemaType = z.infer<typeof recipeTagsRelationSchema>;