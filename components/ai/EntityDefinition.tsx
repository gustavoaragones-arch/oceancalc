type Props = {
  term: string;
  definition: string;
};

/**
 * AEO: explicit entity anchor for AI / semantic extraction.
 */
export default function EntityDefinition({ term, definition }: Props) {
  return (
    <div
      className="p-4 rounded-xl border border-blue-200 dark:border-blue-800/80 bg-blue-50 dark:bg-blue-950/40"
      itemScope
      itemType="https://schema.org/DefinedTerm"
    >
      <h3
        className="font-semibold text-blue-900 dark:text-blue-200"
        itemProp="name"
      >
        {term}
      </h3>
      <p
        className="text-sm text-blue-800 dark:text-blue-100/90 mt-1 leading-relaxed"
        itemProp="description"
      >
        {definition}
      </p>
    </div>
  );
}
