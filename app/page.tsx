import Link from "next/link";

const SECTIONS = [
  {
    title: "Maritime Calculators",
    description: "Convert units, compute distances, and plan passages with nautical tools.",
    href: "/tools/",
  },
  {
    title: "Sailing Knots Library",
    description: "Step-by-step tutorials for essential sailing and boating knots.",
    href: "/knots/",
  },
  {
    title: "Navigation Fundamentals",
    description: "Piloting, dead reckoning, and coastal navigation.",
    href: "/navigation/",
  },
  {
    title: "Wind & Wave Science",
    description: "Beaufort scale, apparent wind, and sea state reference.",
    href: "/wind-waves/",
  },
  {
    title: "Maritime Measurements",
    description: "Nautical miles, fathoms, knots, and conversion tables.",
    href: "/maritime-measurements/",
  },
  {
    title: "Tools for Sailors",
    description: "Anchoring, passage planning, and onboard calculations.",
    href: "/sailing/",
  },
];

export default function HomePage() {
  return (
    <div className="container-wide py-12 sm:py-16">
      <section className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
          Maritime Calculators &amp; Navigation Tools
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400">
          Free nautical calculators, sailing navigation reference, and maritime measurement tools. Built for sailors, mariners, and anyone who works on the water.
        </p>
      </section>

      <nav
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        aria-label="Site sections"
      >
        {SECTIONS.map(({ title, description, href }) => (
          <Link
            key={href}
            href={href}
            className="card block hover:border-sky-500 dark:hover:border-sky-500 transition-colors group"
          >
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              {title}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              {description}
            </p>
            <span className="inline-block mt-3 text-sm font-medium text-sky-600 dark:text-sky-400">
              Explore →
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
