import clsx from 'clsx';


export default function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={clsx('animate-pulse bg-neutral-200/70 ', className)}
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(255,255,255,.5) 50%, rgba(0,0,0,0) 100%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.2s ease-in-out infinite"
      }}
    />
  );
}
