'use client';
import { RecipeSchemaTypeWithTagsAndIngredients } from '@emagrecer/storage';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/ui/components/Button';
import { useMemo } from 'react';

interface RecipeRowProps {
  recipe: RecipeSchemaTypeWithTagsAndIngredients;
  action: () => void;
  actionLabel?: string;
}

export default function RecipeRow(props: RecipeRowProps) {
  const locale = useLocale();
  const t = useTranslations('Planner');
  const title = useMemo(() => {
    if (locale === 'en') {
      return props.recipe.title_en;
    } else {
      return props.recipe.title_pt;
    }
  }, [props.recipe, locale]);
  const cookTimeMinutes = props.recipe.estimated_cook_time_s / 60;

  return (
    <div className='rounded-2xl border border-neutral-200 p-3'>
      <div className='flex items-start justify-between gap-2'>
        <div className='min-w-0'>
          <p className='truncate text-sm font-medium text-neutral-900'>
            {title}
          </p>
          <p className='mt-0.5 text-xs text-neutral-500'>
            ~{Math.round(props.recipe.kcal_per_serving)} kcal •{' '}
            {Math.round(props.recipe.protein_g_per_serving)}g P •{' '}
            {cookTimeMinutes} min
          </p>
          <div className='mt-1 flex flex-wrap gap-1'>
            {props.recipe.tags.map((tagObject) => {
              const localizedTag =
                locale === 'en' ? tagObject.slug_en : tagObject.slug_pt;

              return (
                <span
                  key={tagObject.slug}
                  className='rounded-lg border border-neutral-200 px-2 py-0.5 text-[11px] text-neutral-600'
                >
                  {localizedTag}
                </span>
              );
            })}
          </div>
        </div>
        <Button variant='primary' onClick={props.action} className='shrink-0'>
          {props.actionLabel ?? t('actions.add')}
        </Button>
      </div>
    </div>
  );
}
