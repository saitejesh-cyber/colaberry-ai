import type { GetStaticProps } from "next";
import Link from "next/link";
import Layout from "../../components/Layout";
import Head from "next/head";
import PremiumMediaCard from "../../components/PremiumMediaCard";
import EnterpriseCtaBand from "../../components/EnterpriseCtaBand";
import EnterprisePageHero from "../../components/EnterprisePageHero";
import SectionHeader from "../../components/SectionHeader";
import { heroImage } from "../../lib/media";
import { seoTags, canonicalUrl as buildCanonical, type SeoMeta } from "../../lib/seo";
import { fetchPodcastEpisodes, fetchArticles, fetchBooks, fetchCaseStudies } from "../../lib/cms";

type ResourceCounts = {
  podcasts: number;
  articles: number;
  books: number;
  caseStudies: number;
};
type ResourcesProps = { counts: ResourceCounts };

export const getStaticProps: GetStaticProps<ResourcesProps> = async () => {
  const counts: ResourceCounts = { podcasts: 0, articles: 0, books: 0, caseStudies: 0 };
  try {
    const [pods, arts, bks, cs] = await Promise.allSettled([
      fetchPodcastEpisodes(),
      fetchArticles(),
      fetchBooks(),
      fetchCaseStudies(),
    ]);
    if (pods.status === "fulfilled") counts.podcasts = pods.value.length;
    if (arts.status === "fulfilled") counts.articles = arts.value.length;
    if (bks.status === "fulfilled") counts.books = bks.value.length;
    if (cs.status === "fulfilled") counts.caseStudies = cs.value.length;
  } catch {}
  return { props: { counts }, revalidate: 600 };
};

