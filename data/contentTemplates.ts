export interface TemplateFaqItem {
  question: string;
  answer: string;
}

/** Phase 6.6 — single intro template (recrawl / consistency). {toolName} = page title. */
const PRIMARY_ACTION =
  "apply your inputs to the stated nautical relationships";

const introVariants = [
  (toolName: string) =>
    `A ${toolName} is used in maritime navigation to perform precise calculations based on established nautical formulas. This tool allows you to ${PRIMARY_ACTION} using accurate and standardized methods.`,
] as const;

const howToVariants = [
  (title: string) =>
    `Enter numbers in the fields above; results update as you change inputs.`,
  (title: string) =>
    `Fill the inputs for the ${title}; the tool recalculates live as you edit.`,
  (title: string) =>
    `Type your figures into the form; outputs refresh so you can compare cases quickly.`,
] as const;

export const templates = {
  default: {
    introVariants,
    howToVariants,

    formula: (formulaText: string) =>
      `Core relationship: ${formulaText}`,

    templateFaq: [
      {
        question: "How accurate is this calculator?",
        answer:
          "It uses standard maritime formulas and noted approximations. Use it for planning and checks; confirm safety-critical decisions with official sources.",
      },
      {
        question: "Can I use this on mobile?",
        answer:
          "Yes. Layouts are responsive for phones and tablets on deck or in the cockpit.",
      },
    ] as TemplateFaqItem[],

    useCases: (title: string) =>
      `${title}: passage planning, crew briefings, instrument-to-chart unit checks, and verifying mental math when tired or in rough weather.`,

    tips: (title: string) =>
      [
        `Match input units to your chart, GPS, or instrument before trusting the ${title}.`,
        `Cross-check important outputs with a second method or crew when visibility or motion is poor.`,
        `Treat simplified models (waves, radar horizon, etc.) as estimates; real conditions vary.`,
      ] as string[],
  },
};
