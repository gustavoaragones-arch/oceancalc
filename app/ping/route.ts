import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site";

/**
 * Google sitemap ping (legacy endpoint; Google may return non-2xx).
 * With `output: "export"`, this handler runs at **build time** and the JSON
 * response is baked into static output — each deploy re-pings when the build
 * has network access. For a live ping outside builds, use `npm run ping`.
 */
export const dynamic = "force-static";

export async function GET() {
  const base = siteConfig.url.replace(/\/$/, "");
  const sitemapUrl = `${base}/sitemap.xml`;
  const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;

  try {
    const res = await fetch(pingUrl);
    console.log("[ping] Google sitemap ping status:", res.status, sitemapUrl);
    return NextResponse.json(
      {
        success: true,
        status: res.status,
        sitemapUrl,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[ping] Google sitemap ping failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Ping failed",
        sitemapUrl,
      },
      { status: 500 }
    );
  }
}