export default function Resources({ counts }: ResourcesProps) {
  const totalAssets = counts.podcasts + counts.articles + counts.books + counts.caseStudies;
  const resourceHighlights = [
    {
      href: "/resources/podcasts",
      title: "Podcasts + transcripts",
      description: `${counts.podcasts > 0 ? `${counts.podcasts} episodes. ` : ""}Expert conversations on AI strategy, with full transcripts and inline playback.`,
      meta: "Audio",
      image: heroImage("hero-podcasts-cinematic.webp"),
    },
    {
      href: "/resources/white-papers",
      title: "White papers + POVs",
      description: "Actionable frameworks and architecture guides for enterprise AI rollouts.",
      meta: "Research",
      image: heroImage("hero-whitepapers-cinematic.webp"),
    },
    {
      href: "/resources/articles",
      title: "Articles + analysis",
      description: `${counts.articles > 0 ? `${counts.articles} articles. ` : ""}Practical guidance on deploying AI agents, from strategy to production.`,
      meta: "Editorial",
      image: heroImage("hero-updates-cinematic.webp"),
    },
    {
      href: "/resources/case-studies",
      title: "Case studies",
      description: `${counts.caseStudies > 0 ? `${counts.caseStudies} studies. ` : ""}Real-world AI deployments with measurable ROI and lessons learned.`,
      meta: "Outcomes",
      image: heroImage("hero-case-studies-cinematic.webp"),
    },
    {
      href: "/resources/books",
      title: "Books + artifacts",
      description: `${counts.books > 0 ? `${counts.books} titles. ` : ""}Books, templates, and reusable assets to accelerate AI adoption.`,
      meta: "Artifacts",
      image: heroImage("hero-books-cinematic.webp"),
    },
  ];
  const decisionTracks = [
    {
      title: "Executive decision pack",
      description: "ROI narrative, risk framing, and real deployment evidence for leadership reviews.",
      href: "/resources/case-studies",
      cta: "Open case studies",
      note: "Best for CIOs, transformation leaders, and sponsors.",
    },
    {
      title: "Architecture readiness pack",
      description: "Reference guides and implementation patterns for teams planning governed rollouts.",
      href: "/resources/white-papers",
      cta: "Read white papers",
      note: "Best for solution architects and platform engineers.",
    },
    {
      title: "Delivery acceleration pack",
      description: "Practical episodes, playbooks, and templates your squads can apply immediately.",
      href: "/resources/podcasts",
      cta: "Browse podcasts",
      note: "Best for delivery leads and implementation teams.",
    },
  ];
  const objectiveCollections = [
    {
      title: "Prove business impact",
      description: "Use case studies and executive briefings to validate ROI before scaling.",
      href: "/resources/case-studies",
      label: "ROI proof",
    },
    {
      title: "De-risk implementation",
      description: "Use white papers and architecture notes to define controls, ownership, and guardrails.",
      href: "/resources/white-papers",
      label: "Risk controls",
    },
    {
      title: "Upskill delivery teams",
      description: "Use podcasts and books to align teams on modern AI delivery operating models.",
      href: "/resources/books",
      label: "Team enablement",
    },
  ];

  const seoMeta: SeoMeta = {
    title: "Resources | Colaberry AI - Podcasts, Books, White Papers, Case Studies",
    description: "Podcasts, white papers, case studies, and books to help your team plan, deploy, and scale enterprise AI with confidence.",
    canonical: buildCanonical("/resources"),
  };

  return (
    <Layout>
      <Head>
        <title>{seoMeta.title}</title>
        {seoTags(seoMeta).map(({ key, ...props }) => (
          "rel" in props ? <link key={key} {...props} /> : <meta key={key} {...props} />
        ))}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Colaberry AI Resources",
          "description": "Podcasts, white papers, case studies, and books to plan, deploy, and scale enterprise AI.",
          "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://colaberry.ai"}/resources`,
        }) }} />
      </Head>
      <EnterprisePageHero
        kicker="Knowledge hub"
        title="Resources"
        description="Everything your team needs to evaluate, plan, and deliver enterprise AI -- from strategy podcasts to production-ready frameworks."
        image={heroImage("hero-resources-cinematic.webp")}
        alt="Research workspace overview"
        imageKicker="All formats"
        imageTitle="One place for AI knowledge"
        imageDescription="Podcasts, books, white papers, and case studies curated for decision-makers and practitioners."
        chips={["Podcasts", "White papers", "Books", "Case studies", "Articles"]}
        primaryAction={{ label: "Browse podcasts", href: "/resources/podcasts" }}
        secondaryAction={{ label: "Open updates feed", href: "/updates", variant: "secondary" }}
        metrics={[
          {
            label: "Published assets",
            value: totalAssets > 0 ? `${totalAssets}` : "Growing",
            note: "Live podcasts, articles, books, and case studies.",
          },
          {
            label: "Updated",
            value: "Continuously",
            note: "New content published and refreshed regularly.",
          },
          {
            label: "Built for",
            value: "Decision-makers",
            note: "Strategy, architecture, and ROI -- not just theory.",
          },
        ]}
      />

      <section className="section-spacing grid gap-3 sm:grid-cols-2">
        {resourceHighlights.map((item) => (
          <PremiumMediaCard
            key={item.title}
            href={item.href}
            title={item.title}
            description={item.description}
            image={item.image}
            meta={item.meta}
            size="sm"
          />
        ))}
      </section>

      <section className="surface-panel section-shell section-spacing p-5 sm:p-6">
        <SectionHeader
          kicker="Decision tracks"
          title="Choose the right path by role and objective"
          description="Each track bundles the fastest way to get from research to action, based on what your team needs to decide next."
          size="md"
        />
        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          {decisionTracks.map((track) => (
            <article key={track.title} className="card-feature p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                {track.note}
              </div>
              <h2 className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{track.title}</h2>
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

      <div className="surface-panel section-shell section-spacing p-5 sm:p-6">
        <div className="text-label font-semibold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-300">
          Search resources
        </div>
        <label htmlFor="resource-search" className="sr-only">
          Search resources
        </label>
        <form action="/search" method="get" role="search" className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            id="resource-search"
            name="q"
            type="search"
            placeholder="Search podcasts, white papers, case studies..."
            aria-describedby="resource-search-help"
            className="input-premium"
          />
          <button type="submit" className="btn btn-primary btn-sm shrink-0">
            Search
          </button>
        </form>
        <p id="resource-search-help" className="mt-2 text-xs text-slate-500">
          Search routes to the global catalog results page.
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
          {["Podcasts", "White papers", "Case studies", "Updates", "Artifacts"].map((label) => (
            <span
              key={label}
              className="chip chip-muted rounded-md border border-slate-200/80 bg-white px-3 py-1 font-semibold"
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      <section className="surface-panel section-shell section-spacing p-5 sm:p-6">
        <SectionHeader
          kicker="By objective"
          title="Collections organized around enterprise outcomes"
          description="Skip generic browsing and jump directly into content grouped for specific business priorities."
          size="md"
        />
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {objectiveCollections.map((collection) => (
            <Link key={collection.title} href={collection.href} className="card-feature p-4">
              <span className="chip chip-neutral rounded-full px-2.5 py-1 text-[11px] font-semibold">
                {collection.label}
              </span>
              <h2 className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                {collection.title}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {collection.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <div className="section-spacing grid gap-3 sm:grid-cols-3">
        <ResourceQuickLink href="/solutions" title="Solutions" description="Pre-built AI solutions ready for enterprise deployment." />
        <ResourceQuickLink href="/updates" title="News & product" description="Latest product updates, releases, and industry news." />
        <ResourceQuickLink href="/search" title="Search catalog" description="Find any resource instantly across all content types." />
      </div>

      <div className="surface-panel section-shell section-spacing p-6">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300">
          What&apos;s next
        </div>
        <div className="mt-3 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
          <div className="section-card rounded-lg p-4">
            <div className="font-semibold text-slate-900">Original research</div>
            <div className="mt-1 text-slate-600">
              New white papers, podcasts, and case studies published on a regular cadence.
            </div>
          </div>
          <div className="section-card rounded-lg p-4">
            <div className="font-semibold text-slate-900">Curated industry signals</div>
            <div className="mt-1 text-slate-600">
              Hand-picked external insights and market intelligence relevant to your AI strategy.
            </div>
          </div>
        </div>
      </div>

      <EnterpriseCtaBand
        kicker="Stay informed"
        title="Make faster AI decisions with the right knowledge."
        description="Explore podcasts, white papers, case studies, and books built for teams evaluating and deploying enterprise AI."
        primaryHref="/resources/podcasts"
        primaryLabel="Browse podcasts"
        secondaryHref="/updates"
        secondaryLabel="Open updates feed"
      />
    </Layout>
  );
}

function ResourceQuickLink({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link href={href} className="card-feature p-4">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <p className="mt-1 text-xs text-slate-600">{description}</p>
    </Link>
  );
}
