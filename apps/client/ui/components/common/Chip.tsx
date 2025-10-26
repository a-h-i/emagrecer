import clsx from 'clsx';

interface ChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
  togglable?: boolean;
}

export default function Chip({ label, active, onClick, togglable }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={clsx('rounded-md p-2 text-xs', {
        'bg-neutral-900 text-white': active,
        'cursor-pointer border border-neutral-200 text-neutral-700 hover:bg-neutral-50':
          !active,
        'cursor-pointer': togglable,
        'hover:bg-neutral-700': active && togglable,
      })}
    >
      {label}
    </button>
  );
}
