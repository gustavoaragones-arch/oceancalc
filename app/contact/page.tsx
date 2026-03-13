import { organization } from "@/config/siteOwner";

export const metadata = {
  title: "Contact",
  description: `Contact OceanCalc and ${organization.name}.`,
  openGraph: {
    title: "Contact | OceanCalc",
    description: `Get in touch with the OceanCalc team.`,
  },
};

export default function ContactPage() {
  return (
    <div className="container-narrow py-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
        Contact
      </h1>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <p className="text-slate-700 dark:text-slate-300">
          OceanCalc is developed and operated by{" "}
          <a
            href={organization.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-600 dark:text-sky-400 hover:underline"
          >
            {organization.name}
          </a>
          . For questions, corrections, or suggestions about our maritime calculators and content, please reach out.
        </p>

        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
            Email
          </h2>
          <a
            href={`mailto:${organization.email}`}
            className="text-sky-600 dark:text-sky-400 hover:underline font-medium"
          >
            {organization.email}
          </a>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            We aim to respond within a few business days.
          </p>
        </div>
      </div>
    </div>
  );
}
