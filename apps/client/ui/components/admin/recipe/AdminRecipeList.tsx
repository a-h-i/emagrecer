'use client';
import { RecipeFilters } from '@emagrecer/control';
import { useGetInfiniteRecipesInfiniteQuery } from '@/lib/redux/api/api-slice';
import { ReactNode, useMemo } from 'react';
import RecipeListSkeleton from '@/ui/components/planner/recipe/list/RecipeListSkeleton';
import RecipeListEmptyState from '@/ui/components/planner/recipe/list/RecipeListEmptyState';
import { RecipeListItems } from '@/ui/components/planner/recipe/list/RecipeListItems';
import { useRouter } from 'next/navigation';
import { RecipeSchemaTypeWithTagsAndIngredients } from '@emagrecer/storage';
import { useLocale, useTranslations } from 'next-intl';

interface AdminRecipeListProps {
  filters: RecipeFilters;
}

export default function AdminRecipeList(props: AdminRecipeListProps) {
  const { data, isError, isLoading, fetchNextPage, hasNextPage, isFetching } =
    useGetInfiniteRecipesInfiniteQuery(props.filters);
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();

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
  const onClick = (recipe: RecipeSchemaTypeWithTagsAndIngredients) => {
    router.push(`/${locale}/admin/recipe/${recipe.id}`);
  };
  let content: ReactNode;
  if (isLoading) {
    content = <RecipeListSkeleton />;
  } else if (isError) {
    content = (
      <div className='text-red-400'>
        {t('Errors.recipe.list_loading_error')}
      </div>
    );
  } else if (lastPage == null || lastPage.recipes.length === 0) {
    content = <RecipeListEmptyState />;
  } else {
    content = (
      <RecipeListItems
        recipes={lastPage.recipes}
        action={onClick}
        actionLabel={t('Admin.recipes.edit_recipe_label')}
      />
    );
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
    </div>
  );
}
