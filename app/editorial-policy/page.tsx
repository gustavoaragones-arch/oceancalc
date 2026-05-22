import { generateMetadata as buildSeoMetadata } from "@/lib/seo";

export const metadata = buildSeoMetadata({
  title: "Editorial Policy",
  description:
    "OceanCalc editorial standards for maritime calculators, navigation content, and educational resources.",
  path: "/editorial-policy/",
});

export default function EditorialPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">
        Editorial Policy
      </h1>

      <div className="space-y-5 text-slate-700 dark:text-slate-300 leading-7">
        <p>
          OceanCalc focuses on maritime navigation, sailing calculations, nautical measurements, and marine route-planning references.
        </p>

        <p>
          Content is written and structured to prioritize clarity, accuracy, and practical usability for sailors, navigators, students, and marine professionals.
        </p>

        <p>
          Calculator explanations and educational sections are reviewed and updated as new tools and navigation references are added to the platform.
        </p>

        <p>
          OceanCalc avoids misleading claims, AI-generated spam pages, keyword stuffing, and low-value automatically generated content.
        </p>

        <p>
          Internal links are added contextually to help users navigate related maritime calculations and educational resources.
        </p>
      </div>
    </main>
  );
}
