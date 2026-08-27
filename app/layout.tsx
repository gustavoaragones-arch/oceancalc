import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import OrganizationSchema from "@/components/schema/OrganizationSchema";
import WebsiteSchema from "@/components/schema/WebsiteSchema";
import { siteConfig } from "@/config/site";
import { ADSENSE_CLIENT_ID } from "@/lib/ads";

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
  other: {
    "google-adsense-account": ADSENSE_CLIENT_ID,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* AdSense — must be in <head> as static HTML for crawler verification */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <OrganizationSchema />
        <WebsiteSchema />
        <Header />
        <main className="flex-1">{children}</main>
        <p className="text-xs text-gray-500 dark:text-slate-500 mt-6 max-w-3xl mx-auto text-center px-4">
          OceanCalc is a precision-focused maritime calculation platform built for sailors, navigators, and marine professionals. All formulas are derived from established navigation principles including great-circle computation, rhumb line navigation, and classical seamanship mathematics.
        </p>
        <p className="text-center text-xs text-slate-500 px-4 mt-10">
          OceanCalc publishes maritime navigation calculators, sailing references, and nautical measurement tools designed for educational and practical marine planning use.
        </p>
        <Footer />
      </body>
    </html>
  );
}
