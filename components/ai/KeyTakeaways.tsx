import type { KeyTakeawayBullet } from "@/lib/aeo";

type Props = {
  items: KeyTakeawayBullet[];
};

/**
 * AEO: entity — definition bullets for AI / Google entity parsing.
 */
export default function KeyTakeaways({ items }: Props) {
  if (items.length === 0) return null;
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
      <ul className="mt-2 space-y-2 text-sm list-none p-0 m-0 leading-relaxed">
        {items.map((item, i) => (
          <li key={i} className="text-gray-700 dark:text-slate-300">
            <strong className="text-gray-900 dark:text-slate-100">{item.entity}</strong>
            {" — "}
            {item.definition}
          </li>
        ))}
      </ul>
    </section>
  );
}
