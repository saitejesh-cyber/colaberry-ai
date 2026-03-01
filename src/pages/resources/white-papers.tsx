import Layout from "../../components/Layout";
import Head from "next/head";
import Link from "next/link";
import EnterprisePageHero from "../../components/EnterprisePageHero";
import EnterpriseCtaBand from "../../components/EnterpriseCtaBand";
import SectionHeader from "../../components/SectionHeader";
import { heroImage } from "../../lib/media";
import { seoTags, canonicalUrl as buildCanonical, type SeoMeta } from "../../lib/seo";
import type { GetStaticProps } from "next";
import { fetchWhitePapers, type WhitePaper } from "../../lib/cms";

type WhitePapersProps = {
  whitePapers: WhitePaper[];
};

export const getStaticProps: GetStaticProps<WhitePapersProps> = async () => {
  let whitePapers: WhitePaper[] = [];
  try {
    whitePapers = await fetchWhitePapers("public");
  } catch {
    // CMS unavailable — fall back to empty list (static placeholders render below)
  }
  return { props: { whitePapers }, revalidate: 3600 };
};

export default function WhitePapersPage({ whitePapers }: WhitePapersProps) {
  const decisionTracks = [
    {
      title: "Architecture track",
      description: "Reference designs and implementation patterns for reliable, scalable AI systems.",
      href: "/solutions",
      cta: "Explore solutions",
    },
    {
      title: "Governance track",
      description: "Controls, policies, and guardrails for trust, compliance, and auditability.",
      href: "/resources/case-studies",
      cta: "Review case studies",
    },
    {
      title: "Execution track",
      description: "Rollout playbooks that connect architecture decisions to delivery outcomes.",
      href: "/resources/articles",
      cta: "Read articles",
    },
  ];
  const downloadableCount = whitePapers.filter((item) => Boolean(item.downloadUrl)).length;
  const publishedCount = whitePapers.filter((item) => (item.status || "").toLowerCase() === "published").length;
  const seoMeta: SeoMeta = {
    title: "White Papers | Colaberry AI",
    description: "Reference architectures, governance frameworks, and deployment playbooks for enterprise AI teams scaling with confidence.",
    canonical: buildCanonical("/resources/white-papers"),
  };

  const hasCmsData = whitePapers.length > 0;

  return (
    <Layout>
      <Head>
        <title>{seoMeta.title}</title>
        {seoTags(seoMeta).map(({ key, ...props }) => (
          "rel" in props ? <link key={key} {...props} /> : <meta key={key} {...props} />
        ))}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "name": "White Papers | Colaberry AI",
              "description": "Reference architectures, governance frameworks, and deployment playbooks for enterprise AI teams.",
              "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://colaberry.ai"}/resources/white-papers`,
            }),
          }}
        />
      </Head>

      <EnterprisePageHero
        kicker="Resources"
        title="White papers"
        description="Detailed architecture guides, governance frameworks, and deployment playbooks -- built for teams making high-stakes AI decisions."
        image={heroImage("hero-whitepapers-cinematic.webp")}
        alt="White papers and architecture guides for enterprise AI"
        imageKicker="Deep dives"
        imageTitle="De-risk your AI strategy"
        imageDescription="Proven frameworks and governance patterns used in production deployments."
        chips={["Architecture", "Governance", "Deployment", "Risk management"]}
        primaryAction={{ label: "Open updates feed", href: "/updates" }}
        secondaryAction={{ label: "Back to resources", href: "/resources", variant: "secondary" }}
        metrics={[
          {
            label: "Papers",
            value: hasCmsData ? String(whitePapers.length) : "Growing",
            note: "Research-backed guidance for enterprise deployment.",
          },
          {
            label: "Downloads",
            value: String(downloadableCount),
            note: "Assets available immediately for implementation teams.",
          },
          {
            label: "Published",
            value: hasCmsData ? String(publishedCount) : "Planned",
            note: "Actively maintained guidance with release cadence.",
          },
        ]}
      />

      <section className="surface-panel section-spacing p-5 sm:p-6">
        <SectionHeader
          kicker="Decision pathways"
          title="Pick the white paper stream by decision type"
          description="Move from broad research to role-specific guidance based on what your team needs to solve next."
          size="md"
        />
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {decisionTracks.map((track) => (
            <article key={track.title} className="card-feature p-4">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{track.title}</h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {track.description}
              </p>
              <Link href={track.href} className="btn btn-ghost mt-3 text-xs">
                {track.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* CMS-driven white paper cards */}
      {hasCmsData && (
        <div className="section-spacing grid gap-4 lg:grid-cols-3">
          {whitePapers.map((wp) => (
            <div key={wp.id} className="card-feature p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="text-caption font-semibold text-slate-900">{wp.title}</div>
                  {wp.summary && (
                    <p className="mt-1 text-sm text-slate-600 line-clamp-3">{wp.summary}</p>
                  )}
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    {wp.author && <span>By {wp.author}</span>}
                    {wp.publishDate && (
                      <span>
                        {wp.author ? " · " : ""}
                        {new Date(wp.publishDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                        })}
                      </span>
                    )}
                    {wp.category && (
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                        {wp.category}
                      </span>
                    )}
                    {wp.pageCount != null && (
                      <span>{wp.pageCount} pages</span>
                    )}
                  </div>
                </div>
                {wp.status && (
                  <span className="chip chip-muted shrink-0 rounded-md px-2.5 py-1 text-xs font-semibold">
                    {wp.status}
                  </span>
                )}
              </div>
              {(wp.downloadUrl || wp.previewUrl) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {wp.downloadUrl && (
                    <a
                      href={wp.downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary btn-sm"
                    >
                      Download
                    </a>
                  )}
                  {wp.previewUrl && (
                    <a
                      href={wp.previewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary btn-sm"
                    >
                      Preview
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Static placeholders shown only when CMS is empty */}
      {!hasCmsData && (
        <div className="section-spacing grid gap-4 lg:grid-cols-3">
          <PlannedCard title="Reference architectures" description="Proven platform patterns for enterprise-scale AI rollout." />
          <PlannedCard title="Governance" description="Controls and audit frameworks that satisfy compliance requirements." />
          <PlannedCard title="Industry playbooks" description="Domain-specific deployment guides with real-world benchmarks." />
        </div>
      )}

      <EnterpriseCtaBand
        kicker="Operationalize"
        title="Turn white-paper guidance into implementation momentum"
        description="Bridge research and delivery with decision-ready artifacts across architecture, governance, and rollout."
        primaryHref="/resources"
        primaryLabel="Back to resources"
        secondaryHref="/updates"
        secondaryLabel="View latest updates"
      />
    </Layout>
  );
}

function PlannedCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="card-feature p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-caption font-semibold text-slate-900">{title}</div>
          <div className="mt-1 text-sm text-slate-600">{description}</div>
        </div>
        <span className="chip chip-muted rounded-md px-2.5 py-1 text-xs font-semibold">
          Planned
        </span>
      </div>
    </div>
  );
}
