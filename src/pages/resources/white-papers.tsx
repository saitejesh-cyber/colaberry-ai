import Layout from "../../components/Layout";
import Head from "next/head";
import Link from "next/link";
import EnterprisePageHero from "../../components/EnterprisePageHero";
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
  const seoMeta: SeoMeta = {
    title: "White Papers | Colaberry AI",
    description: "Technical deep-dives, POVs, and reference architectures for enterprise teams deploying AI at scale.",
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
              "description": "Technical deep-dives, POVs, and reference architectures for enterprise teams deploying AI at scale.",
              "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://colaberry.ai"}/resources/white-papers`,
            }),
          }}
        />
      </Head>

      <EnterprisePageHero
        kicker="Resources"
        title="White papers"
        description="Technical deep-dives, POVs, and reference architectures for enterprise teams deploying AI at scale."
        image={heroImage("hero-whitepapers-cinematic.webp")}
        alt="Enterprise research and architecture review surface"
        imageKicker="Research"
        imageTitle="Reference architectures"
        imageDescription="Technical guidance with reusable frameworks and governance patterns."
        chips={["Architecture", "Governance", "Playbooks", "POVs"]}
        primaryAction={{ label: "Open updates feed", href: "/updates" }}
        secondaryAction={{ label: "Back to resources", href: "/resources", variant: "secondary" }}
        metrics={[
          {
            label: "Focus",
            value: "Technical depth",
            note: "Implementation-ready guidance.",
          },
          {
            label: "Coverage",
            value: "Architecture + governance",
            note: "From system design to controls.",
          },
          {
            label: "Audience",
            value: "Engineering + leadership",
            note: "Built for cross-functional adoption.",
          },
        ]}
      />

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
          <PlannedCard title="Reference architectures" description="Platform patterns and enterprise rollout." />
          <PlannedCard title="Governance" description="Controls, auditability, and risk management." />
          <PlannedCard title="Industry playbooks" description="Domain-specific delivery frameworks." />
        </div>
      )}

      <div className="section-spacing flex flex-col gap-3 sm:flex-row">
        <Link
          href="/resources"
          className="btn btn-secondary"
        >
          Back to Resources
        </Link>
        <Link
          href="/updates"
          className="btn btn-primary"
        >
          View News & Product
        </Link>
      </div>
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
