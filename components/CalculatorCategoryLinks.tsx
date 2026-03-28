import Link from "next/link";

const CATEGORY_HUB: Record<string, { href: string; label: string }> = {
  navigation: { href: "/navigation/", label: "navigation articles" },
  "wind-waves": { href: "/wind-waves/", label: "wind & waves guides" },
  "maritime-measurements": {
    href: "/maritime-measurements/",
    label: "measurement guides",
  },
  sailing: { href: "/sailing/", label: "sailing guides" },
  conversions: { href: "/tools/", label: "converter tools" },
  "sailing-performance": { href: "/sailing/", label: "sailing performance" },
};

export function CalculatorCategoryLinks({ category }: { category: string }) {
  const hub = CATEGORY_HUB[category];
  return (
    <section
      className="card mt-8"
      aria-labelledby="calc-category-links-heading"
    >
      <h2 id="calc-category-links-heading" className="heading-section">
        Explore more
      </h2>
      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        {hub ? (
          <>
            <Link
              href={hub.href}
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              {hub.label}
            </Link>
            {" · "}
          </>
        ) : null}
        <Link
          href="/tools/"
          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          All maritime calculators
        </Link>
      </p>
    </section>
  );
}
