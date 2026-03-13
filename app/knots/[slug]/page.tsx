import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getKnotBySlug, getAllKnotSlugs } from "@/lib/contentLoader";
import { buildKnotSEO } from "@/lib/seoBuilder";
import { buildHowToSchema, buildFAQSchema } from "@/lib/schemaBuilder";
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
  const seo = buildKnotSEO({
    name: knot.name,
    path: `/knots/${slug}/`,
  });
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: seo.canonical },
    openGraph: seo.openGraph,
  };
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
  const faqSchema =
    knot.faq.length > 0 ? buildFAQSchema(knot.faq) : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <KnotTutorial knot={knot} />
    </>
  );
}
