'use client';
import RecipeRow from '@/ui/components/planner/recipe/list/RecipeRow';
import { RecipeSchemaTypeWithTagsAndIngredients } from '@emagrecer/storage';

interface RecipeListItemsProps {
  recipes: RecipeSchemaTypeWithTagsAndIngredients[];
  action?: (recipe: RecipeSchemaTypeWithTagsAndIngredients) => void;
  actionLabel?: string;
}

export function RecipeListItems(props: RecipeListItemsProps) {
  return (
    <>
      {props.recipes.map((recipe) => {
        return (
          <RecipeRow
            key={recipe.id}
            recipe={recipe}
            action={() => {
              if (props.action) {
                props.action(recipe);
              }
            }}
            actionLabel={props.actionLabel}
          />
        );
      })}
    </>
  );
}
