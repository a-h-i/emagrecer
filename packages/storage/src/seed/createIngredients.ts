import { EntityManager } from 'typeorm';
import { Allergens, Ingredient, UnitEnum } from '../entities';

export default async function createIngredients(
  manager: EntityManager,
): Promise<Ingredient[]> {
  const ingredients = [
    manager.create(Ingredient, {
      name_en: 'Chicken Breast',
      name_pt: 'Peito de Frango',
      aisle_slug: 'butchery',
      unit_base: UnitEnum.GRAM,
      density_g_per_ml: null,
      nutrition_per_100g: {
        kcal: 120,
        protein_g: 23,
        carbs_g: 0,
        fat_g: 2,
        fiber_g: 0,
        sugar_g: 0,
        sodium_mg: 70,
      },
      allergens: [],
      is_active: true,
    }),
    manager.create(Ingredient, {
      name_en: 'Olive Oil',
      name_pt: 'Azeite',
      aisle_slug: 'pantry',
      unit_base: UnitEnum.ML,
      density_g_per_ml: '0.915000',
      nutrition_per_100g: {
        kcal: 884,
        protein_g: 0,
        carbs_g: 0,
        fat_g: 100,
        fiber_g: 0,
        sugar_g: 0,
        sodium_mg: 0,
      },
      allergens: [],
      is_active: true,
    }),
    manager.create(Ingredient, {
      name_en: 'Brown Rice',
      name_pt: 'Arroz Integral',
      aisle_slug: 'pantry',
      unit_base: UnitEnum.GRAM,
      density_g_per_ml: null,
      nutrition_per_100g: {
        kcal: 370,
        protein_g: 7.9,
        carbs_g: 77,
        fat_g: 2.9,
        fiber_g: 3.5,
        sugar_g: 0.9,
        sodium_mg: 5,
      },
      allergens: [],
      is_active: true,
    }),
    manager.create(Ingredient, {
      name_en: 'Tofu',
      name_pt: 'Tofu',
      aisle_slug: 'produce',
      unit_base: UnitEnum.GRAM,
      density_g_per_ml: null,
      nutrition_per_100g: {
        kcal: 76,
        protein_g: 8,
        carbs_g: 1.9,
        fat_g: 4.8,
        fiber_g: 0.3,
        sugar_g: 0.6,
        sodium_mg: 7,
      },
      allergens: [Allergens.SOYBEANS],
      is_active: true,
    }),
    manager.create(Ingredient, {
      name_en: 'Cherry Tomato',
      name_pt: 'Tomate Cereja',
      aisle_slug: 'produce',
      unit_base: UnitEnum.GRAM,
      density_g_per_ml: null,
      nutrition_per_100g: {
        kcal: 18,
        protein_g: 0.9,
        carbs_g: 3.9,
        fat_g: 0.2,
        fiber_g: 1.2,
        sugar_g: 2.6,
        sodium_mg: 5,
      },
      allergens: [],
      is_active: true,
    }),
  ];
  await manager.save(ingredients);
  return ingredients;
}
