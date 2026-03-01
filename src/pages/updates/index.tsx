import { useState } from "react";
import Layout from "../../components/Layout";
import Head from "next/head";
import { GetStaticProps } from "next";
import Link from "next/link";
import SectionHeader from "../../components/SectionHeader";
import StatePanel from "../../components/StatePanel";
import PremiumMediaCard from "../../components/PremiumMediaCard";
import EnterpriseCtaBand from "../../components/EnterpriseCtaBand";
import NewsletterSignup from "../../components/NewsletterSignup";
import EnterprisePageHero from "../../components/EnterprisePageHero";
import { heroImage } from "../../lib/media";
import {
  fetchGaiInsightsBriefing,
  fetchGaiInsightsRatings,
  GaiBriefing,
  GaiRatingItem,
} from "../../lib/gaiInsights";
import { seoTags, canonicalUrl as buildCanonical, type SeoMeta } from "../../lib/seo";

type UpdatesProps = {
  ratings: GaiRatingItem[];
  briefing: GaiBriefing;
  fetchError: boolean;
};

export const getStaticProps: GetStaticProps<UpdatesProps> = async () => {
  let fetchError = false;
  let ratings: GaiRatingItem[] = [];
  let briefing: GaiBriefing = { items: [] };

  try {
    ratings = await fetchGaiInsightsRatings();
  } catch {
    fetchError = true;
  }

  try {
    briefing = await fetchGaiInsightsBriefing();
  } catch {
    fetchError = true;
  }

  const safeRatings: GaiRatingItem[] = ratings.slice(0, 24).map((item) => {
    const safe: GaiRatingItem = { title: item.title };
    if (item.date) safe.date = item.date;
    if (item.rating) safe.rating = item.rating;
    if (item.url) safe.url = item.url;
    if (item.rationale) safe.rationale = item.rationale.slice(0, 420);
    return safe;
  });

  const safeBriefing: GaiBriefing = { items: briefing.items };
  if (briefing.date) {
    safeBriefing.date = briefing.date;
  }

  return {
    props: {
      ratings: safeRatings,
      briefing: safeBriefing,
      fetchError,
    },
    revalidate: 21600,
  };
};

type CategoryTab = "All" | "Product" | "AI News" | "Research";

const CATEGORY_TABS: CategoryTab[] = ["All", "Product", "AI News", "Research"];

const CATEGORY_MAP: Record<string, CategoryTab> = {
  Product: "Product",
  Signals: "AI News",
  Research: "Research",
  Roadmap: "Product",
};

const COLLAPSED_RATINGS_COUNT = 8;

