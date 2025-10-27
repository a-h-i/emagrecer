/**
 * Percentage of daily macros.
 * Each value is between 0 and 100.
 * And represents a percentage of the total daily kcal.
 *
 * Example
 * If your target is 2200 kcal/day and your split is Protein30 / Carbs40 / Fat30:
 * Protein grams = (0.30 × 2200) / 4 ≈ 165 g
 * Carbs grams = (0.40 × 2200) / 4 ≈ 220 g
 * at grams = (0.30 × 2200) / 9 ≈ 73 g
 * The division by 4 and 9 is because of Atwater Factors i.e. te average energy you get by oxidizing each macronutrient.
 * Protein: ~4 kcal/g
 * Carbohydrate (digestible): ~4 kcal/g
 * Fat: ~9 kcal/g
 *
 */
export interface MacroSplit {
  protein: number;
  fat: number;
  carbs: number;
}
