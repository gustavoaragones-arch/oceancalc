import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AllCalculatorsGrid } from "@/components/AllCalculatorsGrid";
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
        <div className="container-wide pt-8 pb-2 border-t border-gray-100 dark:border-slate-800/80 bg-gray-50/40 dark:bg-slate-950/40">
          <AllCalculatorsGrid />
        </div>
        <p className="text-xs text-gray-500 dark:text-slate-500 mt-6 max-w-3xl mx-auto text-center px-4">
          OceanCalc is a precision-focused maritime calculation platform built for sailors, navigators, and marine professionals. All formulas are derived from established navigation principles including great-circle computation, rhumb line navigation, and classical seamanship mathematics.
        </p>
        <div className="text-xs text-center mt-10 space-x-4 text-gray-600 dark:text-slate-400">
          <Link
            href="/tools/hull-speed-calculator/"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Hull Speed
          </Link>
          <Link
            href="/tools/rhumb-distance-calculator/"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Rhumb Line
          </Link>
          <Link
            href="/tools/great-circle-distance-calculator/"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Great Circle
          </Link>
          <Link
            href="/tools/initial-bearing-calculator/"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Bearing
          </Link>
        </div>
        <div className="text-xs text-center mt-4 space-x-4 text-gray-600 dark:text-slate-400">
          <Link
            href="/navigation-calculations/"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Navigation
          </Link>
          <Link
            href="/distance-measurement-calculators/"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Distance
          </Link>
          <Link
            href="/wind-wave-calculators/"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Wind &amp; Waves
          </Link>
          <Link
            href="/sailing-performance-calculators/"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Sailing
          </Link>
        </div>
        <p className="text-center text-xs text-slate-500 px-4 mt-10">
          OceanCalc publishes maritime navigation calculators, sailing references, and nautical measurement tools designed for educational and practical marine planning use.
        </p>
        <Footer />
      </body>
    </html>
  );
}
