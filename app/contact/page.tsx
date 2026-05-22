import { generateMetadata as buildSeoMetadata } from "@/lib/seo";

export const metadata = buildSeoMetadata({
  title: "Contact",
  description:
    "Contact OceanCalc for calculator feedback, corrections, and partnership inquiries.",
  path: "/contact/",
});

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">
        Contact OceanCalc
      </h1>

      <div className="space-y-5 text-slate-700 dark:text-slate-300 leading-7">
        <p>
          OceanCalc is continuously expanding its maritime calculators, sailing tools, and navigation resources.
        </p>

        <p>
          For general questions, correction requests, calculator feedback, or partnership inquiries, please contact:
        </p>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <p className="font-medium">
            <a
              href="mailto:contact@oceancalc.com"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              contact@oceancalc.com
            </a>
          </p>
        </div>

        <p className="text-sm text-slate-500">
          Response times may vary depending on request volume.
        </p>
      </div>
    </main>
  );
}
