import { organization } from "@/config/siteOwner";
import Link from "next/link";
import { generateMetadata as buildSeoMetadata } from "@/lib/seo";

export const metadata = buildSeoMetadata({
  title: "Privacy Policy",
  description: `Privacy policy for OceanCalc and ${organization.name}.`,
  path: "/privacy/",
});

export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">
        Privacy Policy
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
          OceanCalc (“we”, “our”) is operated by {organization.name}. This Privacy Policy describes how we collect, use, and protect information when you use our website oceancalc.com.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Information We Collect
        </h2>
        <p>
          We may collect information you provide directly (e.g. contact form submissions, email) and automatically (e.g. IP address, browser type, usage data) when you use our site. We use this to operate the service, improve content, and respond to inquiries.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Cookies and Similar Technologies
        </h2>
        <p>
          We may use cookies and similar technologies for analytics and to improve the user experience. You can manage cookie preferences in your browser. See our{" "}
          <Link href="/cookies/" className="text-blue-600 dark:text-blue-400 underline">
            Cookies
          </Link>{" "}
          page for more detail.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Data Sharing
        </h2>
        <p>
          We do not sell your personal data. We may share data with service providers who assist in operating the site, subject to confidentiality obligations.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Contact
        </h2>
        <p>
          For privacy-related questions, contact us at{" "}
          <a
            href="mailto:contact@oceancalc.com"
            className="text-blue-600 dark:text-blue-400 underline"
          >
            contact@oceancalc.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}
