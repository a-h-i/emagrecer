import { z } from 'zod/index';


export const macroSplitSchema = z.object({
  protein: z.number(),
  fat: z.number(),
  carbs: z.number(),
}).strict();

export type MacroSplitSchemaType = z.infer<typeof macroSplitSchema>;