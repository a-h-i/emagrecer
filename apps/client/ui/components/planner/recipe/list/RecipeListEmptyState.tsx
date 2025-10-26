import { useTranslations } from 'next-intl';

export default function RecipeListEmptyState() {
  const t = useTranslations('Planner');
  return (
    <div className='rounded-2xl border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-500'>
      {t('panel.no_recipe_search_matches')}
    </div>
  );
}
