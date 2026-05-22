import { generateMetadata as buildSeoMetadata } from "@/lib/seo";

export const metadata = buildSeoMetadata({
  title: "About",
  description:
    "About OceanCalc — maritime navigation and sailing calculation tools for route planning, seamanship, and nautical navigation.",
  path: "/about/",
});

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">
        About OceanCalc
      </h1>

      <div className="space-y-5 text-slate-700 dark:text-slate-300 leading-7">
        <p>
          OceanCalc is a maritime navigation and sailing calculation platform built to simplify common marine calculations used during route planning, seamanship training, sailing performance analysis, and nautical navigation.
        </p>

        <p>
          The platform includes calculators for bearings, nautical distance, wave behavior, vessel speed, heading conversion, route geometry, and marine measurement systems.
        </p>

        <p>
          OceanCalc was developed as a lightweight, fast-loading navigation resource focused on practical usability, clean calculation interfaces, and educational clarity.
        </p>

        <p>
          The goal is to provide sailors, navigators, students, and marine professionals with accessible tools that support real-world maritime planning and navigation workflows.
        </p>

        <p>
          All tools are designed for informational and educational use only and should not replace certified marine navigation equipment or official nautical publications.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 pt-2">
          Ownership &amp; Disclosure
        </h2>
        <p>
          OceanCalc is owned and operated by Albor Digital LLC, Independent digital product studio building utility web applications and tools. We build and operate our own web properties; OceanCalc is one of our products. We are based in the Wyoming, United States.
        </p>
      </div>
    </main>
  );
}
