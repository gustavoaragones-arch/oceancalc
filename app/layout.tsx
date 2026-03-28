import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AllCalculatorsGrid } from "@/components/AllCalculatorsGrid";
import OrganizationSchema from "@/components/schema/OrganizationSchema";
import WebsiteSchema from "@/components/schema/WebsiteSchema";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(
    siteConfig.url.endsWith("/") ? siteConfig.url : `${siteConfig.url}/`
  ),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "maritime calculator",
    "nautical tools",
    "sailing navigation",
    "knots converter",
    "nautical mile",
    "marine calculator",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${siteConfig.url.replace(/\/$/, "")}/`,
    siteName: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <OrganizationSchema />
        <WebsiteSchema />
        <Header />
        <main className="flex-1">{children}</main>
        <div className="container-wide pt-8 pb-2 border-t border-gray-100 dark:border-slate-800/80 bg-gray-50/40 dark:bg-slate-950/40">
          <AllCalculatorsGrid />
        </div>
        <Footer />
      </body>
    </html>
  );
}
