import { MealType } from '@emagrecer/storage';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { Button } from '@/ui/components/Button';

interface AddRecipePopoverProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: AddRecipeFormData) => void;
}

const addRecipeSchema = z
  .object({
    day: z.coerce.number().min(0).max(6),
    mealType: z.enum(MealType),
    servings: z.coerce.number().min(1).max(100),
  })
  .strict();

export type AddRecipeFormData = z.infer<typeof addRecipeSchema>;
export default function AddRecipePopover(props: AddRecipePopoverProps) {
  const t = useTranslations('Planner');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addRecipeSchema),
    mode: 'all',
    reValidateMode: 'onChange',
  });

  return (
    <div
      role='dialog'
      aria-modal='true'
      aria-labelledby='add-recipe-popover-title'
      className={clsx(
        'fixed inset-0 z-50 flex items-end bg-black/35 transition-all ease-in sm:items-center',
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
            className='cursor-pointer rounded-lg p-2 text-neutral-500 hover:bg-neutral-100'
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
              <option aria-label={t('daysFull.0')} value={0}>
                {t('daysFull.0')}
              </option>
              <option aria-label={t('daysFull.1')} value={1}>
                {t('daysFull.1')}
              </option>
              <option aria-label={t('daysFull.2')} value={2}>
                {t('daysFull.2')}
              </option>
              <option aria-label={t('daysFull.3')} value={3}>
                {t('daysFull.3')}
              </option>
              <option aria-label={t('daysFull.4')} value={4}>
                {t('daysFull.4')}
              </option>
              <option aria-label={t('daysFull.5')} value={5}>
                {t('daysFull.5')}
              </option>
              <option aria-label={t('daysFull.6')} value={6}>
                {t('daysFull.6')}
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
            <input
              id='numServings'
              {...register('servings')}
              className='w-full rounded-lg border border-neutral-200 px-2 py-2 text-sm'
              placeholder={t('addRecipePopover.servings')}
            />
            {errors.servings && (
              <div className='text-danger mt-1 text-xs'>
                {errors.servings.message}
              </div>
            )}
          </div>

          <Button variant={'primary'} type='submit' className='col-span-2'>
            {t('addRecipePopover.submit')}
          </Button>
        </form>
      </div>
    </div>
  );
}
