import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { DataSource, EntityNotFoundError } from 'typeorm';
import {
  Aisle,
  createPgDataSource,
  Ingredient,
  Recipe,
  RecipeIngredient,
  RecipeTag,
  RecipeTagsRelation,
  UnitEnum,
} from '@emagrecer/storage';
import { getRecipe } from '../../src';
import { faker } from '@faker-js/faker';

describe('getRecipe', () => {
  let source: DataSource;

  beforeAll(async () => {
    source = createPgDataSource(true);
    await source.initialize();
  });

  afterAll(async () => {
    await source.manager.query(
      `
      truncate recipe cascade;
      truncate recipe_tag cascade;
      truncate recipe_ingredient cascade;
      truncate ingredient cascade;
      truncate aisle cascade;
      `,
    );
    await source.destroy();
  });

  it('fails on non-existing recipe', async () => {
    await expect(
      getRecipe(source.manager, faker.string.uuid()),
    ).rejects.toThrow(EntityNotFoundError);
  });

  it('fetches an existing recipe', async () => {
    const tag = source.manager.create(RecipeTag, {
      slug: 'vegetarian',
      slug_en: 'vegetarian',
      slug_pt: 'vegetariano',
    });
    await source.manager.save(tag);
    const recipe = source.manager.create(Recipe, {
      title_en: faker.lorem.sentence(),
      title_pt: faker.lorem.sentence(),
      slug: faker.lorem.slug(),
      servings: 2,
      instructions_md_en: faker.lorem.paragraph(),
      instructions_md_pt: faker.lorem.paragraph(),
      kcal_per_serving: 100,
      protein_g_per_serving: 10,
      carbs_g_per_serving: 5,
      fat_g_per_serving: 2,
      description: faker.lorem.paragraph(),
      estimated_cook_time_s: 60 * 30,
    });
    await source.manager.save(recipe);
    const relation = source.manager.create(RecipeTagsRelation, {
      tag: tag.slug,
      recipe_id: recipe.id,
    });
    await source.manager.save(relation);
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

    const ingredient1 = source.manager.create(Ingredient, {
      name_en: 'Ingredient 1',
      name_pt: 'Ingrediente 1',
      aisle_slug: aisle.slug,
      unit_base: UnitEnum.GRAM,
      allergens: [],
      is_active: true,
      nutrition_per_100g: {
        kcal: 12,
        carbs_g: 20,
        fat_g: 10,
        protein_g: 50,
      }
    });
    const ingredient2 = source.manager.create(Ingredient, {
      name_en: 'Ingredient 2',
      name_pt: 'Ingrediente 2',
      aisle_slug: aisle.slug,
      unit_base: UnitEnum.PIECE,
      allergens: [],
      is_active: true,
      nutrition_per_100g: {
        kcal: 5,
        carbs_g: 20,
        fat_g: 10,
        protein_g: 50,
      }
    });

    await source.manager.save([ingredient1, ingredient2]);
    const recipeIngredient1 = source.manager.create(RecipeIngredient, {
      recipe_id: recipe.id,
      ingredient_id: ingredient1.id,
      unit: UnitEnum.GRAM,
      quantity: 3,
      unit_to_g: 1,
    });
    const recipeIngredient2 = source.manager.create(RecipeIngredient, {
      recipe_id: recipe.id,
      ingredient_id: ingredient2.id,
      unit: UnitEnum.PIECE,
      quantity: 1,
      unit_to_g: 2,
    });
    await source.manager.save([recipeIngredient1, recipeIngredient2]);



    const fetched = await getRecipe(source.manager, recipe.id);
    await expect(fetched.tags).resolves.toStrictEqual([tag]);
    // Ensure recipe totals are calculated correctly by DB trigger  (trg_recompute_recipe)
    const ingredient1TotalKCal = parseFloat(recipeIngredient1.quantity) * parseFloat(recipeIngredient1.unit_to_g) * ingredient1.nutrition_per_100g.kcal / 100;
    const ingredient1TotalCarbs = parseFloat(recipeIngredient1.quantity) * parseFloat(recipeIngredient1.unit_to_g) * ingredient1.nutrition_per_100g.carbs_g / 100;
    const ingredient1TotalFats = parseFloat(recipeIngredient1.quantity) * parseFloat(recipeIngredient1.unit_to_g) * ingredient1.nutrition_per_100g.fat_g / 100;
    const ingredient1TotalProtein = parseFloat(recipeIngredient1.quantity) * parseFloat(recipeIngredient1.unit_to_g) * ingredient1.nutrition_per_100g.protein_g / 100;

    const ingredient2TotalKCal = parseFloat(recipeIngredient2.quantity) * parseFloat(recipeIngredient2.unit_to_g) * ingredient2.nutrition_per_100g.kcal / 100;
    const ingredient2TotalCarbs = parseFloat(recipeIngredient2.quantity) * parseFloat(recipeIngredient2.unit_to_g) * ingredient2.nutrition_per_100g.carbs_g / 100;
    const ingredient2TotalFats = parseFloat(recipeIngredient2.quantity) * parseFloat(recipeIngredient2.unit_to_g) * ingredient2.nutrition_per_100g.fat_g / 100;
    const ingredient2TotalProtein = parseFloat(recipeIngredient2.quantity) * parseFloat(recipeIngredient2.unit_to_g) * ingredient2.nutrition_per_100g.protein_g / 100;
    console.error(fetched);
    expect(fetched.kcal_per_serving).toBeCloseTo((ingredient1TotalKCal + ingredient2TotalKCal) / fetched.servings);
    expect(fetched.carbs_g_per_serving).toBeCloseTo((ingredient1TotalCarbs + ingredient2TotalCarbs) / fetched.servings);
    expect(fetched.fat_g_per_serving).toBeCloseTo((ingredient1TotalFats + ingredient2TotalFats) / fetched.servings);
    expect(fetched.protein_g_per_serving).toBeCloseTo((ingredient1TotalProtein + ingredient2TotalProtein) / fetched.servings);

  });
});