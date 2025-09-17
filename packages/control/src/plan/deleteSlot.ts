import { EntityManager } from 'typeorm';

export async function deleteSlot(
  manager: EntityManager,
  slotId: string,
  userId: string,
  planId: string,
) {
  throw new Error('Not implemented');
}
