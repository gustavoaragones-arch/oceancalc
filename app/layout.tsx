import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { OrganizationSchema, WebSiteSchema } from "@/components/OrganizationSchema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://oceancalc.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "OceanCalc — Maritime Calculators & Navigation Tools",
    template: "%s | OceanCalc",
  },
  description:
    "Free maritime calculators, sailing navigation tools, nautical measurements, and wind & wave reference. The largest maritime calculator and navigation knowledge hub.",
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
    url: SITE_URL,
    siteName: "OceanCalc",
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
        <WebSiteSchema />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
