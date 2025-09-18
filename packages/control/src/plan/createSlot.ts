import { EntityManager } from 'typeorm';
import { MealSlot, MealSlotSchemaType } from '@emagrecer/storage';

export async function createSlot(
  manager: EntityManager,
  slot: MealSlotSchemaType,
): Promise<MealSlot> {
  const newSlot = manager.create(MealSlot, slot);
  await manager.save(newSlot);
  return newSlot;
}
