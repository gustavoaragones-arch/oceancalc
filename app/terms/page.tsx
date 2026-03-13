import { organization } from "@/config/siteOwner";

export const metadata = {
  title: "Terms of Use",
  description: `Terms of use for OceanCalc.`,
  openGraph: {
    title: "Terms of Use | OceanCalc",
  },
};

export default function TermsPage() {
  return (
    <div className="container-narrow py-8 prose prose-slate dark:prose-invert max-w-none">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
        Terms of Use
      </h1>

      <p className="text-slate-600 dark:text-slate-400">
        Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
      </p>

      <div className="space-y-6 text-slate-700 dark:text-slate-300 mt-6">
        <p>
          By using OceanCalc (“the site”), operated by {organization.name}, you agree to these Terms of Use.
        </p>

        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Use of the Service</h2>
        <p>
          You may use our calculators and content for personal and educational purposes. Results are for reference only; always verify critical navigation and safety decisions with official sources and your own judgment.
        </p>

        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Disclaimer</h2>
        <p>
          The site is provided “as is.” We do not guarantee accuracy of every calculation in all conditions. Maritime and navigation use involves risk; you are responsible for your own decisions.
        </p>

        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Contact</h2>
        <p>
          Questions about these terms:{" "}
          <a href={`mailto:${organization.email}`} className="text-sky-600 dark:text-sky-400 hover:underline">
            {organization.email}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
