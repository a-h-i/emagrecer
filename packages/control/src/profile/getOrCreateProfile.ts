import { DietPreference, UserProfile } from '@emagrecer/storage';
import { DataSource, EntityManager } from 'typeorm';



export async function getOrCreateProfileTx(transaction: EntityManager, userId: string) {
  let profile = await transaction.findOneBy(UserProfile, {
    user_id: userId,
  });
  if (profile == null) {
    profile = transaction.create(UserProfile, {
      user_id: userId,
      diet_preference: DietPreference.OMNIVORE,
    });
    await transaction.save(profile);
  }
  return profile;
}

export async function getOrCreateProfile(
  source: DataSource,
  userId: string,
): Promise<UserProfile> {
  return await source.manager.transaction(async (transaction) => {
    return await getOrCreateProfileTx(transaction, userId);
  });
}
