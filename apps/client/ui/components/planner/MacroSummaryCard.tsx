import clsx from 'clsx';
import { useFormatter } from 'next-intl';

interface MacroMetric {
  label: string;
  value: number;
  target?: number;
  unit: string;
}

interface MacroSummaryCardProps {
  metrics: MacroMetric[];
  title: string;
  className?: string;
}

function MacroMetric(props: MacroMetric) {
  const format = useFormatter();
  const value =
    format.number(props.value, { style: 'decimal' }) + ' ' + props.unit;
  const target = props.target
    ? format.number(props.target, { style: 'decimal' }) + ' ' + props.unit
    : null;
  const pct = props.target
    ? Math.max(0, Math.min(100, (props.value / props.target) * 100))
    : null;
  const remaining = props.target ? props.target - props.value : null;
  const formattedRemaining = remaining
    ? format.number(Math.abs(remaining), { style: 'decimal' }) +
      ' ' +
      props.unit
    : null;

  return (
    <div>
      <div className='flex items-baseline justify-between'>
        <span className='text-sm text-neutral-600'>{props.label}</span>
        <span className='text-sm font-medium text-neutral-900'>
          {value}
          {target ? (
            <span className='text-neutral-500'> / {target}</span>
          ) : null}
        </span>
      </div>
      {target && (
        <>
          <div className='mt-1 h-2 w-full rounded-full bg-neutral-100'>
            <div
              className={`h-2 rounded-full ${remaining! < 0 ? 'bg-red-500' : 'bg-neutral-900'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className='mt-1 text-xs text-neutral-500'>
            {remaining! >= 0
              ? `+ ${formattedRemaining}`
              : `${formattedRemaining} over`}
          </div>
        </>
      )}
    </div>
  );
}

export default function MacroSummaryCard(props: MacroSummaryCardProps) {
  return (
    <div
      className={clsx(
        'rounded-2xl border border-neutral-200 p-4',
        props.className,
      )}
    >
      <div className='mt-3 space-y-2'>
        {props.metrics.map((metric, index) => (
          <MacroMetric key={index} {...metric} />
        ))}
      </div>
    </div>
  );
}
