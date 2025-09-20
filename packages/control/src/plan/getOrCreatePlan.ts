import { DataSource } from 'typeorm';
import { MealPlan } from '@emagrecer/storage';
import { getOrCreateProfileTx } from '../profile';

export async function getOrCreatePlan(
  source: DataSource,
  userId: string,
  weekStart: Date,
) {
  const date = new Date(weekStart);
  date.setHours(0, 0, 0, 0);

  return source.manager.transaction(async (transaction) => {
    const existing = await transaction.findOneBy(MealPlan, {
      user_id: userId,
      week_start: date,
    });
    if (existing) {
      return {
        plan: existing,
        created: false,
      };
    }

    const profile = await getOrCreateProfileTx(transaction, userId);

    const plan = transaction.create(MealPlan, {
      user_id: userId,
      week_start: date,
      kcal_target: profile.kcal_target ?? null,
      macro_split: profile.macro_split ?? null,
    });
    await transaction.save(plan);
    return {
      plan,
      created: true,
    };
  });
}
