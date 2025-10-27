import { MealType } from '@emagrecer/storage';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';

interface AddRecipePopoverProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: AddRecipeFormData) => void;
}

const addRecipeSchema = z
  .object({
    day: z.number().min(0).max(6),
    mealType: z.enum(MealType),
    servings: z.number().min(1).max(100),
  })
  .strict();

export type AddRecipeFormData = z.infer<typeof addRecipeSchema>;
export default function AddRecipePopover(props: AddRecipePopoverProps) {
  const t = useTranslations('Planner');
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(addRecipeSchema),
  });

  return (
    <div
      role='dialog'
      aria-modal='true'
      aria-labelledby='add-recipe-popover-title'
      className={clsx(
        'fixed inset-0 z-50 flex items-end bg-black/20 transition-all ease-in sm:items-center',
        {
          'pointer-events-none opacity-0': !props.open,
        },
      )}
      onClick={props.onClose}
    >
      <div
        className='mx-auto w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-4 shadow-xl'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center justify-between'>
          <h4
            className='text-sm font-medium text-neutral-900'
            id='add-recipe-popover-title'
          >
            {t('addRecipePopover.title')}
          </h4>
          <button
            onClick={props.onClose}
            className='rounded-lg p-2 text-neutral-500 hover:bg-neutral-100'
            aria-label='Close'
          >
            <X width={16} height={16} />
          </button>
        </div>

        <form
          className='mt-3 grid grid-cols-2 gap-3'
          onSubmit={handleSubmit(props.onConfirm)}
        >
          <div>
            <label
              htmlFor='daySelector'
              className='mb-1 block text-xs text-neutral-500'
            >
              {t('addRecipePopover.day')}
            </label>
            <select
              id='daySelector'
              {...register('day')}
              className='w-full rounded-lg border border-neutral-200 px-2 py-2 text-sm'
            >
              <option aria-label={t('daysFull.Monday')} value={0}>
                {t('daysFull.Monday')}
              </option>
              <option aria-label={t('daysFull.Tuesday')} value={1}>
                {t('daysFull.Tuesday')}
              </option>
              <option aria-label={t('daysFull.Wednesday')} value={2}>
                {t('daysFull.Wednesday')}
              </option>
              <option aria-label={t('daysFull.Thursday')} value={3}>
                {t('daysFull.Thursday')}
              </option>
              <option aria-label={t('daysFull.Friday')} value={4}>
                {t('daysFull.Friday')}
              </option>
              <option aria-label={t('daysFull.Saturday')} value={5}>
                {t('daysFull.Saturday')}
              </option>
              <option aria-label={t('daysFull.Sunday')} value={6}>
                {t('daysFull.Sunday')}
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor='mealTypeSelector'
              className='mb-1 block text-xs text-neutral-500'
            >
              {t('addRecipePopover.mealType')}
            </label>
            <select
              id='mealTypeSelector'
              {...register('mealType')}
              className='w-full rounded-lg border border-neutral-200 px-2 py-2 text-sm'
            >
              <option
                aria-label={t('meals.breakfast')}
                value={MealType.BREAKFAST}
              >
                {t('meals.breakfast')}
              </option>
              <option aria-label={t('meals.lunch')} value={MealType.LUNCH}>
                {t('meals.lunch')}
              </option>
              <option aria-label={t('meals.dinner')} value={MealType.DINNER}>
                {t('meals.dinner')}
              </option>
              <option aria-label={t('meals.snack')} value={MealType.SNACK}>
                {t('meals.snack')}
              </option>
              <option aria-label={t('meals.dessert')} value={MealType.DESSERT}>
                {t('meals.dessert')}
              </option>
            </select>
          </div>

          <div className='col-span-2'>
            <label
              htmlFor='numServings'
              className='mb-1 block text-xs text-neutral-500'
            >
              {t('addRecipePopover.servings')}
            </label>
            <input id='numServings' {...register('servings')} />
          </div>
        </form>
      </div>
    </div>
  );
}
