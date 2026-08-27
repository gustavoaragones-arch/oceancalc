import Link from "next/link";
import { organization } from "@/config/siteOwner";

const footerLinks = [
  { href: "/tools/", label: "All Calculators" },
  { href: "/privacy/", label: "Privacy Policy" },
  { href: "/terms/", label: "Terms" },
  { href: "/disclaimer/", label: "Disclaimer" },
  { href: "/cookies/", label: "Cookies" },
  { href: "/affiliate/", label: "Affiliate Disclosure" },
] as const;

export function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 dark:border-slate-700 bg-gray-50/80 dark:bg-slate-900/40">
      <div className="container-wide py-10">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-slate-500">
          {footerLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-sm mb-4 mt-6 text-gray-500 dark:text-slate-500">
          <Link href="/about/" className="hover:underline">
            About
          </Link>

          <Link href="/contact/" className="hover:underline">
            Contact
          </Link>

          <Link href="/editorial-policy/" className="hover:underline">
            Editorial Policy
          </Link>

          <Link href="/privacy/" className="hover:underline">
            Privacy Policy
          </Link>
        </div>
        <p className="text-center text-sm text-gray-500 dark:text-slate-500 mt-5 max-w-2xl mx-auto leading-relaxed">
          © {new Date().getFullYear()} OceanCalc. Maritime calculators and navigation reference.
        </p>
        <p className="text-center text-sm text-gray-500 dark:text-slate-500 mt-3 max-w-2xl mx-auto leading-relaxed">
          Developed and operated by{" "}
          <a
            href={organization.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 underline-offset-2 hover:underline transition-colors"
          >
            {organization.name}
          </a>
          . {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
