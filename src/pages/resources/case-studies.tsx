import { useState } from "react";
import Head from "next/head";
import Layout from "../../components/Layout";
import Link from "next/link";
import SectionHeader from "../../components/SectionHeader";
import EnterprisePageHero from "../../components/EnterprisePageHero";
import { heroImage } from "../../lib/media";
import { seoTags, canonicalUrl as buildCanonical, type SeoMeta } from "../../lib/seo";
import type { GetStaticProps } from "next";
import { fetchCaseStudies, type CaseStudy } from "../../lib/cms";

type CaseStudiesProps = {
  caseStudies: CaseStudy[];
};

export const getStaticProps: GetStaticProps<CaseStudiesProps> = async () => {
  let caseStudies: CaseStudy[] = [];
  try {
    caseStudies = await fetchCaseStudies("public");
  } catch {
    // CMS unavailable — fall back to empty list (hardcoded industry links render below)
  }
  return { props: { caseStudies }, revalidate: 3600 };
};

const hardcodedIndustries = [
  { name: "Agriculture", slug: "agriculture" },
  { name: "Energy", slug: "energy" },
  { name: "Utilities", slug: "utilities" },
  { name: "Healthcare & Life Sciences", slug: "healthcare-life-sciences" },
  { name: "Climate Tech", slug: "climate-tech" },
  { name: "Manufacturing", slug: "manufacturing" },
  { name: "Fintech", slug: "fintech" },
  { name: "Supply Chain", slug: "supply-chain" },
];

export default function CaseStudiesHub({ caseStudies }: CaseStudiesProps) {
  const seoMeta: SeoMeta = {
    title: "Case Studies | Colaberry AI",
    description: "Browse delivery outcomes by industry. Each industry page contains detailed case studies with measurable results.",
    canonical: buildCanonical("/resources/case-studies"),
  };

  const hasCmsData = caseStudies.length > 0;

  // Build industry filter chips from CMS data
  const industrySet = new Set<string>();
  caseStudies.forEach((cs) => {
    if (cs.industry) industrySet.add(cs.industry);
  });
  const industries = Array.from(industrySet).sort();

  const [activeIndustry, setActiveIndustry] = useState<string | null>(null);

  const filtered = activeIndustry
    ? caseStudies.filter((cs) => cs.industry === activeIndustry)
    : caseStudies;

  return (
    <Layout>
      <Head>
        <title>{seoMeta.title}</title>
        {seoTags(seoMeta).map(({ key, ...props }) => (
          "rel" in props ? <link key={key} {...props} /> : <meta key={key} {...props} />
        ))}
        {caseStudies.length > 0 && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Colaberry AI Case Studies",
            "description": "Browse delivery outcomes by industry with detailed case studies and measurable results.",
            "url": buildCanonical("/resources/case-studies"),
            "publisher": { "@type": "Organization", "name": "Colaberry AI" },
          }) }} />
        )}
      </Head>
      <EnterprisePageHero
        kicker="Resources"
        title="Case studies"
        description="Browse delivery outcomes by industry with detailed case studies and measurable results."
        image={heroImage("hero-case-studies-cinematic.webp")}
        alt="Enterprise case study outcomes"
        imageKicker="Impact library"
        imageTitle="Outcome snapshots"
        imageDescription="Cross-industry delivery proof points."
        primaryAction={{ label: "Explore industries", href: "/industries" }}
        secondaryAction={{ label: "Browse all resources", href: "/resources", variant: "secondary" }}
      />

      {/* CMS-driven case study cards with industry filter chips */}
      {hasCmsData && (
        <>
          {/* Industry filter chips */}
          {industries.length > 1 && (
            <div className="mt-6 flex flex-wrap gap-2 sm:mt-8">
              <button
                onClick={() => setActiveIndustry(null)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeIndustry === null
                    ? "border-brand-deep bg-brand-deep text-white"
                    : "border-slate-200/80 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-[var(--stroke)] dark:bg-[var(--surface-strong)] dark:text-[var(--text-muted)] dark:hover:border-[#4B5563] dark:hover:bg-[#374151]"
                }`}
              >
                All ({caseStudies.length})
              </button>
              {industries.map((industry) => {
                const count = caseStudies.filter((cs) => cs.industry === industry).length;
                return (
                  <button
                    key={industry}
                    onClick={() => setActiveIndustry(activeIndustry === industry ? null : industry)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      activeIndustry === industry
                        ? "border-brand-deep bg-brand-deep text-white"
                        : "border-slate-200/80 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-[var(--stroke)] dark:bg-[var(--surface-strong)] dark:text-[var(--text-muted)] dark:hover:border-[#4B5563] dark:hover:bg-[#374151]"
                    }`}
                  >
                    {industry} ({count})
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((cs) => (
              <div
                key={cs.id}
                className="surface-panel border border-slate-200/80 bg-white/90 dark:bg-[var(--surface-strong)]/90 p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-slate-900">{cs.title}</div>
                    {cs.summary && (
                      <p className="mt-1 text-sm text-slate-600 line-clamp-3">{cs.summary}</p>
                    )}
                  </div>
                  {cs.industry && (
                    <span className="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      {cs.industry}
                    </span>
                  )}
                </div>
                {cs.clientName && (
                  <p className="mt-2 text-xs text-slate-500">Client: {cs.clientName}</p>
                )}
                {cs.outcomes && (
                  <p className="mt-2 text-xs text-slate-600 line-clamp-2">
                    <span className="font-medium text-slate-700">Outcomes:</span> {cs.outcomes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Hardcoded fallback: industry name links */}
      {!hasCmsData && (
        <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3">
          {hardcodedIndustries.map((item) => (
            <Link
              key={item.slug}
              href={`/industries/${item.slug}`}
              className="surface-panel surface-hover surface-interactive group border border-slate-200/80 bg-white/90 dark:bg-[var(--surface-strong)]/90 p-6"
              aria-label={`View ${item.name} case studies`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-slate-900">{item.name}</div>
                  <div className="mt-1 text-sm text-slate-600">View case studies and outcomes.</div>
                </div>
                <div className="mt-0.5 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                  <span aria-hidden="true">&rarr;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/resources"
          className="btn btn-secondary"
        >
          Back to Resources
        </Link>
        <Link
          href="/industries"
          className="btn btn-primary"
        >
          View Industries
        </Link>
      </div>
    </Layout>
  );
}
