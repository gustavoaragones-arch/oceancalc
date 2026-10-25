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
          We may collect information you provide directly (e.g. contact form submissions, email) and automatically (e.g. IP address, browser type, usage data) when you use our site. We use this to operate the service, improve content, respond to inquiries, and serve and measure ads (see Advertising below).
        </p>

        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Cookies and Similar Technologies
        </h2>
        <p>
          We may use cookies and similar technologies for analytics, to improve the user experience, and for advertising (see Advertising below). You can manage cookie preferences in your browser. See our{" "}
          <Link href="/cookies/" className="text-blue-600 dark:text-blue-400 underline">
            Cookies
          </Link>{" "}
          page for more detail.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Advertising
        </h2>
        <p>
          We use Google AdSense to display ads. Google and its partners may use cookies, web beacons and similar technologies to collect information such as your IP address, browser type and the pages you visit, in order to serve and measure ads, including ads based on your interests. We do not sell personal information we collect directly, and calculations you enter into OceanCalc tools run in your browser and are not sent to us.
        </p>
        <p>
          Visitors in the EEA, UK and Switzerland are asked for consent before personalized ads are served. For details on the cookies used and how to opt out, see our{" "}
          <Link href="/cookies/" className="text-blue-600 dark:text-blue-400 underline">
            Cookie Policy
          </Link>
          .
        </p>

        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Data Sharing
        </h2>
        <p>
          We do not sell your personal data. We may share data with service providers who assist in operating the site, subject to confidentiality obligations. Advertising partners such as Google may also collect information through cookies on this site, as described in the Advertising section.
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
