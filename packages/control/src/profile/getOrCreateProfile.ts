import { getDS, DietPreference, UserProfile } from '@emagrecer/storage';

export async function getOrCreateProfile(userId: string): Promise<UserProfile> {
  const source = await getDS();
  const names = source.entityMetadatas.map(m => m.name);
  console.log(names);
  return await source.manager.transaction(async (transaction) => {
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
  });
}