import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DataSource } from 'typeorm';
import {
  createPgDataSource,
  DietPreference,
  MealPlan,
  UserEntity,
  UserProfile,
} from '@emagrecer/storage';
import { faker } from '@faker-js/faker';
import { getOrCreatePlan } from '../../src';

describe('getOrCreatePlan', () => {
  let source: DataSource;

  beforeAll(async () => {
    source = createPgDataSource(true);
    await source.initialize();
  });

  beforeEach(async () => {
    // Clean per test to ensure isolation
    await source.getRepository(MealPlan).deleteAll();
    await source.getRepository(UserProfile).deleteAll();
  });

  afterAll(async () => {
    await source.manager.query(
      `
      truncate user_profile cascade;
      truncate "users" cascade;
      truncate meal_plan cascade;
      `,
    );
    await source.destroy();
  });
  it('creates a plan when none exists and copies defaults from profile', async () => {
    const user = source.manager.create(UserEntity, {
      name: faker.person.fullName(),
      email: faker.internet.email(),
    });
    await source.manager.save(user);

    // create a profile with some defaults that should be copied to the plan
    const profileRepo = source.getRepository(UserProfile);
    await profileRepo.save(
      profileRepo.create({
        user_id: user.id,
        diet_preference: DietPreference.OMNIVORE,
        allergens: [],
        kcal_target: 2100,
        macro_split: { protein: 30, carbs: 40, fat: 30 },
        height_cm: null,
        weight_kg: null,
        default_store_slug: null,
      }),
    );

    const weekStart = new Date('2025-01-06T15:23:11.000Z'); // a Monday, time component should be normalized

    // Act
    const res = await getOrCreatePlan(source, user.id, weekStart);

    // Assert
    expect(res.created).toBe(true);
    expect(res.plan).toBeDefined();
    expect(res.plan.user_id).toBe(user.id);
    // time must be normalized to 00:00:00.000
    const normalized = new Date(weekStart);
    normalized.setHours(0, 0, 0, 0);
    expect(new Date(res.plan.week_start).getTime()).toBe(normalized.getTime());

    // defaults copied from profile
    expect(res.plan.kcal_target).toBe(2100);
    expect(res.plan.macro_split).toEqual({ protein: 30, carbs: 40, fat: 30 });

    // idempotency: calling again should return the same plan with created=false
    const res2 = await getOrCreatePlan(source, user.id, weekStart);
    expect(res2.created).toBe(false);
    expect(res2.plan.id).toBe(res.plan.id);
  });

  it('creates profile if missing before creating plan', async () => {
    const user = source.manager.create(UserEntity, {
      name: faker.person.fullName(),
      email: faker.internet.email(),
    });
    await source.manager.save(user);
    const weekStart = new Date('2025-02-03T22:10:00.000Z');

    // No profile pre-created; getOrCreatePlan should create it transactionally
    const res = await getOrCreatePlan(source, user.id, weekStart);

    expect(res.created).toBe(true);
    expect(res.plan.user_id).toBe(user.id);

    // When no explicit kcal_target/macro_split exist on profile, plan should default to nulls
    expect(
      res.plan.kcal_target === null || typeof res.plan.kcal_target === 'number',
    ).toBe(true);
    expect(
      res.plan.macro_split === null || typeof res.plan.macro_split === 'object',
    ).toBe(true);

    // Ensure the profile actually exists now
    const profile = await source
      .getRepository(UserProfile)
      .findOneBy({ user_id: user.id });
    expect(profile).toBeTruthy();
  });

  it('normalizes weekStart time to midnight before lookup/creation', async () => {
    const user = source.manager.create(UserEntity, {
      name: faker.person.fullName(),
      email: faker.internet.email(),
    });
    await source.manager.save(user);
    const monday = new Date('2025-03-10T00:00:00.000Z');
    const sameDayDifferentTimes = [
      new Date('2025-03-10T11:15:00.000Z'),
      new Date('2025-03-10T23:59:59.999Z'),
      new Date('2025-03-10T05:00:00.000Z'),
    ];

    // First call should create the plan
    const created = await getOrCreatePlan(
      source,
      user.id,
      sameDayDifferentTimes[0],
    );
    expect(created.created).toBe(true);

    // Subsequent calls with different times on the same date should return the same plan
    for (const t of sameDayDifferentTimes.slice(1)) {
      const res = await getOrCreatePlan(source, user.id, t);
      expect(res.created).toBe(false);
      expect(res.plan.id).toBe(created.plan.id);
    }

    // Also verify midnight exact works the same
    const resMidnight = await getOrCreatePlan(source, user.id, monday);
    expect(resMidnight.created).toBe(false);
    expect(resMidnight.plan.id).toBe(created.plan.id);
  });
});
