export const metadata = {
  title: "Affiliate Disclosure",
  description: "Affiliate disclosure for OceanCalc.",
};

export default function AffiliatePage() {
  return (
    <div className="container-narrow py-8 prose prose-slate dark:prose-invert max-w-none">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
        Affiliate Disclosure
      </h1>
      <p className="text-slate-600 dark:text-slate-400">
        OceanCalc may include links to products or services. If we participate in affiliate programs, we may earn a commission when you make a purchase through our links. This does not affect the price you pay. We only recommend tools and resources we believe are useful for our audience.
      </p>
    </div>
  );
}
