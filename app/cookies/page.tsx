import { organization } from "@/config/siteOwner";
import { generateMetadata as buildSeoMetadata } from "@/lib/seo";

export const metadata = buildSeoMetadata({
  title: "Cookie Policy",
  description: `Cookie policy for OceanCalc, operated by ${organization.name}.`,
  path: "/cookies/",
});

export default function CookiesPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">
        Cookie Policy
      </h1>

      <p className="text-sm text-slate-500 mb-6">
        Last updated:{" "}
        {new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      <div className="space-y-5 text-slate-700 dark:text-slate-300 leading-7">
        <p>
          OceanCalc, operated by {organization.name}, may use cookies and similar technologies when you visit our site.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          What We Use
        </h2>
        <p>
          We may use cookies for analytics (e.g. understanding how visitors use the site), performance, and to remember preferences. We do not use cookies for advertising.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Your Choices
        </h2>
        <p>
          You can control or delete cookies through your browser settings. Disabling cookies may affect some site functionality.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Contact
        </h2>
        <p>
          Questions:{" "}
          <a
            href="mailto:contact@oceancalc.com"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            contact@oceancalc.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}
