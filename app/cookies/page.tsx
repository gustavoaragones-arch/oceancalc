import { organization } from "@/config/siteOwner";

export const metadata = {
  title: "Cookies",
  description: "Cookie policy for OceanCalc.",
  openGraph: {
    title: "Cookies | OceanCalc",
  },
};

export default function CookiesPage() {
  return (
    <div className="container-narrow py-8 prose prose-slate dark:prose-invert max-w-none">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
        Cookie Policy
      </h1>

      <p className="text-slate-600 dark:text-slate-400">
        Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
      </p>

      <div className="space-y-6 text-slate-700 dark:text-slate-300 mt-6">
        <p>
          OceanCalc, operated by {organization.name}, may use cookies and similar technologies when you visit our site.
        </p>

        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">What We Use</h2>
        <p>
          We may use cookies for analytics (e.g. understanding how visitors use the site), performance, and to remember preferences. We do not use cookies for advertising.
        </p>

        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Your Choices</h2>
        <p>
          You can control or delete cookies through your browser settings. Disabling cookies may affect some site functionality.
        </p>

        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Contact</h2>
        <p>
          Questions:{" "}
          <a href={`mailto:${organization.email}`} className="text-sky-600 dark:text-sky-400 hover:underline">
            {organization.email}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
