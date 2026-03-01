import Layout from "../../../../components/Layout";
import Link from "next/link";
import Head from "next/head";
import type { GetServerSideProps } from "next";
import EnterprisePageHero from "../../../../components/EnterprisePageHero";
import EnterpriseCtaBand from "../../../../components/EnterpriseCtaBand";
import SectionHeader from "../../../../components/SectionHeader";
import StatePanel from "../../../../components/StatePanel";
import {
  fetchPodcastEpisodes,
  type Company,
  type PodcastEpisode,
  type Tag,
} from "../../../../lib/cms";
import { heroImage } from "../../../../lib/media";
import { seoTags, canonicalUrl as buildCanonical, type SeoMeta } from "../../../../lib/seo";

type TaggedEpisode = {
  id: number;
  title: string;
  slug: string;
  tags: Tag[];
  companies: Company[];
};

type PodcastTagPageProps = {
  tag: string;
  episodes: TaggedEpisode[];
  fetchError: boolean;
};

type RouteParams = {
  tag?: string;
};

export const getServerSideProps: GetServerSideProps<PodcastTagPageProps, RouteParams> = async ({
  params,
}) => {
  const tag = params?.tag ?? "";
  if (!tag) {
    return { notFound: true };
  }
  try {
    const allEpisodes = await fetchPodcastEpisodes({ maxRecords: 500 });
    const episodes: TaggedEpisode[] = allEpisodes
      .filter((episode: PodcastEpisode) =>
        (episode.tags || []).some((entry) => entry.slug?.toLowerCase() === tag.toLowerCase())
      )
      .map((episode) => ({
        id: episode.id,
        title: episode.title,
        slug: episode.slug,
        tags: episode.tags || [],
        companies: episode.companies || [],
      }));

    return {
      props: {
        tag,
        episodes,
        fetchError: false,
      },
    };
  } catch {
    return {
      props: {
        tag,
        episodes: [],
        fetchError: true,
      },
    };
  }
};

export default function PodcastTagPage({
  tag,
  episodes,
  fetchError,
}: PodcastTagPageProps) {
  const relatedTags = buildRelatedTagFacets(tag, episodes).slice(0, 8);
  const listeningTracks = [
    {
      title: "Topic orientation",
      description: "Review all episodes in this lane for consistent terminology and trend patterns.",
      href: "/resources/podcasts",
      cta: "Open all podcasts",
    },
    {
      title: "Company mapping",
      description: "Move from topic to company context to understand who is driving specific approaches.",
      href:
        episodes[0]?.companies?.[0]?.slug
          ? `/resources/podcasts/company?slug=${encodeURIComponent(episodes[0].companies[0].slug)}`
          : "/resources/podcasts",
      cta: "Open top company",
    },
    {
      title: "Execution planning",
      description: "Map episode insights to use cases and solution tracks before delivery decisions.",
      href: "/solutions",
      cta: "Review solutions",
    },
  ];
  const seoMeta: SeoMeta = {
    title: `#${tag} Podcasts | Colaberry AI`,
    description: `Podcast episodes tagged with #${tag}, including linked companies and direct episode access.`,
    canonical: buildCanonical(`/resources/podcasts/tag/${encodeURIComponent(tag)}`),
  };
  const uniqueCompanyCount = new Set(
    episodes.flatMap((episode) => (episode.companies || []).map((company) => company.slug).filter(Boolean))
  ).size;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://colaberry.ai").replace(/\/$/, "");
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `#${tag} podcast episodes`,
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
        kicker="Tag signal"
        title={`#${tag} podcasts`}
        description={`Episodes tagged with #${tag}, with company mappings and direct episode links.`}
        image={heroImage("hero-podcasts-cinematic.webp")}
        alt={`Podcast tag ${tag} signal`}
        imageKicker="Tag feed"
        imageTitle={`#${tag} episode lane`}
        imageDescription="Topic-tagged episodes surfaced for focused discovery."
        chips={[`#${tag}`, `${episodes.length} episodes`, `${uniqueCompanyCount} linked companies`]}
        primaryAction={{ label: "All podcasts", href: "/resources/podcasts" }}
        secondaryAction={{ label: "Resources hub", href: "/resources", variant: "secondary" }}
        metrics={[
          {
            label: "Tag",
            value: `#${tag}`,
            note: "Current taxonomy filter.",
          },
          {
            label: "Episodes",
            value: String(episodes.length),
            note: "Current episodes in this tag lane.",
          },
          {
            label: "Company links",
            value: String(uniqueCompanyCount),
            note: "Distinct company relationships.",
          },
        ]}
      />

      <section className="surface-panel section-spacing p-5 sm:p-6">
        <SectionHeader
          kicker="Topic strategy"
          title={`How to operationalize #${tag}`}
          description="Use a repeatable sequence to convert this topic signal into product and delivery action."
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
        {relatedTags.length > 0 ? (
          <div className="mt-4 border-t border-slate-200/70 pt-4 dark:border-slate-700/60">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
              Related tags
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {relatedTags.map((relatedTag) => (
                <Link
                  key={relatedTag.slug}
                  href={`/resources/podcasts/tag/${relatedTag.slug}`}
                  className="chip chip-neutral rounded-md px-3 py-1 text-xs font-semibold"
                >
                  #{relatedTag.name} ({relatedTag.count})
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <ul className="section-spacing grid gap-4">
        {episodes.map((e) => (
          <li key={e.id} className="surface-panel section-shell p-4">
            <div className="text-sm font-semibold text-slate-900">{e.title}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {e.companies?.map((company) => (
                <Link
                  key={company.slug}
                  href={`/resources/podcasts/company?slug=${encodeURIComponent(company.slug)}`}
                  className="chip chip-neutral rounded-md px-2.5 py-1 text-xs font-semibold"
                >
                  {company.name}
                </Link>
              ))}
            </div>
            <Link
              href={`/resources/podcasts/${e.slug}`}
              className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-slate-700 dark:text-slate-200 transition hover:translate-x-0.5 hover:text-slate-900 dark:hover:text-slate-100"
              aria-label={`View episode ${e.title}`}
            >
              View episode <span aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
        {episodes.length === 0 && (
          <li>
            <StatePanel
              variant="empty"
              title={`No episodes tagged with #${tag}`}
              description="Check back after new episodes are published."
            />
          </li>
        )}
      </ul>

      <EnterpriseCtaBand
        kicker="Continue discovery"
        title={`Expand beyond #${tag} into related enterprise signals`}
        description="Move from this topic lane to adjacent podcast signals, company filters, and implementation assets."
        primaryHref="/resources/podcasts"
        primaryLabel="Open all podcasts"
        secondaryHref="/resources"
        secondaryLabel="Back to resources"
      />
    </Layout>
  );
}

type RelatedTagFacet = {
  slug: string;
  name: string;
  count: number;
};

function buildRelatedTagFacets(currentTag: string, episodes: TaggedEpisode[]): RelatedTagFacet[] {
  const map = new Map<string, RelatedTagFacet>();
  for (const episode of episodes) {
    for (const topic of episode.tags || []) {
      if (!topic?.slug || topic.slug.toLowerCase() === currentTag.toLowerCase()) continue;
      const existing = map.get(topic.slug);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(topic.slug, {
          slug: topic.slug,
          name: topic.name || topic.slug,
          count: 1,
        });
      }
    }
  }
  return Array.from(map.values()).sort((left, right) => {
    if (right.count !== left.count) return right.count - left.count;
    return left.name.localeCompare(right.name);
  });
}
