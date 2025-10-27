import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { DataSource, EntityNotFoundError } from 'typeorm';
import {
  Aisle,
  MealSlot,
  MealType,
  Recipe,
  RecipeIngredient,
  Ingredient,
  UnitEnum,
  UserEntity,
  createPgDataSource,
} from '@emagrecer/storage';
import { faker } from '@faker-js/faker';
import {
  createSlot,
  deleteSlot,
  getOrCreatePlan,
  ForbiddenError,
} from '../../src';

describe('deleteSlot', () => {
  let source: DataSource;

  beforeAll(async () => {
    source = createPgDataSource(true);
    await source.initialize();
  });

  afterAll(async () => {
    await source.manager.query(`
      truncate meal_slot cascade;
      truncate recipe_tag_relation cascade;
      truncate recipe_tag cascade;
      truncate recipe_ingredient cascade;
      truncate ingredient cascade;
      truncate recipe cascade;
      truncate meal_plan cascade;
      truncate "users" cascade;
      truncate aisle cascade;
    `);
    await source.destroy();
  });

  async function createUserAndPlan(weekStartISO = '2025-01-06T00:00:00.000Z') {
    const user = source.manager.create(UserEntity, {
      name: faker.person.fullName(),
      email: faker.internet.email(),
    });
    await source.manager.save(user);
    const weekStart = new Date(weekStartISO);
    const { plan } = await getOrCreatePlan(source, user.id, weekStart);
    return { user, plan };
  }

  async function createRecipeWithIngredient() {
    const aisle = source.manager.create(Aisle, {
      slug: faker.string.uuid(),
      name_en: 'Aisle',
      name_pt: 'Corredor',
      description_en: 'desc',
      description_pt: 'desc',
      icon_key: 'icon',
      is_active: true,
    });
    await source.manager.save(aisle);

    const ingredient = source.manager.create(Ingredient, {
      name_en: faker.commerce.productName(),
      name_pt: faker.commerce.productName(),
      aisle_slug: aisle.slug,
      kcal_per_100g: 100,
      protein_g_per_100g: 10,
      carbs_g_per_100g: 10,
      fat_g_per_100g: 5,
      unit_base: UnitEnum.GRAM,
      nutrition_per_100g: {
        kcal: 100,
        carbs_g: 10,
        fat_g: 5,
        protein_g: 10,
      },
    });
    await source.manager.save(ingredient);

    const recipe = source.manager.create(Recipe, {
      title_en: faker.lorem.sentence(),
      title_pt: faker.lorem.sentence(),
      servings: 2,
      instructions_md_en: faker.lorem.paragraph(),
      instructions_md_pt: faker.lorem.paragraph(),
      kcal_per_serving: 300,
      protein_g_per_serving: 20,
      carbs_g_per_serving: 30,
      fat_g_per_serving: 10,
      estimated_cook_time_s: 10 * 60,
    });
    await source.manager.save(recipe);

    const ri = source.manager.create(RecipeIngredient, {
      recipe_id: recipe.id,
      ingredient_id: ingredient.id,
      quantity: 1,
      unit: UnitEnum.GRAM,
      unit_to_g: 1,
    });
    await source.manager.save(ri);

    return { recipe };
  }

  it('deletes an existing slot for the owner', async () => {
    const { user, plan } = await createUserAndPlan();
    const { recipe } = await createRecipeWithIngredient();

    const slot = await createSlot(source.manager, {
      plan_id: plan.id,
      day: 1,
      meal: MealType.BREAKFAST,
      recipe_id: recipe.id,
      servings: 1,
    });
    expect(slot).toBeInstanceOf(MealSlot);

    // Sanity: slot exists
    const before = await source.manager.findOneBy(MealSlot, { id: slot.id });
    expect(before?.id).toBe(slot.id);

    await deleteSlot(source.manager, slot.id, user.id, plan.id);

    const after = await source.manager.findOneBy(MealSlot, { id: slot.id });
    expect(after).toBeNull();
  });

  it('throws ForbiddenError when plan does not belong to user', async () => {
    const { user: owner, plan } = await createUserAndPlan();
    const { user: intruder } = await createUserAndPlan(
      '2025-01-13T00:00:00.000Z',
    );
    const { recipe } = await createRecipeWithIngredient();

    const slot = await createSlot(source.manager, {
      plan_id: plan.id,
      day: 2,
      meal: MealType.LUNCH,
      recipe_id: recipe.id,
      servings: 2,
    });

    await expect(
      deleteSlot(source.manager, slot.id, intruder.id, plan.id),
    ).rejects.toBeInstanceOf(ForbiddenError);

    // Ensure slot still exists
    const stillThere = await source.manager.findOneBy(MealSlot, {
      id: slot.id,
    });
    expect(stillThere?.id).toBe(slot.id);
    // Avoid unused var warning
    expect(owner.id).toBeDefined();
  });

  it('throws EntityNotFoundError when slot does not exist', async () => {
    const { user, plan } = await createUserAndPlan();

    await expect(
      deleteSlot(source.manager, faker.string.uuid(), user.id, plan.id),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
  });
});
