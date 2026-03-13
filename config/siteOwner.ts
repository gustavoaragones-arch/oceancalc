export const organization = {
  name: "Albor Digital LLC",
  url: "https://albor.digital",
  email: "contact@albor.digital",
  type: "Organization" as const,
  description:
    "Independent digital product studio building utility web applications and tools.",
  foundingCountry: "United States",
  jurisdiction: "Wyoming",
  products: ["OceanCalc", "NameOrigin", "MindPulseProfile"],
};

export const site = {
  name: "OceanCalc",
  url: "https://oceancalc.com",
  author: "OceanCalc Editorial Team",
  publisher: organization.name,
};

export const contact = {
  email: organization.email,
  support: organization.email,
};
