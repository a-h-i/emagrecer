import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RecipeSchemaTypeWithTagsAndIngredients } from '@emagrecer/storage';
import { RecipeFilters, recipeSearchResultsSchema } from '@emagrecer/control';

type RecipePage = {
  recipes: RecipeSchemaTypeWithTagsAndIngredients[];
  next_page_token?: string | null;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Recipe'],
  endpoints: (builder) => ({
    getInfiniteRecipes: builder.infiniteQuery<
      RecipePage,
      RecipeFilters,
      string | null
    >({
      infiniteQueryOptions: {
        initialPageParam: null,
        getNextPageParam: (lastPage) => {
          if (lastPage.next_page_token == null) {
            return undefined;
          } else {
            return lastPage.next_page_token;
          }
        },
      },
      query({ queryArg, pageParam }) {
        const params = new URLSearchParams();
        if (pageParam != null) {
          params.set('page', pageParam);
        }
        for (const key in queryArg) {
          const value = queryArg[key as keyof typeof queryArg];
          if (value != null) {
            if (Array.isArray(value)) {
              for (const item of value) {
                params.append(key, item);
              }
            } else {
              params.set(key, value);
            }
          }
        }
        return `/recipe?${params.toString()}`;
      },
      rawResponseSchema: recipeSearchResultsSchema,
      providesTags: (data) => {
        if (data == null) {
          return [];
        }
        return data.pages.flatMap((page) =>
          page.recipes.map((recipe) => ({ type: 'Recipe', id: recipe.id })),
        );
      },
    }),
  }),
});

export const { useGetInfiniteRecipesInfiniteQuery } = apiSlice;
