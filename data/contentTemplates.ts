export interface TemplateFaqItem {
  question: string;
  answer: string;
}

/** Definition-first, short lines for AEO / AI extraction. */
const introVariants = [
  (title: string) =>
    `${title}: standard nautical formulas, clear inputs, immediate results.`,
  (title: string) =>
    `${title} uses established maritime relationships—enter values and read outputs without extra steps.`,
  (title: string) =>
    `${title} applies familiar chart and piloting math in one place for deck and planning use.`,
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
