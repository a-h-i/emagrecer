'use client';
import { useGetInfiniteRecipesInfiniteQuery } from '@/lib/redux/api/api-slice';
import { RecipeFilters } from '@emagrecer/control';
import RecipeListSkeleton from '@/ui/components/planner/recipe/list/RecipeListSkeleton';
import { ReactNode, useMemo, useState } from 'react';
import RecipeListEmptyState from '@/ui/components/planner/recipe/list/RecipeListEmptyState';
import {
  MealSlotCreateSchemaType,
  RecipeSchemaTypeWithTagsAndIngredients,
} from '@emagrecer/storage';
import RecipeRow from '@/ui/components/planner/recipe/list/RecipeRow';
import AddRecipePopover, {
  AddRecipeFormData,
} from '@/ui/components/planner/recipe/list/AddRecipePopover';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { selectPlan, setSlot } from '@/lib/redux/plan/plan-slice';

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
  const dispatch = useAppDispatch();
  const plan = useAppSelector(selectPlan);

  const onAdd = (recipe: RecipeSchemaTypeWithTagsAndIngredients) => {
    setRecipeBeingAdded(recipe);
  };
  const onConfirm = (data: AddRecipeFormData) => {
    if (!recipeBeingAdded || plan.planId == null) {
      return;
    }
    const slotData: MealSlotCreateSchemaType = {
      recipe_id: recipeBeingAdded.id,
      plan_id: plan.planId,
      day: data.day,
      meal: data.mealType,
      servings: data.servings,
    };
    dispatch(setSlot(slotData));
    setRecipeBeingAdded(undefined);
  };
  const onCancel = () => {
    setRecipeBeingAdded(undefined);
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
      {/* Pagination controls */}
      {!isLoading && !isError && (
        <div className='mt-4 flex items-center justify-center'>
          <button
            type='button'
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetching}
            className='inline-flex items-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50'
          >
            {isFetching
              ? 'Loading…'
              : hasNextPage
                ? 'Load more'
                : 'No more results'}
          </button>
        </div>
      )}
      <AddRecipePopover
        open={recipeBeingAdded != null}
        onClose={onCancel}
        onConfirm={onConfirm}
      />
    </div>
  );
}
