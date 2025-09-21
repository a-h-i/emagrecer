import { EntityManager } from 'typeorm';
import { MealSlot, MealSlotSchemaTypeWithRecipe } from '@emagrecer/storage';
export async function getPlanSlots(
  manager: EntityManager,
  planId: string,
): Promise<MealSlotSchemaTypeWithRecipe[]> {
  const query = manager
    .createQueryBuilder()
    .select('slot')
    .from(MealSlot, 'slot')
    .leftJoinAndSelect('slot.recipe', 'recipe')
    .leftJoinAndSelect('recipe.tags', 'tags')
    .leftJoinAndSelect('recipe.recipe_ingredients', 'recipe_ingredients')
    .leftJoinAndSelect('recipe_ingredients.ingredient', 'ingredient')
    .where('slot.plan_id = :planId', { planId });

  const slots = await query.getMany();

  const serializedSlots = slots.map(async (slot) => {
    const serializedSlot = slot.serialize();
    const recipe = await slot.recipe;
    const tags = await recipe.tags;
    const recipe_ingredients = await recipe.recipe_ingredients;
    const ingredients = await Promise.all(
      recipe_ingredients.map(
        (recipe_ingredient) => recipe_ingredient.ingredient,
      ),
    );
    return {
      ...serializedSlot,
      recipe: {
        ...recipe.serialize(),
        tags: tags.map((tag) => tag.serialize()),
        ingredients: ingredients.map((ingredient) => ingredient.serialize()),
        recipe_ingredients: recipe_ingredients.map((recipe_ingredient) =>
          recipe_ingredient.serialize(),
        ),
      },
    };
  });
  return Promise.all(serializedSlots);
}
