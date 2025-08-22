interface CardProps {
  title: string;
  description: string;
}



export default function Card({title, description}: CardProps) {
  return (
    <div className="rounded-2xl border p-5">
      <div className="text-base font-medium">{title}</div>
      <p className="mt-1 text-sm text-neutral-600">{description}</p>
    </div>
  );
}