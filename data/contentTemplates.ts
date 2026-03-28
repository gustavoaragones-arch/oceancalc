export interface TemplateFaqItem {
  question: string;
  answer: string;
}

/** Same meaning, alternate phrasing—index chosen deterministically from slug at build time. */
const introVariants = [
  (title: string) =>
    `The ${title} helps you perform accurate maritime calculations quickly, using standard nautical relationships and clear inputs.`,
  (title: string) =>
    `Use the ${title} for fast, reliable maritime math—built on standard nautical relationships with straightforward inputs.`,
  (title: string) =>
    `The ${title} gives you precise nautical results from familiar formulas, with an interface suited to deck and chart-table use.`,
] as const;

const howToVariants = [
  (title: string) =>
    `To use the ${title}, enter your values in the fields above. Results update as you adjust numbers, so you can compare scenarios without leaving the page.`,
  (title: string) =>
    `Start by filling in the fields for the ${title}; the page recalculates as you type so you can iterate through options in one place.`,
  (title: string) =>
    `With the ${title}, type your figures into the inputs above—the output refreshes live, making it easy to sanity-check several cases.`,
] as const;

export const templates = {
  default: {
    introVariants,
    howToVariants,

    formula: (formulaText: string) =>
      `The relationship behind this tool is: ${formulaText}`,

    templateFaq: [
      {
        question: "How accurate is this calculator?",
        answer:
          "This calculator uses standard maritime formulas and practical approximations where noted. It is suitable for planning and cross-checks; always verify safety-critical decisions with official references and local conditions.",
      },
      {
        question: "Can I use this on mobile?",
        answer:
          "Yes. OceanCalc tools are responsive and work on phones and tablets for quick checks on deck or in the cockpit.",
      },
    ] as TemplateFaqItem[],

    useCases: (title: string) =>
      `Typical uses for the ${title} include passage planning, briefing crew, converting instrument readouts to chart units, and double-checking mental math when fatigue or weather make errors more likely.`,

    tips: (title: string) =>
      [
        `Confirm that the units you enter match your chart, GPS, or instrument readout before relying on the ${title}.`,
        `In rough weather or poor visibility, cross-check important results with a second method or a crew member.`,
        `Treat simplified models (wave height, radar horizon, etc.) as estimates—real conditions vary with fetch, refraction, and equipment.`,
      ] as string[],
  },
};
