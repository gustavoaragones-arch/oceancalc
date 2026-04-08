type Props = {
  question: string;
  answer: string;
  explanation?: string;
};

/**
 * AEO: machine-extractable Q&A (ChatGPT / Perplexity / Gemini-style answers).
 */
export default function AnswerBlock({ question, answer, explanation }: Props) {
  return (
    <section
      className="mt-8 p-5 rounded-2xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-800/60"
      aria-labelledby="aeo-answer-heading"
      itemScope
      itemType="https://schema.org/Question"
    >
      <h2
        id="aeo-answer-heading"
        className="text-lg font-semibold text-gray-900 dark:text-slate-100"
        itemProp="name"
      >
        {question}
      </h2>
      <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
        <p
          className="mt-2 font-medium text-gray-900 dark:text-slate-100 text-sm leading-relaxed"
          itemProp="text"
        >
          {answer}
        </p>
      </div>
      {explanation ? (
        <p className="mt-2 text-gray-600 dark:text-slate-400 text-sm leading-relaxed">
          {explanation}
        </p>
      ) : null}
    </section>
  );
}
