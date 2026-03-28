const url =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://oceancalc.com";

export const siteConfig = {
  name: "OceanCalc",
  url,
  description:
    "Maritime calculators and navigation tools for sailors, engineers, and marine professionals.",
  organization: {
    name: "Albor Digital LLC",
    url,
  },
} as const;
