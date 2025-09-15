import { CreateUpdatedAtFunc1755968395802 } from './1755968395802-CreateUpdatedAtFunc';
import { CreateExtensions1755968464258 } from './1755968464258-CreateExtensions';
import { CreateUnitEnum1755968586518 } from './1755968586518-CreateUnitEnum';
import { CreateMealTypeEnum1755979325628 } from './1755979325628-CreateMealTypeEnum';
import { CreateAisle1755992317179 } from './1755992317179-CreateAisle';
import { CreateIngredient1755992470544 } from './1755992470544-CreateIngredient';
import { CreateStore1755992638722 } from './1755992638722-CreateStore';
import { CreateProduct1755992831208 } from './1755992831208-CreateProduct';
import { CreateMealPlan1755993015113 } from './1755993015113-CreateMealPlan';
import { CreateRecipe1755993148327 } from './1755993148327-CreateRecipe';
import { CreateMealSlot1755993148328 } from './1755993148328-CreateMealSlot';
import { CreateRecipeIngredient1755993748558 } from './1755993748558-CreateRecipeIngredient';
import { CreateUserPriceOverride1755994119078 } from './1755994119078-CreateUserPriceOverride';
import { CreateAllergenEnum1755968586517 } from './1755968586517-CreateAllergenEnum';
import { CreateDietPreferenceEnum1755997125098 } from './1755997125098-CreateDietPreferenceEnum';
import { CreateUserProfile1755997130659 } from './1755997130659-CreateUserProfile';
import { CreateComputeRecipeTotalsFunc1756077439079 } from './1756077439079-CreateComputeRecipeTotalsFunc';
import { CreateRecomputeRecipeTrigger1756077945878 } from './1756077945878-CreateRecomputeRecipeTrigger';
import { CreateNextAuthTables1755968395801 } from './1755968395801-CreateNextAuthTables';

export const migrations = [
  CreateNextAuthTables1755968395801,
  CreateUpdatedAtFunc1755968395802,
  CreateExtensions1755968464258,
  CreateAllergenEnum1755968586517,
  CreateUnitEnum1755968586518,
  CreateMealTypeEnum1755979325628,
  CreateAisle1755992317179,
  CreateIngredient1755992470544,
  CreateStore1755992638722,
  CreateProduct1755992831208,
  CreateMealPlan1755993015113,
  CreateRecipe1755993148327,
  CreateMealSlot1755993148328,
  CreateRecipeIngredient1755993748558,
  CreateUserPriceOverride1755994119078,
  CreateDietPreferenceEnum1755997125098,
  CreateUserProfile1755997130659,
  CreateComputeRecipeTotalsFunc1756077439079,
  CreateRecomputeRecipeTrigger1756077945878,
];
