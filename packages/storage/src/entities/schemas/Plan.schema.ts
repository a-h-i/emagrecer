import { z } from 'zod';
import { macroSplitSchema } from './MacroSplit.schema';

export const planSchema = z
  .object({
    id: z.string(),
    user_id: z.string(),
    week_start: z.iso.datetime(),
    kcal_target: z.number().nullish(),
    macro_split: macroSplitSchema.nullish(),
    created_at: z.iso.datetime(),
    updated_at: z.iso.datetime(),
  })
  .strict();

export type PlanSchemaType = z.infer<typeof planSchema>;
