import {
  Aisle,
  Ingredient,
  Recipe,
  RecipeIngredient,
  RecipeTag,
  RecipeTagsRelation,
  Store,
  UnitEnum,
} from '../entities';
import { EntityManager } from 'typeorm';
import { createAisles } from './createAisles';
import createStores from './createStores';
import createIngredients from './createIngredients';
import createRecipeTags from './createRecipeTags';

type Created = {
  aisles: Aisle[];
  stores: Store[];
  tags: RecipeTag[];
  ingredients: Ingredient[];
  recipes: Recipe[];
  recipeIngredients: RecipeIngredient[];
  recipeTagsRelations: RecipeTagsRelation[];
};

export async function createRecipes(manager: EntityManager): Promise<Created> {
  const aisles = await createAisles(manager);
  const stores = await createStores(manager);
  const ingredients = await createIngredients(manager);
  const tags = await createRecipeTags(manager);

  const recipes = [
    manager.create(Recipe, {
      title_en: 'Protein Bowl',
      title_pt: 'Tigela de Proteína',
      servings: 2,
      instructions_md_en:
        '1. Cook brown rice.\n2. Grill chicken.\n3. Combine with tomatoes.\n4. Drizzle olive oil.\n5. Serve.',
      instructions_md_pt:
        '1. Cozinhe o arroz integral.\n2. Grelhe o frango.\n3. Junte com tomates.\n4. Regue com azeite.\n5. Sirva.',
      kcal_per_serving: '350.00',
      protein_g_per_serving: '35.00',
      carbs_g_per_serving: '20.00',
      fat_g_per_serving: '8.00',
      created_by_user_id: null,
      estimated_cook_time_s: 10 * 60,
    }),
    manager.create(Recipe, {
      title_en: 'Light Salad',
      title_pt: 'Salada Leve',
      servings: 2,
      instructions_md_en:
        '1. Slice tomatoes.\n2. Toss with tofu cubes.\n3. Add olive oil and salt.\n4. Serve chilled.',
      instructions_md_pt:
        '1. Corte os tomates.\n2. Misture com cubos de tofu.\n3. Adicione azeite e sal.\n4. Sirva frio.',
      kcal_per_serving: '200.00',
      protein_g_per_serving: '8.00',
      carbs_g_per_serving: '15.00',
      fat_g_per_serving: '5.00',
      created_by_user_id: null,
      estimated_cook_time_s: 5 * 60,
    }),
    manager.create(Recipe, {
      title_en: 'Carb Pasta',
      title_pt: 'Massa de Carbo',
      servings: 2,
      instructions_md_en:
        '1. Boil water.\n2. Cook pasta.\n3. Dress with olive oil.\n4. Serve.',
      instructions_md_pt:
        '1. Ferva água.\n2. Cozinhe a massa.\n3. Tempere com azeite.\n4. Sirva.',
      kcal_per_serving: '500.00',
      protein_g_per_serving: '12.00',
      carbs_g_per_serving: '80.00',
      fat_g_per_serving: '10.00',
      created_by_user_id: null,
      estimated_cook_time_s: 20 * 60,
    }),
  ];
  await manager.save(recipes);

  const recipeTagsRelations = [
    manager.create(RecipeTagsRelation, {
      recipe_id: recipes[0].id,
      tag: 'high-protein',
    }),
    manager.create(RecipeTagsRelation, {
      recipe_id: recipes[1].id,
      tag: 'quick',
    }),
    manager.create(RecipeTagsRelation, {
      recipe_id: recipes[2].id,
      tag: 'quick',
    }),
    manager.create(RecipeTagsRelation, {
      recipe_id: recipes[1].id,
      tag: 'vegetarian',
    }),
  ];
  await manager.save(recipeTagsRelations);
  const recipeIngredients = [
    // Protein Bowl
    manager.create(RecipeIngredient, {
      recipe_id: recipes[0].id,
      ingredient_id: ingredients[0].id, // chicken
      quantity: '200.00',
      unit: UnitEnum.GRAM,
      unit_to_g: '1.000000',
      note: 'Grilled',
    }),
    manager.create(RecipeIngredient, {
      recipe_id: recipes[0].id,
      ingredient_id: ingredients[2].id, // brown rice
      quantity: '150.00',
      unit: UnitEnum.GRAM,
      unit_to_g: '1.000000',
      note: 'Cooked',
    }),
    manager.create(RecipeIngredient, {
      recipe_id: recipes[0].id,
      ingredient_id: ingredients[4].id, // cherry tomato
      quantity: '80.00',
      unit: UnitEnum.GRAM,
      unit_to_g: '1.000000',
      note: '',
    }),
    manager.create(RecipeIngredient, {
      recipe_id: recipes[0].id,
      ingredient_id: ingredients[1].id, // olive oil
      quantity: '10.00',
      unit: UnitEnum.ML,
      unit_to_g: '0.915000',
      note: 'Drizzle',
    }),

    // Light Salad
    manager.create(RecipeIngredient, {
      recipe_id: recipes[1].id,
      ingredient_id: ingredients[3].id, // tofu
      quantity: '150.00',
      unit: UnitEnum.GRAM,
      unit_to_g: '1.000000',
      note: 'Cubed',
    }),
    manager.create(RecipeIngredient, {
      recipe_id: recipes[1].id,
      ingredient_id: ingredients[4].id, // cherry tomato
      quantity: '120.00',
      unit: UnitEnum.GRAM,
      unit_to_g: '1.000000',
      note: 'Halved',
    }),
    manager.create(RecipeIngredient, {
      recipe_id: recipes[1].id,
      ingredient_id: ingredients[1].id, // olive oil
      quantity: '12.00',
      unit: UnitEnum.ML,
      unit_to_g: '0.915000',
      note: '',
    }),

    // Carb Pasta (simulate with pantry items we have; olive oil as dressing)
    manager.create(RecipeIngredient, {
      recipe_id: recipes[2].id,
      ingredient_id: ingredients[2].id, // brown rice (standing in for pasta)
      quantity: '180.00',
      unit: UnitEnum.GRAM,
      unit_to_g: '1.000000',
      note: 'Cooked al dente (sub for pasta in fixtures)',
    }),
    manager.create(RecipeIngredient, {
      recipe_id: recipes[2].id,
      ingredient_id: ingredients[1].id, // olive oil
      quantity: '15.00',
      unit: UnitEnum.ML,
      unit_to_g: '0.915000',
      note: 'To taste',
    }),
  ];
  await manager.save(recipeIngredients);

  return {
    aisles,
    stores,
    tags,
    ingredients,
    recipes,
    recipeIngredients,
    recipeTagsRelations,
  };
}
