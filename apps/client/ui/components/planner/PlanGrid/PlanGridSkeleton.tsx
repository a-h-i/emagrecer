import Skeleton from '@/ui/components/common/Skeleton';
import { CellSkeleton } from '@/ui/components/planner/PlanGrid/CellSkeleton';

export default function PlanGridSkeleton() {
  return (
    <div className='overflow-x-auto rounded-2xl border border-neutral-200'>
      <div className='grid min-w-[760px] grid-cols-[140px_repeat(7,1fr)]'>
        {/* Header row */}
        <div className='sticky left-0 z-10 bg-neutral-50/70 p-3' />
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={`h-${i}`} className='p-3'>
            <Skeleton className='mx-auto h-6 w-16 rounded-lg' />
          </div>
        ))}

        {/* 4 meal rows */}
        {Array.from({ length: 4 }).map((_, row) => (
          <RowSkeleton key={`r-${row}`} />
        ))}
      </div>
    </div>
  );
}

function RowSkeleton() {
  return (
    <>
      {/* sticky meal label */}
      <div className='sticky left-0 z-10 bg-white p-3'>
        <Skeleton className='h-5 w-28 rounded-lg' />
      </div>
      {/* 7-day cells */}
      {Array.from({ length: 7 }).map((_, i) => (
        <CellSkeleton key={`c-${i}`} />
      ))}
    </>
  );
}
