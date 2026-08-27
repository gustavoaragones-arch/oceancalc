import Link from "next/link";
import { generateMetadata as buildSeoMetadata } from "@/lib/seo";
import {
  IconCalculators,
  IconKnots,
  IconNavigation,
  IconWind,
  IconMeasurements,
  IconSailing,
} from "@/components/icons/SectionIcons";
import { MostUsedMaritimeCalculators } from "@/components/MostUsedMaritimeCalculators";
import {
  RECENTLY_UPDATED_TOOLS,
  RECENTLY_UPDATED_LABELS,
} from "@/lib/freshness";
import ClusterHub from "@/components/ClusterHub";

export const metadata = buildSeoMetadata({
  title: "Maritime Calculators & Navigation Tools",
  description:
    "Free maritime calculators, sailing tools, and navigation resources for professionals and enthusiasts.",
  path: "/",
});

const SECTIONS = [
  {
    title: "Maritime Calculators",
    description: "Convert units, compute distances, and plan passages with nautical tools.",
    href: "/tools/",
    Icon: IconCalculators,
  },
  {
    title: "Sailing Knots Library",
    description: "Step-by-step tutorials for essential sailing and boating knots.",
    href: "/knots/",
    Icon: IconKnots,
  },
  {
    title: "Navigation Fundamentals",
    description: "Piloting, dead reckoning, and coastal navigation.",
    href: "/navigation/",
    Icon: IconNavigation,
  },
  {
    title: "Wind & Wave Science",
    description: "Beaufort scale, apparent wind, and sea state reference.",
    href: "/wind-waves/",
    Icon: IconWind,
  },
  {
    title: "Maritime Measurements",
    description: "Nautical miles, fathoms, knots, and conversion tables.",
    href: "/maritime-measurements/",
    Icon: IconMeasurements,
  },
  {
    title: "Tools for Sailors",
    description: "Anchoring, passage planning, and onboard calculations.",
    href: "/sailing/",
    Icon: IconSailing,
  },
] as const;

export default function HomePage() {
  return (
    <div>
      <section
        className="relative border-b border-gray-100 dark:border-slate-800 overflow-hidden"
        style={{
          backgroundImage: "url('/oceancalc-background.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* overlay so text stays readable */}
        <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/80" aria-hidden="true" />
        <div className="relative container-wide py-16 sm:py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white max-w-3xl mx-auto text-balance">
            Maritime Calculators &amp; Navigation Tools
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-gray-600 dark:text-slate-400 leading-relaxed max-w-3xl mx-auto text-balance">
            Free nautical calculators, sailing navigation reference, and maritime measurement tools. Built for sailors, mariners, and anyone who works on the water.
          </p>
          <Link href="/tools/" className="btn-primary mt-8">
            Explore Calculators
          </Link>
        </div>
      </section>

      <div className="container-wide py-12 sm:py-16">
        <nav
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          aria-label="Site sections"
        >
          {SECTIONS.map(({ title, description, href, Icon }) => (
            <Link
              key={href}
              href={href}
              className="card block group"
            >
              <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-3 transition-transform duration-200 group-hover:scale-110" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                {title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-slate-400 mt-2 leading-relaxed">
                {description}
              </p>
              <span className="inline-block mt-4 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform duration-200">
                Explore →
              </span>
            </Link>
          ))}
        </nav>

        <MostUsedMaritimeCalculators />

        <section className="max-w-5xl mx-auto px-4 mt-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-slate-100">
            Recently Updated Calculators
          </h2>

          <ul className="grid md:grid-cols-2 gap-2 text-sm list-none p-0 m-0 text-gray-700 dark:text-slate-300">
            {RECENTLY_UPDATED_TOOLS.slice(0, 8).map((slug) => (
              <li key={slug}>
                <Link
                  href={`/tools/${slug}/`}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {RECENTLY_UPDATED_LABELS[slug] ?? slug}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <ClusterHub />
      </div>
    </div>
  );
}
