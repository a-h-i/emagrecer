

interface StepProps {
  title: string;
  description: string;
  icon: 'goals' | 'calendar' | 'cart';
}


export default function Step({title, description, icon}: StepProps) {
  return (
    <div className="rounded-2xl border p-5">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100">
        {icon === "goals" && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
        )}
        {icon === "calendar" && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
        )}
        {icon === "cart" && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 6h15l-1.5 9h-12z"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg>
        )}
      </div>
      <div className="text-base font-medium">{title}</div>
      <p className="mt-1 text-sm text-neutral-600">{description}</p>
    </div>
  );
}