import { organization } from "@/config/siteOwner";

export const metadata = {
  title: "Disclaimer",
  description: "Disclaimer for OceanCalc maritime calculators and content.",
  openGraph: {
    title: "Disclaimer | OceanCalc",
  },
};

export default function DisclaimerPage() {
  return (
    <div className="container-narrow py-8 prose prose-slate dark:prose-invert max-w-none">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
        Disclaimer
      </h1>

      <div className="space-y-6 text-slate-700 dark:text-slate-300">
        <p>
          OceanCalc is operated by {organization.name}. We provide maritime calculators and reference information for general use only.
        </p>

        <p>
          <strong>Results are not a substitute</strong> for official nautical publications, charts, or professional advice. Always use official sources for navigation and safety-critical decisions.
        </p>

        <p>
          We do not guarantee the accuracy of every calculation in all conditions. Use at your own risk. The operators of OceanCalc are not liable for any loss or damage arising from use of the site or its tools.
        </p>
      </div>
    </div>
  );
}
