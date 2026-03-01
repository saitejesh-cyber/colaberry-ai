import Layout from "../../../components/Layout";
import Link from "next/link";
import Head from "next/head";
import type { GetServerSideProps } from "next";
import EnterprisePageHero from "../../../components/EnterprisePageHero";
import EnterpriseCtaBand from "../../../components/EnterpriseCtaBand";
import SectionHeader from "../../../components/SectionHeader";
import StatePanel from "../../../components/StatePanel";
import {
  fetchPodcastEpisodes,
  type Company,
  type PodcastEpisode,
  type Tag,
} from "../../../lib/cms";
import { heroImage } from "../../../lib/media";
import { seoTags, canonicalUrl as buildCanonical, type SeoMeta } from "../../../lib/seo";

type CompanyEpisode = {
  id: number;
  title: string;
  slug: string;
  tags: Tag[];
  companies: Company[];
};

type PodcastCompanyPageProps = {
  companySlug: string;
  companyName: string;
  episodes: CompanyEpisode[];
  fetchError: boolean;
};

export const getServerSideProps: GetServerSideProps<PodcastCompanyPageProps> = async ({
  query,
}) => {
  const slug = typeof query?.slug === "string" ? query.slug : "";

  if (!slug) {
    return { notFound: true };
  }

  try {
    const allEpisodes = await fetchPodcastEpisodes({ maxRecords: 500 });
    const episodes: CompanyEpisode[] = allEpisodes
      .filter((episode: PodcastEpisode) =>
        (episode.companies || []).some((company) => company.slug?.toLowerCase() === slug.toLowerCase())
      )
      .map((episode) => ({
        id: episode.id,
        title: episode.title,
        slug: episode.slug,
        tags: episode.tags || [],
        companies: episode.companies || [],
      }));

    const companyName =
      episodes?.[0]?.companies?.[0]?.name ??
      slug;

    return {
      props: {
        companySlug: slug,
        companyName,
        episodes,
        fetchError: false,
      },
    };
  } catch {
    return {
      props: {
        companySlug: slug,
        companyName: slug,
        episodes: [],
        fetchError: true,
      },
    };
  }
};

export default function PodcastCompanyPage({
  companyName,
  companySlug,
  episodes,
  fetchError,
}: PodcastCompanyPageProps) {
  const listeningTracks = [
    {
      title: "Company overview",
      description: "Start with broad context to understand where this company appears in the AI ecosystem.",
      href: "/resources/podcasts",
      cta: "Open all podcasts",
    },
    {
      title: "Topic drill-down",
      description: "Use tags to narrow into specific implementation themes and execution signals.",
      href: episodes[0]?.tags?.[0]?.slug ? `/resources/podcasts/tag/${episodes[0].tags[0].slug}` : "/resources/podcasts",
      cta: "Open top topic",
    },
    {
      title: "Next action",
      description: "Map what you learn from episodes to relevant use cases and solution tracks.",
      href: "/use-cases",
      cta: "Browse use cases",
    },
  ];
  const seoMeta: SeoMeta = {
    title: `${companyName} Podcasts | Colaberry AI`,
    description: `Podcast episodes connected to ${companyName}, with tag context and direct episode links.`,
    canonical: buildCanonical(`/resources/podcasts/company?slug=${encodeURIComponent(companySlug)}`),
  };
  const uniqueTagCount = new Set(
    episodes.flatMap((episode) => (episode.tags || []).map((tag) => tag.slug).filter(Boolean))
  ).size;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://colaberry.ai").replace(/\/$/, "");
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${companyName} podcast episodes`,
    itemListElement: episodes.map((episode, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: episode.title,
      url: `${siteUrl}/resources/podcasts/${episode.slug}`,
    })),
  };

  return (
    <Layout>
      <Head>
        <title>{seoMeta.title}</title>
        {seoTags(seoMeta).map(({ key, ...props }) => (
          "rel" in props ? <link key={key} {...props} /> : <meta key={key} {...props} />
        ))}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      </Head>
      {fetchError && (
        <div className="section-spacing">
          <StatePanel
            variant="error"
            title="Podcast data is temporarily unavailable"
            description="Try again in a moment while we reconnect to the CMS."
          />
        </div>
      )}
      <EnterprisePageHero
        kicker="Company signal"
        title={`${companyName} podcasts`}
        description={`Episodes connected to ${companyName}, with direct links into podcast detail pages.`}
        image={heroImage("hero-podcasts-cinematic.webp")}
        alt={`${companyName} podcast signal`}
        imageKicker="Company feed"
        imageTitle={`${companyName} episode distribution`}
        imageDescription="Company-tagged episodes surfaced for fast discovery."
        chips={[`Company: ${companyName}`, `${episodes.length} episodes`, `${uniqueTagCount} linked tags`]}
        primaryAction={{ label: "All podcasts", href: "/resources/podcasts" }}
        secondaryAction={{ label: "Resources hub", href: "/resources", variant: "secondary" }}
        metrics={[
          {
            label: "Company",
            value: companyName,
            note: "Current company-focused listening lane.",
          },
          {
            label: "Episodes",
            value: String(episodes.length),
            note: "Current company-tagged episodes.",
          },
          {
            label: "Tag coverage",
            value: String(uniqueTagCount),
            note: "Distinct tags across these episodes.",
          },
        ]}
      />

      <section className="surface-panel section-spacing p-5 sm:p-6">
        <SectionHeader
          kicker="Listening strategy"
          title="How to use this company lens"
          description="Follow a structured path from broad company context to actionable implementation signals."
          size="md"
        />
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {listeningTracks.map((track) => (
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

      <ul className="section-spacing grid gap-4">
        {episodes.map((episode) => (
          <li key={episode.id} className="surface-panel section-shell p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{episode.title}</div>
              <span className="chip chip-neutral rounded-md px-2.5 py-1 text-xs font-semibold">
                {companySlug}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {episode.tags?.map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/resources/podcasts/tag/${tag.slug}`}
                  className="chip chip-muted rounded-md px-2.5 py-1 text-xs font-semibold"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
            <Link
              href={`/resources/podcasts/${episode.slug}`}
              className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-slate-700 dark:text-slate-200 transition hover:translate-x-0.5 hover:text-slate-900 dark:hover:text-slate-100"
              aria-label={`View episode ${episode.title}`}
            >
              View episode <span aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
        {episodes.length === 0 && (
          <li>
            <StatePanel
              variant="empty"
              title={`No episodes tagged for ${companyName}`}
              description="Check back after new episodes are published."
            />
          </li>
        )}
      </ul>

      <EnterpriseCtaBand
        kicker="Expand discovery"
        title={`Find adjacent signals beyond ${companyName}`}
        description="Explore broader podcast lanes, topic tags, and use-case mappings to continue discovery."
        primaryHref="/resources/podcasts"
        primaryLabel="Open all podcasts"
        secondaryHref="/resources"
        secondaryLabel="Back to resources"
      />
    </Layout>
  );
}
