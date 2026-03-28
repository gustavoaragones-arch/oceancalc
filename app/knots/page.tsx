import Link from "next/link";
import { getKnots } from "@/lib/contentLoader";
import { generateMetadata as buildSeoMetadata } from "@/lib/seo";
import { getBuildLastModified } from "@/lib/indexing";

export const metadata = buildSeoMetadata({
  title: "Sailing Knots Library",
  description:
    "Step-by-step tutorials for essential sailing and boating knots. Bowline, cleat hitch, clove hitch, and more.",
  path: "/knots/",
  lastModified: getBuildLastModified(),
});

export default function KnotsHubPage() {
  const knots = getKnots();
  return (
    <div className="container-wide py-8">
      <header className="mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-3 text-balance">
          Sailing Knots Library
        </h1>
        <p className="text-lg text-gray-600 dark:text-slate-400 max-w-2xl leading-relaxed text-balance">
          Step-by-step guides for the knots every sailor needs: docking, mooring, sail trim, and safety.
        </p>
      </header>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0">
        {knots.map((knot) => (
          <li key={knot.slug}>
            <Link
              href={`/knots/${knot.slug}/`}
              className="card block group h-full"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                {knot.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-slate-400 mt-2 leading-relaxed">
                Difficulty: {knot.difficulty} · {knot.uses.slice(0, 2).join(", ")}
              </p>
              <span className="inline-block mt-4 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform duration-200">
                Learn how to tie →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
