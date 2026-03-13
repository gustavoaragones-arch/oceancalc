import Link from "next/link";
import { getKnots } from "@/lib/contentLoader";

export const metadata = {
  title: "Sailing Knots Library | OceanCalc",
  description:
    "Step-by-step tutorials for essential sailing and boating knots. Bowline, cleat hitch, clove hitch, and more.",
  alternates: { canonical: "https://oceancalc.com/knots/" },
  openGraph: {
    title: "Sailing Knots Library | OceanCalc",
    description: "Tutorials for essential sailing and boating knots.",
    url: "https://oceancalc.com/knots/",
  },
};

export default function KnotsHubPage() {
  const knots = getKnots();
  return (
    <div className="container-wide py-8">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Sailing Knots Library
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
          Step-by-step guides for the knots every sailor needs: docking, mooring, sail trim, and safety.
        </p>
      </header>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0 m-0">
        {knots.map((knot) => (
          <li key={knot.slug}>
            <Link
              href={`/knots/${knot.slug}/`}
              className="card block hover:border-sky-500 dark:hover:border-sky-500 transition-colors group h-full"
            >
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                {knot.name}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Difficulty: {knot.difficulty} · {knot.uses.slice(0, 2).join(", ")}
              </p>
              <span className="inline-block mt-3 text-sm font-medium text-sky-600 dark:text-sky-400">
                Learn how to tie →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
