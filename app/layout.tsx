import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { OrganizationSchema, WebSiteSchema } from "@/components/OrganizationSchema";
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
        <WebSiteSchema />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
