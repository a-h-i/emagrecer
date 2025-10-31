import { getTranslations } from 'next-intl/server';
import NextLink from 'next/link';
import RecipeListFilters from '@/ui/components/planner/recipe/list/RecipeListFilters';
import AdminRecipeList from '@/ui/components/admin/recipe/AdminRecipeList';
import { LOCALES } from '@/i18n/routing';

export const dynamicParams = false;

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}
export default async function Page({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'Admin.recipes' });

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>{t('header')}</h2>
        <NextLink
          href='new'
          className='rounded-xl bg-neutral-900 px-3 py-2 text-sm text-white'
        >
          {t('new_recipe_label')}
        </NextLink>
      </div>
      <RecipeListFilters ListElement={AdminRecipeList} />
    </div>
  );
}
