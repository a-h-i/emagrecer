'use client';
import { useGetInfiniteRecipesInfiniteQuery } from '@/lib/redux/api/api-slice';
import { RecipeFilters } from '@emagrecer/control';
import RecipeListSkeleton from '@/ui/components/planner/recipe/list/RecipeListSkeleton';
import { ReactNode, useMemo, useState } from 'react';
import RecipeListEmptyState from '@/ui/components/planner/recipe/list/RecipeListEmptyState';
import { RecipeSchemaTypeWithTagsAndIngredients } from '@emagrecer/storage';
import RecipeRow from '@/ui/components/planner/recipe/list/RecipeRow';
import AddRecipePopover from '@/ui/components/planner/recipe/list/AddRecipePopover';

interface RecipeListProps {
  filters: RecipeFilters;
}

interface RecipeListItemsProps {
  recipes: RecipeSchemaTypeWithTagsAndIngredients[];
  onAdd: (recipe: RecipeSchemaTypeWithTagsAndIngredients) => void;
}
function RecipeListItems(props: RecipeListItemsProps) {
  return (
    <>
      {props.recipes.map((recipe) => {
        return (
          <RecipeRow
            key={recipe.id}
            recipe={recipe}
            onAdd={() => {
              props.onAdd(recipe);
            }}
          />
        );
      })}
    </>
  );
}

export default function RecipeList(props: RecipeListProps) {
  const { data, isError, isLoading, fetchNextPage, hasNextPage, isFetching } =
    useGetInfiniteRecipesInfiniteQuery(props.filters);
  const [recipeBeingAdded, setRecipeBeingAdded] = useState<
    RecipeSchemaTypeWithTagsAndIngredients | undefined
  >();

  const onAdd = (recipe: RecipeSchemaTypeWithTagsAndIngredients) => {
    setRecipeBeingAdded(recipe);
  };
  const onConfirm = () => {
    if (!recipeBeingAdded) {
      return;
    }
  };
  const lastPage = useMemo(() => {
    if (!data) {
      return null;
    }
    if (data.pages.length === 0) {
      return null;
    } else {
      return data.pages[data.pages.length - 1];
    }
  }, [data]);

  let content: ReactNode;
  if (isLoading) {
    content = <RecipeListSkeleton />;
  } else if (isError) {
    content = <div className='text-red-400'>Error loading recipes</div>;
  } else if (lastPage == null || lastPage.recipes.length === 0) {
    content = <RecipeListEmptyState />;
  } else {
    content = <RecipeListItems recipes={lastPage.recipes} onAdd={onAdd} />;
  }

  return (
    <div className='mt-4'>
      {content}
      <AddRecipePopover
        open={recipeBeingAdded != null}
        onClose={() => true}
        onConfirm={onConfirm}
      />
    </div>
  );
}
