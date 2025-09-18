import Skeleton from '@/ui/components/common/Skeleton';


export default function PlanGridSkeleton() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-200">
      <div className="grid min-w-[760px] grid-cols-[140px_repeat(7,1fr)]">
        {/* Header row */}
        <div className="sticky left-0 z-10 bg-neutral-50/70 p-3" />
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={`h-${i}`} className="p-3">
            <Skeleton className="mx-auto h-6 w-16 rounded-lg" />
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
      <div className="sticky left-0 z-10 bg-white p-3">
        <Skeleton className="h-5 w-28 rounded-lg" />
      </div>
      {/* 7 day cells */}
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="min-h-24 border-t border-neutral-100 p-2">
          <div className="h-full rounded-xl border border-neutral-200 p-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1 space-y-1">
                <Skeleton className="h-4 w-40 rounded" />
                <Skeleton className="h-3 w-24 rounded" />
              </div>
              <Skeleton className="h-6 w-6 rounded-lg" />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-1 py-1">
                <Skeleton className="h-6 w-6 rounded" />
                <Skeleton className="h-6 w-10 rounded" />
                <Skeleton className="h-6 w-6 rounded" />
              </div>
              <Skeleton className="h-4 w-20 rounded" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}