import clsx from 'clsx';

interface ChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export default function Chip({ label, active, onClick }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'rounded-md p-2 text-xs',
        {
          'bg-neutral-900 text-white': active,
          'border border-neutral-200 text-neutral-700 hover:bg-neutral-50 cursor-pointer': !active,
        }
      )}
    >
      {label}
    </button>
  );
}