export default function Updates({ ratings, briefing, fetchError }: UpdatesProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryTab>("All");
  const [showAllRatings, setShowAllRatings] = useState(false);

  const updateHighlights = [
    {
      href: "/updates",
      title: "Product releases",
      description: "What shipped this week and what it means for your team.",
      meta: "Product",
      image: heroImage("hero-platform-cinematic.webp"),
    },
    {
      href: "/resources/white-papers",
      title: "Research drops",
      description: "New white papers and analysis you can share with stakeholders.",
      meta: "Research",
      image: heroImage("hero-resources-cinematic.webp"),
    },
    {
      href: "https://gaiinsights.com/articles",
      title: "Ecosystem signals",
      description: "The AI headlines that matter, rated and summarized daily.",
      meta: "Signals",
      image: heroImage("hero-updates-cinematic.webp"),
      external: true,
    },
    {
      href: "/solutions",
      title: "Roadmap highlights",
      description: "See what is coming next and plan your rollout accordingly.",
      meta: "Roadmap",
      image: heroImage("hero-solutions-cinematic.webp"),
    },
  ];

  const filteredHighlights =
    activeCategory === "All"
      ? updateHighlights
      : updateHighlights.filter(
          (item) => CATEGORY_MAP[item.meta] === activeCategory
        );

  const visibleRatings = showAllRatings
    ? ratings
    : ratings.slice(0, COLLAPSED_RATINGS_COUNT);
  const ratingSummary = ratings.reduce(
    (acc, item) => {
      const bucket = getRatingBucket(item.rating);
      acc[bucket] += 1;
      return acc;
    },
    { essential: 0, important: 0, watchlist: 0, unrated: 0 }
  );
  const categoryCounts = CATEGORY_TABS.reduce<Record<CategoryTab, number>>(
    (acc, tab) => {
      acc[tab] =
        tab === "All"
          ? updateHighlights.length
          : updateHighlights.filter((item) => CATEGORY_MAP[item.meta] === tab).length;
      return acc;
    },
    { All: 0, Product: 0, "AI News": 0, Research: 0 }
  );
  const updateActions = [
    {
      title: "Run morning brief",
      description: "Start each day with the top rated stories and briefing headlines.",
      href: "#ratings",
      cta: "Open command center",
    },
    {
      title: "Share stakeholder digest",
      description: "Package product releases and priority signals into one leadership-ready narrative.",
      href: "/resources/white-papers",
      cta: "Open research assets",
    },
    {
      title: "Convert signals to roadmap",
      description: "Map updates to active initiatives, use cases, and implementation milestones.",
      href: "/solutions",
      cta: "Review solution tracks",
    },
  ];

  const seoMeta: SeoMeta = {
    title: "Updates | Colaberry AI",
    description: "Stay ahead with product releases, curated AI news ratings, and daily briefings in one enterprise feed.",
    canonical: buildCanonical("/updates"),
  };

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
              "name": "Colaberry AI Updates",
              "description": "Stay ahead with product releases, curated AI news ratings, and daily briefings in one enterprise feed.",
              "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://colaberry.ai"}/updates`,
            }),
          }}
        />
      </Head>
      <EnterprisePageHero
        kicker="Stay current"
        title="One feed for everything that matters in AI"
        description="Product releases, top-rated AI news, and daily briefings -- all in one place so your team never misses a signal."
        image={heroImage("hero-updates-cinematic.webp")}
        alt="City skyline highlighting update signals"
        imageKicker="Signal feed"
        imageTitle="Curated, rated, and ready"
        imageDescription="Every item is rated for relevance so you focus on what drives decisions."
        chips={["Product releases", "Daily briefings", "Top-rated AI news", "Research drops"]}
        primaryAction={{ label: "Open updates feed", href: "/updates" }}
        secondaryAction={{ label: "View GAI Insights", href: "https://gaiinsights.com/ratings", external: true, variant: "secondary" }}
        metrics={[
          { label: "Rated stories", value: `${ratings.length}`, note: "Expert-rated for enterprise relevance." },
          { label: "Briefing items", value: `${briefing.items.length}`, note: "Today's top headlines, curated." },
          { label: "Refresh cycle", value: "6 hrs", note: "Updated automatically throughout the day." },
        ]}
      />

      <section className="surface-panel mt-6 p-5 sm:p-6">
        <SectionHeader
          kicker="Operating rhythm"
          title="Use updates as an enterprise signal command center"
          description="Filter what matters, prioritize execution-critical insights, and route each signal to the right team."
          size="md"
        />
        <nav className="mt-4 flex flex-wrap gap-2" aria-label="Update categories">
          {CATEGORY_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveCategory(tab)}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
              activeCategory === tab
                ? "border-brand-deep bg-brand-deep text-white dark:border-brand-deep dark:bg-brand-deep"
                  : "border-slate-200/80 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:bg-[var(--surface-soft)] dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-600"
              }`}
            >
              {tab} ({categoryCounts[tab]})
            </button>
          ))}
        </nav>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SignalSnapshot title="Essential" value={String(ratingSummary.essential)} tone="essential" />
          <SignalSnapshot title="Important" value={String(ratingSummary.important)} tone="important" />
          <SignalSnapshot title="Watchlist" value={String(ratingSummary.watchlist)} tone="watchlist" />
          <SignalSnapshot title="Unrated" value={String(ratingSummary.unrated)} tone="neutral" />
        </div>
      </section>

      <section className="mt-4 grid gap-3 sm:grid-cols-2">
        {filteredHighlights.length > 0 ? (
          filteredHighlights.map((item) => (
            <PremiumMediaCard
              key={item.title}
              href={item.href}
              title={item.title}
              description={item.description}
              image={item.image}
              meta={item.meta}
              external={item.external}
              size="sm"
            />
          ))
        ) : (
          <div className="col-span-full">
            <StatePanel
              variant="empty"
              title="No items in this category"
              description="Switch to another category to see update highlights."
            />
          </div>
        )}
      </section>

      <section className="surface-panel mt-6 p-5 sm:p-6">
        <SectionHeader
          kicker="Action playbook"
          title="What high-performing teams do with this feed"
          description="Three repeatable actions to convert daily updates into roadmap movement."
          size="md"
        />
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {updateActions.map((action) => (
            <article key={action.title} className="card-feature p-4">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{action.title}</h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {action.description}
              </p>
              <Link href={action.href} className="btn btn-ghost mt-3 text-xs">
                {action.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      {fetchError && (
        <div className="mt-6">
          <StatePanel
            variant="error"
            title="GAI Insights feed is temporarily unavailable"
            description="Showing cached content where available. We will retry on the next refresh window."
            action={
              <a
                href="https://gaiinsights.com/ratings"
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
              >
                Visit GAI Insights
              </a>
            }
          />
        </div>
      )}

      <div id="ratings" className="mt-6 grid gap-4 sm:mt-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="surface-panel p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              kicker="Curated feed"
              title="Top-rated AI news"
              description="Expert-rated stories with rationale so you know why each one matters."
              size="md"
            />
            <a
              href="https://gaiinsights.com/ratings"
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost mt-3 sm:mt-0"
            >
              View all ratings
            </a>
          </div>

          {ratings.length === 0 ? (
            <div className="mt-4">
              <StatePanel
                variant="empty"
                title="No ratings available"
                description="GAI Insights ratings will appear here after the next refresh."
              />
            </div>
          ) : (
            <>
              <ul className="mt-5 grid gap-4">
                {visibleRatings.map((item, index) => (
                  <li
                    key={`${item.title}-${item.date || index}`}
                    className={`card-elevated overflow-hidden rounded-xl p-4 ${ratingBorderLeft(item.rating)}`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="text-xs font-semibold text-slate-500">
                        {item.date || "Latest rating"}
                      </span>
                      {item.rating ? (
                        <span
                          className={`rounded-md px-2.5 py-1 text-xs font-semibold uppercase ${ratingTone(
                            item.rating
                          )}`}
                        >
                          {item.rating}
                        </span>
                      ) : null}
                    </div>
                    <a
                      href={item.url || "https://gaiinsights.com/ratings"}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 block text-sm font-semibold text-[var(--pivot-fill)] hover:text-[var(--pivot-fill)] dark:text-[var(--brand-purple-light)] dark:hover:text-[var(--text-primary)]"
                    >
                      {item.title}
                    </a>
                    {item.rationale ? (
                      <p className="mt-2 text-xs text-slate-600 line-clamp-3">{item.rationale}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
              {ratings.length > COLLAPSED_RATINGS_COUNT && (
                <button
                  type="button"
                  onClick={() => setShowAllRatings((prev) => !prev)}
                  className="btn btn-ghost mt-4 w-full text-center text-sm"
                >
                  {showAllRatings
                    ? `Show fewer`
                    : `Show all ${ratings.length} ratings`}
                </button>
              )}
            </>
          )}
        </section>

        <section className="surface-panel p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              kicker="Daily briefing"
              title="Today's AI briefing"
              description={
                briefing.date
                  ? `Briefing for ${briefing.date}.`
                  : "The day's most important AI headlines, curated by GAI Insights."
              }
              size="md"
            />
            <a
              href="https://gaiinsights.com/articles"
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost mt-3 whitespace-nowrap sm:mt-0"
            >
              Open briefing
            </a>
          </div>

          {briefing.items.length === 0 ? (
            <div className="mt-4">
              <StatePanel
                variant="empty"
                title="No briefing items yet"
                description="Daily briefing links will appear here as they publish."
              />
            </div>
          ) : (
            <ul className="mt-5 grid gap-3">
              {briefing.items.slice(0, 12).map((item, index) => (
                <li
                  key={`${item.title}-${index}`}
                  className="card-elevated flex items-start gap-3 px-3 py-2"
                >
                  <span className="mt-0.5 text-xs font-semibold text-slate-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-[var(--pivot-fill)] hover:text-[var(--pivot-fill)] dark:text-[var(--brand-purple-light)] dark:hover:text-[var(--text-primary)]"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="surface-panel mt-6 p-6">
        <SectionHeader
          kicker="Stay informed"
          title="Get updates delivered to your inbox"
          description="One weekly digest with product releases, top AI news, and implementation notes."
          size="md"
        />
        <div className="mt-4">
          <NewsletterSignup
            sourcePath="/updates"
            sourcePage="updates-page"
            title="Never miss a release"
            description="Platform updates, curated AI news, and actionable implementation notes -- one email, no noise."
            ctaLabel="Subscribe"
          />
        </div>
      </section>

      <EnterpriseCtaBand
        kicker="Take action"
        title="Turn today's AI signals into your next move"
        description="Connect the dots between news, product updates, and your rollout plan -- all in one place."
        primaryHref="/aixcelerator"
        primaryLabel="Explore AIXcelerator"
        secondaryHref="/resources"
        secondaryLabel="Explore resources"
      />
    </Layout>
  );
}

function SignalSnapshot({
  title,
  value,
  tone,
}: {
  title: string;
  value: string;
  tone: "essential" | "important" | "watchlist" | "neutral";
}) {
  const toneClass =
    tone === "essential"
      ? "border-emerald-300/70 bg-emerald-50/80 text-emerald-900 dark:border-emerald-400/40 dark:bg-emerald-950/40 dark:text-emerald-100"
      : tone === "important"
      ? "border-amber-300/70 bg-amber-50/80 text-amber-900 dark:border-amber-400/40 dark:bg-amber-950/40 dark:text-amber-100"
      : tone === "watchlist"
      ? "border-slate-300/70 bg-slate-100/80 text-slate-800 dark:border-slate-500/40 dark:bg-slate-900/60 dark:text-slate-100"
      : "border-slate-200/70 bg-white/80 text-slate-900 dark:border-slate-600/60 dark:bg-[var(--surface-soft)] dark:text-slate-100";

  return (
    <div className={`section-card rounded-xl border p-4 ${toneClass}`}>
      <div className="text-xs font-semibold uppercase tracking-[0.14em]">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function getRatingBucket(rating?: string): "essential" | "important" | "watchlist" | "unrated" {
  if (!rating) return "unrated";
  const normalized = rating.toLowerCase();
  if (normalized.includes("essential")) return "essential";
  if (normalized.includes("important")) return "important";
  if (normalized.includes("watch") || normalized.includes("optional")) return "watchlist";
  return "unrated";
}

function ratingBorderLeft(rating?: string) {
  if (!rating) return "border-l-4 border-l-slate-200";
  const normalized = rating.toLowerCase();
  if (normalized.includes("essential")) {
    return "border-l-4 border-l-emerald-500";
  }
  if (normalized.includes("important")) {
    return "border-l-4 border-l-amber-500";
  }
  if (normalized.includes("watch") || normalized.includes("optional")) {
    return "border-l-4 border-l-slate-400";
  }
  return "border-l-4 border-l-slate-300";
}

function ratingTone(rating: string) {
  const normalized = rating.toLowerCase();
  if (normalized.includes("essential")) {
    return "bg-[var(--trusted-surface)] text-[var(--trusted-text)] ring-1 ring-inset ring-[var(--trusted-stroke)] dark:bg-[var(--trusted-surface)] dark:text-[var(--trusted-text)] dark:ring-[var(--trusted-stroke)]";
  }
  if (normalized.includes("important")) {
    return "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200 dark:bg-amber-900/30 dark:text-amber-100 dark:ring-amber-500/35";
  }
  if (normalized.includes("watch") || normalized.includes("optional")) {
    return "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200 dark:bg-slate-800/75 dark:text-slate-100 dark:ring-slate-600/70";
  }
  return "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200 dark:bg-slate-800/75 dark:text-slate-100 dark:ring-slate-600/70";
}
