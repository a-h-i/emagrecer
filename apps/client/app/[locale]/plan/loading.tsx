import PlanGridSkeleton from '@/ui/components/planner/PlanGrid/PlanGridSkeleton';

export default function Loading() {
  return (
    <main className='mx-auto max-w-6xl px-4 py-6 md:py-10'>
      <div className='mb-4 h-7 w-48 animate-pulse rounded bg-neutral-200' />
      <PlanGridSkeleton />
    </main>
  );
}
