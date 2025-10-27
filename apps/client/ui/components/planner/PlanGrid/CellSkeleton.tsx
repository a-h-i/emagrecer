import Skeleton from '@/ui/components/common/Skeleton';

export function CellSkeleton() {
  return (
    <div className='min-h-24 border-t border-neutral-100 p-2'>
      <div className='h-full rounded-xl border border-neutral-200 p-2'>
        <div className='flex items-start justify-between gap-2'>
          <div className='min-w-0 flex-1 space-y-1'>
            <Skeleton className='h-4 w-40 rounded' />
            <Skeleton className='h-3 w-24 rounded' />
          </div>
          <Skeleton className='h-6 w-6 rounded-lg' />
        </div>
        <div className='mt-2 flex items-center justify-between'>
          <div className='inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-1 py-1'>
            <Skeleton className='h-6 w-6 rounded' />
            <Skeleton className='h-6 w-10 rounded' />
            <Skeleton className='h-6 w-6 rounded' />
          </div>
          <Skeleton className='h-4 w-20 rounded' />
        </div>
      </div>
    </div>
  );
}
