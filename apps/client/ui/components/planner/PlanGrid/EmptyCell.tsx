import { useTranslations } from 'next-intl';
import clsx from 'clsx';

interface EmptyCellProps {
  onRecipeAdd: () => void;
}

export function EmptyCell(props: EmptyCellProps) {
  const t = useTranslations('Planner');

  return (
    <button
      onClick={props.onRecipeAdd}
      className={clsx(
        'flex w-full items-center justify-center rounded-xl border border-dashed border-neutral-300',
        'cursor-pointer px-3 py-6 text-neutral-500 hover:border-neutral-400 hover:bg-neutral-50',
      )}
      title={t('slot.empty')}
    >
      <svg
        width='16'
        height='16'
        viewBox='0 0 24 24'
        aria-hidden
        className='mr-2'
      >
        <path
          d='M12 5v14M5 12h14'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
        />
      </svg>
      {t('slot.empty')}
    </button>
  );
}
