
interface FAQQuestionProps {
  summary: string;
  body: string;
}


export default function FAQQuestion({summary, body}: FAQQuestionProps) {
  return (
    <details className="px-5 py-4">
      <summary className="cursor-pointer list-none text-base font-medium">{summary}</summary>
      <p className="mt-2 text-sm text-neutral-600">{body}</p>
    </details>
  );
}