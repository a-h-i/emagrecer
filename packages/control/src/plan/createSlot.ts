import { EntityManager } from 'typeorm';
import {
  MealPlan,
  MealSlot,
  MealSlotCreateSchemaType,
} from '@emagrecer/storage';
import { ForbiddenError } from '../errors';

export async function createSlot(
  manager: EntityManager,
  slot: MealSlotCreateSchemaType,
  userId: string,
): Promise<MealSlot> {
  const plan = await manager.findOneBy(MealPlan, {
    id: slot.plan_id,
    user_id: userId,
  });
  if (plan == null) {
    throw new ForbiddenError(
      `Plan#${slot.plan_id} belonging to user#${userId} not found`,
    );
  }

  const newSlot = manager.create(MealSlot, slot);
  await manager.save(newSlot);
  return newSlot;
}
