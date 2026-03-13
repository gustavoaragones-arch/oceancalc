import Link from "next/link";
import { organization } from "@/config/siteOwner";

const footerLinks = [
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
  { href: "/privacy/", label: "Privacy Policy" },
  { href: "/terms/", label: "Terms" },
  { href: "/disclaimer/", label: "Disclaimer" },
  { href: "/cookies/", label: "Cookies" },
  { href: "/affiliate/", label: "Affiliate Disclosure" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 mt-auto">
      <div className="container-wide py-8">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
          {footerLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
        <p className="text-center text-sm text-slate-500 dark:text-slate-500 mt-4 max-w-2xl mx-auto">
          © {new Date().getFullYear()} OceanCalc. Maritime calculators and navigation reference.
        </p>
        <p className="text-center text-sm text-slate-500 dark:text-slate-500 mt-2 max-w-2xl mx-auto">
          OceanCalc is a maritime tools and navigation reference platform developed and operated by{" "}
          <a
            href={organization.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 dark:text-slate-400 hover:underline"
          >
            {organization.name}
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
