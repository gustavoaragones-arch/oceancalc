import type { ReactNode } from "react";
import Link from "next/link";

const MAX_LINKS = 5;

type Rule = { pattern: RegExp; slug: string };

/** Longer phrases first so we match e.g. "wind speeds in knots" before "knots". */
const RULES: Rule[] = [
  { pattern: /\bdistance to the horizon\b/i, slug: "distance-to-horizon-calculator" },
  { pattern: /\bwind speeds in knots\b/i, slug: "knots-speed-converter" },
  { pattern: /\bBeaufort scale\b/i, slug: "beaufort-scale-calculator" },
  { pattern: /\bapparent wind\b/i, slug: "apparent-wind-calculator" },
  { pattern: /\btrue wind\b/i, slug: "apparent-wind-calculator" },
  { pattern: /\bgreat circle\b/i, slug: "great-circle-distance-calculator" },
  { pattern: /\bsailing time calculator\b/i, slug: "sailing-time-calculator" },
  { pattern: /\bnautical miles\b/i, slug: "nautical-mile-converter" },
  { pattern: /\banchor rode\b/i, slug: "anchor-scope-calculator" },
  { pattern: /\bwind speed\b/i, slug: "beaufort-scale-calculator" },
  { pattern: /\bspeed in knots\b/i, slug: "knots-speed-converter" },
];

function nextLinkMatch(
  text: string,
  from: number
): { start: number; end: number; slug: string; matchText: string } | null {
  let best: { start: number; end: number; slug: string; matchText: string } | null =
    null;

  for (const { pattern, slug } of RULES) {
    const re = new RegExp(
      pattern.source,
      pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`
    );
    re.lastIndex = from;
    const m = re.exec(text);
    if (!m) continue;
    const start = m.index;
    const end = start + m[0].length;
    if (
      !best ||
      start < best.start ||
      (start === best.start && end - start > best.end - best.start)
    ) {
      best = { start, end, slug, matchText: m[0] };
    }
  }

  return best;
}

/**
 * Injects a small number of contextual <a> links into article body text (server-rendered).
 */
export function ArticleContentWithLinks({ content }: { content: string }) {
  const nodes: ReactNode[] = [];
  let pos = 0;
  let links = 0;
  let key = 0;

  while (pos < content.length && links < MAX_LINKS) {
    const hit = nextLinkMatch(content, pos);
    if (!hit) break;

    if (hit.start > pos) {
      nodes.push(content.slice(pos, hit.start));
    }

    nodes.push(
      <Link
        key={`ctx-${key++}`}
        href={`/tools/${hit.slug}/`}
        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
      >
        {hit.matchText}
      </Link>
    );

    pos = hit.end;
    links++;
  }

  if (pos < content.length) {
    nodes.push(content.slice(pos));
  }

  return (
    <p className="text-gray-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
      {nodes}
    </p>
  );
}
