import { EntityManager } from 'typeorm';
import { MealSlot, MealSlotCreateSchemaType } from '@emagrecer/storage';

export async function createSlot(
  manager: EntityManager,
  slot: MealSlotCreateSchemaType,
): Promise<MealSlot> {
  const newSlot = manager.create(MealSlot, slot);
  await manager.save(newSlot);
  return newSlot;
}
