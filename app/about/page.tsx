import Link from "next/link";
import { organization } from "@/config/siteOwner";

export const metadata = {
  title: "About",
  description: `About OceanCalc — maritime calculators and navigation reference. Built by ${organization.name}.`,
  openGraph: {
    title: "About | OceanCalc",
    description: `OceanCalc is an independent maritime tools platform built by ${organization.name}.`,
  },
};

export default function AboutPage() {
  return (
    <div className="container-narrow py-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
        About OceanCalc
      </h1>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <p className="text-slate-700 dark:text-slate-300">
          OceanCalc is an independent maritime tools and navigation reference platform built by{" "}
          <a
            href={organization.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-600 dark:text-sky-400 hover:underline"
          >
            {organization.name}
          </a>
          , a digital product studio focused on creating useful web tools and educational platforms.
        </p>

        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mt-8">
          Mission
        </h2>
        <p className="text-slate-700 dark:text-slate-300">
          Our goal is to be the largest maritime calculator and navigation knowledge hub on the internet—free, accurate, and fast. We provide tools for converting nautical units, planning passages, calculating anchor scope, and understanding wind and sea state for sailors, mariners, and anyone who works or plays on the water.
        </p>

        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mt-8">
          Ownership &amp; Disclosure
        </h2>
        <p className="text-slate-700 dark:text-slate-300">
          OceanCalc is owned and operated by {organization.name}, {organization.description} We build and operate our own web properties; OceanCalc is one of our products. We are based in the {organization.jurisdiction}, {organization.foundingCountry}.
        </p>

        <p className="text-slate-700 dark:text-slate-300">
          For questions or feedback, please{" "}
          <Link href="/contact/" className="text-sky-600 dark:text-sky-400 hover:underline">
            contact us
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
