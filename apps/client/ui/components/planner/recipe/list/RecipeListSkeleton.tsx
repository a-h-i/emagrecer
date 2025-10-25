export default function RecipeListSkeleton() {
  return (
    <div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className='rounded-2xl border border-neutral-200 p-3'>
          <div className='h-4 w-48 animate-pulse rounded bg-neutral-200' />
          <div className='mt-2 h-3 w-40 animate-pulse rounded bg-neutral-200' />
          <div className='mt-3 h-8 w-20 animate-pulse rounded bg-neutral-200' />
        </div>
      ))}
    </div>
  );
}
