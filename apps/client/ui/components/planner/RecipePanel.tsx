'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useAppSelector } from '@/lib/redux/hooks';
import { selectPlan } from '@/lib/redux/plan/plan-slice';
import { RecipeFilters, RecipeSort } from '@emagrecer/control';
import { useMemo, useState } from 'react';
import { debounce } from 'lodash';
import Chip from '@/ui/components/common/Chip';

export default function RecipePanel() {
  const t = useTranslations('Planner');
  const locale = useLocale();
  const plan = useAppSelector(selectPlan);
  const [searchFilters, setSearchFilters] = useState<RecipeFilters>({
    locale: locale as RecipeFilters['locale'],
    query: '',
    sort: RecipeSort.TIME,
    sort_direction: 'ASC',
  });
  const debouncedQuery = useMemo(() => {
    return debounce((query: string) => {
      setSearchFilters((prev) => {
        return {
          ...prev,
          query,
        };
      });
    }, 300);
  }, [setSearchFilters]);

  return (
    <aside className='rounded-2xl border border-neutral-200 p-4'>
      <h3 className='text-sm font-medium text-neutral-900'>
        {t('panel.title')}
      </h3>
      <div className='mt-3'>
        <input
          name='query'
          type='text'
          placeholder={t('panel.searchPlaceholder')}
          className='w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900/40'
          aria-label={t('panel.searchPlaceholder')}
          value={searchFilters.query}
          onChange={(e) => {
            debouncedQuery(e.target.value);
          }}
        />
        <div className='mt-3 flex flex-col gap-2 p-1'>
          <label className='text-sm font-medium text-neutral-900'>
            {t('panel.sort_label')}
          </label>
          <div className='flex items-center gap-2'>
            <Chip
              label={t('panel.sorts.preparation_time')}
              active={searchFilters.sort === RecipeSort.TIME}
              onClick={() => {
                setSearchFilters((prev) => {
                  return {
                    ...prev,
                    sort: RecipeSort.TIME,
                    sort_direction: 'ASC',
                  };
                });
              }}
            />

            <Chip
              label={t('panel.sorts.high_protein')}
              active={searchFilters.sort === RecipeSort.PROTEIN}
              onClick={() => {
                setSearchFilters((prev) => {
                  return {
                    ...prev,
                    sort: RecipeSort.PROTEIN,
                    sort_direction: 'DESC',
                  };
                });
              }}
            />
            <Chip
              label={t('panel.sorts.low_carbs')}
              active={searchFilters.sort === RecipeSort.CARBS}
              onClick={() => {
                setSearchFilters((prev) => {
                  return {
                    ...prev,
                    sort: RecipeSort.CARBS,
                    sort_direction: 'ASC',
                  };
                });
              }}
            />

            <Chip
              label={t('panel.sorts.low_fat')}
              active={searchFilters.sort === RecipeSort.FAT}
              onClick={() => {
                setSearchFilters((prev) => {
                  return {
                    ...prev,
                    sort: RecipeSort.FAT,
                    sort_direction: 'ASC',
                  };
                });
              }}
            />

          </div>
        </div>
      </div>
    </aside>
  );
}
