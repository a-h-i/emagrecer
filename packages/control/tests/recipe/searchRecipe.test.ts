import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DataSource } from 'typeorm';
import {
  Aisle,
  createPgDataSource,
  Ingredient,
  Recipe,
  RecipeIngredient,
  RecipeTag,
  UnitEnum,
} from '@emagrecer/storage';
import { RecipeSort, searchRecipe } from '../../src';

describe('searchRecipe', () => {
  let source: DataSource;

  beforeAll(async () => {
    source = createPgDataSource(true);
    await source.initialize();
  });

  beforeEach(async () => {
    await source.manager.query(`
      truncate recipe_tag_relation cascade;
      truncate recipe_tag cascade;
      truncate recipe_ingredient cascade;
      truncate ingredient cascade;
      truncate recipe cascade;
      truncate aisle cascade;
    `);
  });

  afterAll(async () => {
    await source.manager.query(`
      truncate recipe_tag_relation cascade;
      truncate recipe_tag cascade;
      truncate recipe_ingredient cascade;
      truncate ingredient cascade;
      truncate recipe cascade;
      truncate aisle cascade;
    `);
    await source.destroy();
  });

  async function seedBase() {
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

    const r1Ingredient = source.manager.create(Ingredient, {
      name_en: 'Chicken Breast',
      name_pt: 'Peito de Frango',
      aisle_slug: aisle.slug,
      kcal_per_100g: 120,
      protein_g_per_100g: 23,
      carbs_g_per_100g: 0,
      fat_g_per_100g: 2,
      unit_base: UnitEnum.GRAM,
      nutrition_per_100g: {
        kcal: 350,
        carbs_g: 20,
        fat_g: 8,
        protein_g: 35,
      },
    });
    const r2Ingredient = source.manager.create(Ingredient, {
      name_en: 'Chicken Breast',
      name_pt: 'Peito de Frango',
      aisle_slug: aisle.slug,
      kcal_per_100g: 120,
      protein_g_per_100g: 23,
      carbs_g_per_100g: 0,
      fat_g_per_100g: 2,
      unit_base: UnitEnum.GRAM,
      nutrition_per_100g: {
        kcal: 200,
        carbs_g: 15,
        fat_g: 5,
        protein_g: 8,
      },
    });
    const r3Ingredient = source.manager.create(Ingredient, {
      name_en: 'Chicken Breast',
      name_pt: 'Peito de Frango',
      aisle_slug: aisle.slug,
      kcal_per_100g: 120,
      protein_g_per_100g: 23,
      carbs_g_per_100g: 0,
      fat_g_per_100g: 2,
      unit_base: UnitEnum.GRAM,
      nutrition_per_100g: {
        kcal: 500,
        carbs_g: 80,
        fat_g: 10,
        protein_g: 12,
      },
    });
    await source.manager.save([r1Ingredient, r2Ingredient, r3Ingredient]);

    const tagHighProtein = source.manager.create(RecipeTag, {
      name_en: 'High Protein',
      name_pt: 'Alta Proteína',
      slug_en: 'high-protein',
      slug_pt: 'alta-proteina',
      slug: 'high-protein',
    });
    const tagQuick = source.manager.create(RecipeTag, {
      name_en: 'Quick',
      name_pt: 'Rápido',
      slug_en: 'quick',
      slug_pt: 'rapido',
      slug: 'quick',
    });
    await source.manager.save([tagHighProtein, tagQuick]);

    // Three recipes to exercise sorting and pagination
    const r1 = source.manager.create(Recipe, {
      title_en: 'Protein Bowl',
      title_pt: 'Tigela de Proteína',
      servings: 2,
      instructions_md_en: 'Mix and serve',
      instructions_md_pt: 'Misture e sirva',
      kcal_per_serving: 350,
      protein_g_per_serving: 35,
      carbs_g_per_serving: 20,
      fat_g_per_serving: 8,
      estimated_cook_time_s: 10 * 60,
    });
    const r2 = source.manager.create(Recipe, {
      title_en: 'Light Salad',
      title_pt: 'Salada Leve',
      servings: 2,
      instructions_md_en: 'Chop and toss',
      instructions_md_pt: 'Picar e misturar',
      kcal_per_serving: 200,
      protein_g_per_serving: 8,
      carbs_g_per_serving: 15,
      fat_g_per_serving: 5,
      estimated_cook_time_s: 5 * 60,
    });
    const r3 = source.manager.create(Recipe, {
      title_en: 'Carb Pasta',
      title_pt: 'Massa de Carbo',
      servings: 2,
      instructions_md_en: 'Boil and mix',
      instructions_md_pt: 'Ferver e misturar',
      kcal_per_serving: 500,
      protein_g_per_serving: 12,
      carbs_g_per_serving: 80,
      fat_g_per_serving: 10,
      estimated_cook_time_s: 20 * 60,
    });
    await source.manager.save([r1, r2, r3]);

    // attach tags
    await source.manager
      .createQueryBuilder()
      .relation(Recipe, 'tags')
      .of(r1)
      .add(tagHighProtein);
    await source.manager
      .createQueryBuilder()
      .relation(Recipe, 'tags')
      .of(r2)
      .add(tagQuick);
    await source.manager
      .createQueryBuilder()
      .relation(Recipe, 'tags')
      .of(r3)
      .add(tagQuick);

    // attach ingredients (one shared base ingredient for simplicity)
    const r1Ingredients = source.manager.create(RecipeIngredient, {
      recipe_id: r1.id,
      ingredient_id: r1Ingredient.id,
      quantity: 100,
      unit: UnitEnum.GRAM,
      unit_to_g: 1,
    });
    const r2Ingredients = source.manager.create(RecipeIngredient, {
      recipe_id: r2.id,
      ingredient_id: r2Ingredient.id,
      quantity: 100,
      unit: UnitEnum.GRAM,
      unit_to_g: 1,
    });
    const r3Ingredients = source.manager.create(RecipeIngredient, {
      recipe_id: r3.id,
      ingredient_id: r3Ingredient.id,
      quantity: 100,
      unit: UnitEnum.GRAM,
      unit_to_g: 1,
    });

    await source.manager.save([r1Ingredients, r2Ingredients, r3Ingredients]);

    return { r1, r2, r3, tagHighProtein, tagQuick };
  }

  it('paginates by protein DESC and returns next_page_token', async () => {
    const { r1, r2, r3 } = await seedBase();

    // protein per serving: r1=35, r3=12, r2=8 -> DESC => r1, r3, r2
    const page1 = await searchRecipe(
      source.manager,
      {
        query: '',
        sort: RecipeSort.PROTEIN,
        sort_direction: 'DESC',
        locale: 'en',
      },
      2,
    );
    expect(page1.recipes.map((r) => r.id)).toEqual([r1.id, r3.id]);
    expect(page1.next_page_token).toBeDefined();

    const page2 = await searchRecipe(
      source.manager,
      {
        query: '',
        sort: RecipeSort.PROTEIN,
        sort_direction: 'DESC',
        locale: 'en',
      },
      2,
      page1.next_page_token,
    );
    expect(page2.recipes.map((r) => r.id)).toEqual([r2.id]);
    expect(page2.next_page_token).toBeUndefined();
  });

  it('filters by tags', async () => {
    const { r2, r3 } = await seedBase();

    const res = await searchRecipe(
      source.manager,
      {
        query: '',
        sort: RecipeSort.CALORIES,
        sort_direction: 'ASC',
        locale: 'en',
        tags: ['quick'],
      },
      10,
    );
    const ids = res.recipes.map((r) => r.id);
    expect(ids).toEqual([r2.id, r3.id]);
  });

  it('sorts by cook time ASC', async () => {
    const { r1, r2, r3 } = await seedBase();

    const res = await searchRecipe(
      source.manager,
      {
        query: '',
        sort: RecipeSort.TIME,
        sort_direction: 'ASC',
        locale: 'en',
      },
      10,
    );
    // cook time: r2=5m, r1=10m, r3=20m
    expect(res.recipes.map((r) => r.id)).toEqual([r2.id, r1.id, r3.id]);
  });

  it('relevance search uses text_search and returns results ordered by rank', async () => {
    const { r1 } = await seedBase();

    const res = await searchRecipe(
      source.manager,
      {
        query: 'protein',
        sort: RecipeSort.RELEVANCE,
        sort_direction: 'DESC',
        locale: 'en',
      },
      10,
    );
    // Expect 'Protein Bowl' to rank highly
    expect(res.recipes.length).toBeGreaterThan(0);
    expect(res.recipes[0].id).toBe(r1.id);
  });

  it('throws on invalid next_page_token sort mismatch', async () => {
    await seedBase();

    const page = await searchRecipe(
      source.manager,
      {
        query: '',
        sort: RecipeSort.FAT,
        sort_direction: 'ASC',
        locale: 'en',
      },
      1,
    );

    await expect(
      searchRecipe(
        source.manager,
        {
          query: '',
          sort: RecipeSort.CARBS, // different sort than token was created with
          sort_direction: 'ASC',
          locale: 'en',
        },
        1,
        page.next_page_token,
      ),
    ).rejects.toThrowError();
  });
});
