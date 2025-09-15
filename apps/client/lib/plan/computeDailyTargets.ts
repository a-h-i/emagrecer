import { MacroSplit } from '@emagrecer/storage';

interface ComputeDailyTargetsParams {
  kcal?: number | null;
  split?: MacroSplit | null;
}

/**
 * Calculates daily nutritional targets based on calorie intake and macronutrient split percentages.
 *
 * @param {ComputeDailyTargetsParams} params - An object containing the total calorie intake and macronutrient split percentages.
 * @param {number} params.kcal - The total daily calorie intake.
 * @param {Object} params.split - An object representing the macronutrient percentages.
 * @param {number} params.split.protein - The percentage of calories to come from protein.
 * @param {number} params.split.carbs - The percentage of calories to come from carbohydrates.
 * @param {number} params.split.fat - The percentage of calories to come from fat.
 * @return {Object|null} An object containing the daily targets for calories, protein, carbohydrates, and fat in grams, or null if the input is invalid.
 */
export function computeDailyTargets(params: ComputeDailyTargetsParams) {
  if (!params.kcal || !params.split) {
    return null;
  }

  const protein_g = ((params.split.protein / 100) * params.kcal) / 4;
  const carbs_g = ((params.split.carbs / 100) * params.kcal) / 4;
  const fat_g = ((params.split.fat / 100) * params.kcal) / 9;

  return { kcal: params.kcal, protein_g, carbs_g, fat_g };
}
