import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/tools/", label: "Calculators" },
  { href: "/knots/", label: "Knots" },
  { href: "/navigation/", label: "Navigation" },
  { href: "/wind-waves/", label: "Wind & Waves" },
  { href: "/maritime-measurements/", label: "Measurements" },
  { href: "/sailing/", label: "Sailing" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur">
      <div className="container-wide flex items-center justify-between h-14">
        <Link
          href="/"
          className="font-semibold text-slate-900 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
        >
          OceanCalc
        </Link>
        <nav aria-label="Main navigation" className="flex items-center gap-1 sm:gap-2">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
