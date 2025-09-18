import { EntityManager, EntityNotFoundError } from 'typeorm';
import { MealPlan, MealSlot } from '@emagrecer/storage';
import { ForbiddenError } from '../errors';

export async function deleteSlot(
  manager: EntityManager,
  slotId: string,
  userId: string,
  planId: string,
) {
  const plan = await manager.findOneBy(MealPlan, {
    id: planId,
    user_id: userId,
  });
  if (plan == null) {
    throw new ForbiddenError(`Plan#${planId} belonging to user#${userId} not found`);
  }
  const deleted = await manager.delete(MealSlot, slotId);
  if (deleted.affected === 0) {
    throw new EntityNotFoundError(MealSlot, {
      id: slotId,
    });
  }
}
