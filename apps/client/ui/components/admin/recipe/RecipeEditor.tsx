'use client';

import { useState } from 'react';
import { RecipeSchemaTypeWithTagsAndIngredients } from '@emagrecer/storage';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/ui/components/Button';
import { Tab, TabList, TabPanel, Tabs } from 'react-aria-components';
import { cloneDeep } from 'lodash';
import Markdown from 'react-markdown';
import deleteRecipeAction from '@/lib/actions/recipe/delete.action';
import { useRouter } from 'next/navigation';

interface RecipeProps {
  recipe: RecipeSchemaTypeWithTagsAndIngredients;
}

type RecipeSetter = (
  recipe: RecipeSchemaTypeWithTagsAndIngredients,
) => RecipeSchemaTypeWithTagsAndIngredients;
interface TabContentProps {
  locale: 'en' | 'pt';
  recipe: RecipeSchemaTypeWithTagsAndIngredients;
  setRecipe: (setter: RecipeSetter) => void;
}
function TabContent(props: TabContentProps) {
  const t = useTranslations('Admin.recipes');
  const panelId = `${props.locale}Tab`;
  const markdownId = `${props.locale}Markdown`;
  const titleKey = props.locale === 'en' ? 'title_en' : 'title_pt';
  const markdownKey = props.locale === 'en' ? 'instructions_md_en' : 'instructions_md_pt';
  return (
    <TabPanel id={panelId}>
      <label className='text-xs text-neutral-500'>
        {t('title_label')}
        <input
          className='mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm'
          type='text'
          value={props.recipe[titleKey]}
          onChange={(e) => {
            props.setRecipe((recipe) => ({
              ...recipe,
              [titleKey]: e.target.value,
            }));
          }}
        />
      </label>
      <label htmlFor={markdownId}>{t('markdown_label')}</label>
      <div className='grid grid-cols-2 gap-2.5'>
        <div>
          <h2 className='text-lg font-medium'>{t('edit_markdown_label')}</h2>
          <textarea
          id={markdownId}
          value={props.recipe[markdownKey] ?? ''}
          onChange={(e) => {
            props.setRecipe((recipe) => ({
              ...recipe,
              [markdownKey]: e.target.value,
            }));
          }}
          className='mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm'
          rows={10}
          />
        </div>
        <div>
          <h2 className='text-lg font-medium'>{t('preview_markdown_label')}</h2>
          <Markdown>
            {props.recipe[markdownKey] ?? ''}
          </Markdown>
        </div>
      </div>
    </TabPanel>
  );
}

export default function RecipeEditor(props: RecipeProps) {
  const [recipe, setRecipe] = useState<RecipeSchemaTypeWithTagsAndIngredients>(
    cloneDeep(props.recipe),
  );
  const t = useTranslations('Admin.recipes');
  const router = useRouter();
  const locale = useLocale();
  //NOTE: We don't directly edit or set the nutritional values, they are calculated as ingredients are added or removed.
  const removeRecipe = () => {
    deleteRecipeAction(recipe.id).then(() => {
      router.push(`/${locale}/admin/recipes`);
    })
  }
  const saveRecipe = () => {}
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>{t('edit_recipe_label')}</h2>
        <div className='flex gap-2'>
          <Button variant='outline' onClick={removeRecipe}>
            {t('delete_recipe_label')}
          </Button>
          <Button variant='primary' onClick={saveRecipe}>
            {t('save_recipe_label')}
          </Button>
        </div>
      </div>

      <Tabs className='rounded-2xl border p-4'>
        <TabList>
          <Tab aria-label={t('english_tab_label')} id='enTab'>
            <span className='text-sm font-medium'>
              {t('english_tab_label')}
            </span>
          </Tab>
          <Tab id='ptTab' aria-label={t('portuguese_tab_label')}>
            <span className='text-sm font-medium'>
              {t('portuguese_tab_label')}
            </span>
          </Tab>
        </TabList>
        <TabContent locale={'en'} recipe={recipe} setRecipe={setRecipe} />
        <TabContent locale={'pt'} recipe={recipe} setRecipe={setRecipe} />
      </Tabs>
    </div>
  );
}
