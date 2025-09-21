import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { DataSource } from 'typeorm';
import {
  Aisle,
  createPgDataSource,
  Ingredient,
  MealSlot,
  MealType,
  Recipe,
  RecipeIngredient,
  RecipeTag,
  UnitEnum,
  UserEntity,
} from '@emagrecer/storage';
import { faker } from '@faker-js/faker';
import { createSlot, getOrCreatePlan, getPlanSlots } from '../../src';

describe('getPlanSlots', () => {
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

  it('returns an empty array when the plan has no slots', async () => {
    const user = source.manager.create(UserEntity, {
      name: faker.person.fullName(),
      email: faker.internet.email(),
    });
    await source.manager.save(user);
    const weekStart = new Date('2025-01-06T00:00:00.000Z');

    const { plan } = await getOrCreatePlan(source, user.id, weekStart);

    const slots = await getPlanSlots(source.manager, plan.id);
    expect(Array.isArray(slots)).toBe(true);
    expect(slots.length).toBe(0);
  });

  it('returns serialized slots with recipe, tags and ingredients', async () => {
    const user = source.manager.create(UserEntity, {
      name: faker.person.fullName(),
      email: faker.internet.email(),
    });
    await source.manager.save(user);
    const weekStart = new Date('2025-01-13T00:00:00.000Z');

    const { plan } = await getOrCreatePlan(source, user.id, weekStart);

    const aisle = source.manager.create(Aisle, {
      slug: 'aisle-1',
      name_en: 'Aisle 1',
      name_pt: 'Aisla 1',
      description_en: 'Aisle 1 description',
      description_pt: 'Descripción de la aisla 1',
      icon_key: 'uid1',
      is_active: true,
    });
    await source.manager.save(aisle);
    // Create base ingredient
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
        kcal: 12,
        carbs_g: 20,
        fat_g: 10,
        protein_g: 50,
      },
    });
    await source.manager.save(ingredient);

    // Create recipe with tags and ingredients
    const recipe = source.manager.create(Recipe, {
      title_en: faker.lorem.sentence(),
      title_pt: faker.lorem.sentence(),
      slug: faker.lorem.slug(),
      servings: 2,
      instructions_md_en: faker.lorem.paragraph(),
      instructions_md_pt: faker.lorem.paragraph(),
      kcal_per_serving: 300,
      protein_g_per_serving: 20,
      carbs_g_per_serving: 30,
      fat_g_per_serving: 10,
      estimated_cook_time_s: 20 * 60,
    });
    await source.manager.save(recipe);

    // Tag
    const tag = source.manager.create(RecipeTag, {
      name_en: 'High Protein',
      name_pt: 'Alta Proteína',
      slug_en: faker.helpers.slugify('high protein'),
      slug_pt: faker.helpers.slugify('alto teor de proteína'),
      slug: faker.helpers.slugify('high protein'),
    });
    await source.manager.save(tag);
    await source.manager
      .createQueryBuilder()
      .relation(Recipe, 'tags')
      .of(recipe)
      .add(tag);

    // Ingredient relation
    const ri = source.manager.create(RecipeIngredient, {
      recipe_id: recipe.id,
      ingredient_id: ingredient.id,
      quantity: 1,
      unit: UnitEnum.GRAM,
      unit_to_g: 1,
    });
    await source.manager.save(ri);

    // Create two slots for the same plan and recipe
    const slotInputA = {
      plan_id: plan.id,
      day: 1,
      meal: MealType.BREAKFAST,
      recipe_id: recipe.id,
      servings: 1,
    };
    const slotInputB = {
      plan_id: plan.id,
      day: 3,
      meal: MealType.DINNER,
      recipe_id: recipe.id,
      servings: 2,
    };

    const createdA = await createSlot(source.manager, slotInputA);
    const createdB = await createSlot(source.manager, slotInputB);
    expect(createdA).toBeInstanceOf(MealSlot);
    expect(createdB).toBeInstanceOf(MealSlot);

    const slots = await getPlanSlots(source.manager, plan.id);

    // Should return both slots
    expect(slots.length).toBe(2);
    // Verify structure and serialization
    for (const s of slots) {
      expect(s.id).toBeDefined();
      expect(s.plan_id).toBe(plan.id);
      expect(typeof s.day).toBe('number');
      expect(typeof s.meal).toBe('string');
      expect(typeof s.servings).toBe('number');
      expect(s.recipe).toBeDefined();
      expect(s.recipe.id).toBe(recipe.id);
      expect(Array.isArray(s.recipe.tags)).toBe(true);
      expect(Array.isArray(s.recipe.ingredients)).toBe(true);
    }

    const slotA = slots.find(
      (s) => s.day === slotInputA.day && s.meal === slotInputA.meal,
    )!;
    const slotB = slots.find(
      (s) => s.day === slotInputB.day && s.meal === slotInputB.meal,
    )!;

    expect(slotA.servings).toBe(1);
    expect(slotB.servings).toBe(2);

    // Ensure tags and ingredients are serialized
    expect(slotA.recipe.tags.length).toBe(1);
    expect(slotA.recipe.tags[0].slug).toBe(tag.slug);

    expect(slotA.recipe.ingredients.length).toBe(1);
    expect(slotA.recipe.ingredients[0].id).toBe(ingredient.id);
  });
});
