import { EntityManager } from 'typeorm';
import { MealPlan, MealSlot, MealSlotSchemaType } from '@emagrecer/storage';

export async function createSlot(
  manager: EntityManager,
  slot: MealSlotSchemaType,
  plan: MealPlan,
): Promise<MealSlot> {
  throw new Error('Not implemented');
}
