import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getKnotBySlug, getAllKnotSlugs } from "@/lib/contentLoader";
import { generateMetadata as buildSeoMetadata } from "@/lib/seo";
import { getBuildLastModified } from "@/lib/indexing";
import { buildHowToSchema } from "@/lib/schemaBuilder";
import FAQSchema from "@/components/schema/FAQSchema";
import { KnotTutorial } from "@/components/KnotTutorial";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllKnotSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const knot = getKnotBySlug(slug);
  if (!knot) return { title: "Not Found" };
  return buildSeoMetadata({
    title: knot.name,
    description: `How to tie the ${knot.name}. Step-by-step tutorial for sailors and boaters.`,
    path: `/knots/${slug}/`,
    openGraphType: "article",
    lastModified: getBuildLastModified(),
  });
}

export default async function KnotPage({ params }: PageProps) {
  const { slug } = await params;
  const knot = getKnotBySlug(slug);
  if (!knot) notFound();

  const howToSchema = buildHowToSchema(
    knot.name,
    `How to tie the ${knot.name}. ${knot.uses.join(", ")}.`,
    knot.steps,
    `/knots/${slug}/`
  );
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <FAQSchema faqs={knot.faq} />
      <KnotTutorial knot={knot} />
    </>
  );
}
