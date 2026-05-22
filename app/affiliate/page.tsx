import { generateMetadata as buildSeoMetadata } from "@/lib/seo";

export const metadata = buildSeoMetadata({
  title: "Affiliate Disclosure",
  description:
    "Affiliate disclosure for OceanCalc. How we may earn commissions from product links.",
  path: "/affiliate/",
});

export default function AffiliatePage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">
        Affiliate Disclosure
      </h1>

      <div className="space-y-5 text-slate-700 dark:text-slate-300 leading-7">
        <p>
          OceanCalc may include links to products or services. If we participate in affiliate programs, we may earn a commission when you make a purchase through our links. This does not affect the price you pay. We only recommend tools and resources we believe are useful for our audience.
        </p>
      </div>
    </main>
  );
}
