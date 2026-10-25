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
          We may use cookies for analytics (e.g. understanding how visitors use the site), performance, and to remember preferences.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Advertising Cookies
        </h2>
        <p>
          OceanCalc shows ads served by Google AdSense. Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites. Google’s use of advertising cookies enables it and its partners to serve ads to you based on your visits to this site and/or other sites on the internet.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Your Choices
        </h2>
        <p>
          You can opt out of personalized advertising from Google by visiting{" "}
          <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Google Ad Settings</a>.
        </p>
        <p>
          You can opt out of some third-party vendors’ use of cookies for personalized advertising at{" "}
          <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">aboutads.info</a> or, in Europe,{" "}
          <a href="https://www.youronlinechoices.eu" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">youronlinechoices.eu</a>.
        </p>
        <p>
          Visitors in the European Economic Area, the United Kingdom and Switzerland are asked for consent through a consent message before personalized ads are shown. You can change your choice at any time using the &quot;Privacy and cookie settings&quot; link shown on the site.
        </p>
        <p>
          You can also block or delete cookies in your browser settings. Ads may still appear, but they will be less relevant. Disabling cookies may affect some site functionality.
        </p>
        <p>
          To learn more about how Google uses information from sites that use its services, see{" "}
          <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">How Google uses information from sites or apps that use our services</a>.
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
