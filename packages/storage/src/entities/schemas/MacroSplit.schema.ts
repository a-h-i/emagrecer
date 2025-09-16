import { z } from 'zod/index';


export const macroSplitSchema = z.object({
  protein: z.number(),
  fat: z.number(),
  carbs: z.number(),
});

export type MacroSplitSchemaType = z.infer<typeof MacroSplitSchema>;