export const TOOLS = [
  {
    slug: "nautical-mile-converter",
    name: "Nautical Mile Converter",
    description: "Convert between nautical miles, statute miles, kilometers, and meters.",
    href: "/tools/nautical-mile-converter/",
  },
  {
    slug: "knots-speed-converter",
    name: "Knots Speed Converter",
    description: "Convert speed between knots, mph, km/h, and m/s.",
    href: "/tools/knots-speed-converter/",
  },
  {
    slug: "distance-to-horizon-calculator",
    name: "Distance to Horizon Calculator",
    description: "Calculate how far you can see at sea from a given height of eye.",
    href: "/tools/distance-to-horizon-calculator/",
  },
  {
    slug: "sailing-time-calculator",
    name: "Sailing Time Calculator",
    description: "Estimate time to cover a distance at a given speed.",
    href: "/tools/sailing-time-calculator/",
  },
  {
    slug: "great-circle-distance-calculator",
    name: "Great Circle Distance Calculator",
    description: "Compute the shortest distance between two points on Earth.",
    href: "/tools/great-circle-distance-calculator/",
  },
  {
    slug: "anchor-scope-calculator",
    name: "Anchor Scope Calculator",
    description: "Calculate recommended anchor rode length for depth and conditions.",
    href: "/tools/anchor-scope-calculator/",
  },
  {
    slug: "beaufort-scale-calculator",
    name: "Beaufort Scale Calculator",
    description: "Convert wind speed to Beaufort force and see sea state description.",
    href: "/tools/beaufort-scale-calculator/",
  },
  {
    slug: "apparent-wind-calculator",
    name: "Apparent Wind Calculator",
    description: "Find apparent wind speed and angle from true wind and boat speed.",
    href: "/tools/apparent-wind-calculator/",
  },
] as const;

export type ToolSlug = (typeof TOOLS)[number]["slug"];
