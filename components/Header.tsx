import Link from "next/link";
import Image from "next/image";

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
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-all duration-200">
      <div className="container-wide flex items-center justify-between min-h-16">
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/logo.png"
            alt="OceanCalc"
            width={140}
            height={40}
            priority
            className="h-9 w-auto"
          />
        </Link>
        <nav aria-label="Main navigation" className="flex items-center gap-0.5 sm:gap-1 flex-wrap justify-end">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 px-2.5 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800/80 transition-all duration-200 ease-in-out"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
