import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site";

/**
 * Deploy “ping” checklist as JSON (no live Google request — their ping URL is deprecated).
 * With `output: "export"` this route is pre-rendered at build time when `force-static` is set.
 */
export const dynamic = "force-static";

export async function GET() {
  const base = siteConfig.url.replace(/\/$/, "");
  const sitemapUrl = `${base}/sitemap.xml`;
  const legacyPing = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;

  return NextResponse.json({
    ok: true,
    domain: "oceancalc.com",
    sitemapUrl,
    legacyGooglePingUrl: legacyPing,
    message:
      "Submit sitemapUrl in Google Search Console → Sitemaps. Automated Google sitemap ping is deprecated (often 404).",
    searchConsole: "https://search.google.com/search-console",
  });
}
