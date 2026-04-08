type Props = {
  points: string[];
};

/**
 * AEO: structured bullet summary for AI extraction.
 */
export default function KeyTakeaways({ points }: Props) {
  if (points.length === 0) return null;
  return (
    <section
      className="mt-8"
      aria-labelledby="key-takeaways-heading"
    >
      <h2
        id="key-takeaways-heading"
        className="text-lg font-semibold text-gray-900 dark:text-slate-100"
      >
        Key takeaways
      </h2>
      <ul className="mt-2 list-disc pl-5 text-sm text-gray-700 dark:text-slate-300 space-y-1.5 leading-relaxed">
        {points.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    </section>
  );
}
