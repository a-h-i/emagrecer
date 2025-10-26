import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DataSource } from 'typeorm';
import {
  createPgDataSource,
  MealSlot,
  Recipe,
  MealType,
  UserEntity,
} from '@emagrecer/storage';
import { faker } from '@faker-js/faker';
import { createSlot, ForbiddenError, getOrCreatePlan } from '../../src';
import { v4 as uuid } from 'uuid';

describe('createSlot', () => {
  let source: DataSource;

  beforeAll(async () => {
    source = createPgDataSource(true);
    await source.initialize();
  });

  beforeEach(async () => {
    await source.manager.query(`
      truncate meal_slot cascade;
      truncate recipe cascade;
      truncate "users" cascade;
    `);
  });

  afterAll(async () => {
    await source.manager.query(`
      truncate meal_slot cascade;
      truncate recipe cascade;
    `);
    await source.destroy();
  });

  it('throws an error when the plan does not exist', async () => {
    const user = source.manager.create(UserEntity, {
      name: faker.person.fullName(),
      email: faker.internet.email(),
    });
    await source.manager.save(user);
    const recipe = source.manager.create(Recipe, {
      title_en: faker.lorem.sentence(),
      title_pt: faker.lorem.sentence(),
      servings: 2,
      instructions_md_en: faker.lorem.paragraph(),
      instructions_md_pt: faker.lorem.paragraph(),
      kcal_per_serving: 100,
      protein_g_per_serving: 10,
      carbs_g_per_serving: 5,
      fat_g_per_serving: 2,
      estimated_cook_time_s: 30 * 60,
    });
    await source.manager.save(recipe);
    const slotInput = {
      plan_id: uuid(),
      day: 2,
      meal: MealType.LUNCH,
      recipe_id: recipe.id,
      servings: 1,
    };
    await expect(
      createSlot(source.manager, slotInput, user.id),
    ).rejects.toThrow(Error);
  });
  it('throws an error when the recipe does not exist', async () => {
    const user = source.manager.create(UserEntity, {
      name: faker.person.fullName(),
      email: faker.internet.email(),
    });
    await source.manager.save(user);
    const weekStart = new Date('2025-01-06T15:23:11.000Z');
    const { plan } = await getOrCreatePlan(source, user.id, weekStart);
    const slotInput = {
      plan_id: plan.id,
      day: 2,
      meal: MealType.LUNCH,
      recipe_id: uuid(),
      servings: 1,
    };
    await expect(
      createSlot(source.manager, slotInput, user.id),
    ).rejects.toThrow(Error);
  });
  it('throws an error when the user does not own the plan', async () => {
    const user = source.manager.create(UserEntity, {
      name: faker.person.fullName(),
      email: faker.internet.email(),
    });
    await source.manager.save(user);
    const weekStart = new Date('2025-01-06T15:23:11.000Z');
    const { plan } = await getOrCreatePlan(source, user.id, weekStart);
    // Prepare a recipe to reference from the slot
    const recipe = source.manager.create(Recipe, {
      title_en: faker.lorem.sentence(),
      title_pt: faker.lorem.sentence(),
      servings: 2,
      instructions_md_en: faker.lorem.paragraph(),
      instructions_md_pt: faker.lorem.paragraph(),
      kcal_per_serving: 100,
      protein_g_per_serving: 10,
      carbs_g_per_serving: 5,
      fat_g_per_serving: 2,
      estimated_cook_time_s: 30 * 60,
    });
    await source.manager.save(recipe);

    const slotInput = {
      plan_id: plan.id,
      day: 2,
      meal: MealType.LUNCH,
      recipe_id: recipe.id,
      servings: 1,
    };
    const otherUser = source.manager.create(UserEntity, {
      name: faker.person.fullName(),
      email: faker.internet.email(),
    });
    await source.manager.save(otherUser);
    await expect(
      createSlot(source.manager, slotInput, otherUser.id),
    ).rejects.toThrow(ForbiddenError);
  });

  it('creates and returns a meal slot', async () => {
    const user = source.manager.create(UserEntity, {
      name: faker.person.fullName(),
      email: faker.internet.email(),
    });
    await source.manager.save(user);
    const weekStart = new Date('2025-01-06T15:23:11.000Z');
    const { plan } = await getOrCreatePlan(source, user.id, weekStart);
    // Prepare a recipe to reference from the slot
    const recipe = source.manager.create(Recipe, {
      title_en: faker.lorem.sentence(),
      title_pt: faker.lorem.sentence(),
      servings: 2,
      instructions_md_en: faker.lorem.paragraph(),
      instructions_md_pt: faker.lorem.paragraph(),
      kcal_per_serving: 100,
      protein_g_per_serving: 10,
      carbs_g_per_serving: 5,
      fat_g_per_serving: 2,
      estimated_cook_time_s: 30 * 60,
    });
    await source.manager.save(recipe);

    const slotInput = {
      plan_id: plan.id,
      day: 2,
      meal: MealType.LUNCH,
      recipe_id: recipe.id,
      servings: 1,
    };

    const created = await createSlot(source.manager, slotInput, user.id);

    expect(created).toBeInstanceOf(MealSlot);
    expect(created.id).toBeDefined();
    expect(created.plan_id).toBe(slotInput.plan_id);
    expect(created.day).toBe(slotInput.day);
    expect(created.meal).toBe(slotInput.meal);
    expect(created.recipe_id).toBe(slotInput.recipe_id);
    expect(created.servings).toBe(slotInput.servings);
    expect(created.created_at).toBeInstanceOf(Date);
    expect(created.updated_at).toBeInstanceOf(Date);

    // Verify it persisted
    const fetched = await source.manager.findOneByOrFail(MealSlot, {
      id: created.id,
    });
    expect(fetched.plan_id).toBe(slotInput.plan_id);
    expect(fetched.day).toBe(slotInput.day);
    expect(fetched.meal).toBe(slotInput.meal);
    expect(fetched.recipe_id).toBe(slotInput.recipe_id);
    expect(fetched.servings).toBe(slotInput.servings);
  });
});
