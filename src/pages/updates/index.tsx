import { useState } from "react";
import Layout from "../../components/Layout";
import Head from "next/head";
import { GetStaticProps } from "next";
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
      description: "Feature updates, changelogs, and release notes.",
      meta: "Product",
      image: heroImage("hero-platform-cinematic.webp"),
    },
    {
      href: "/resources/white-papers",
      title: "Research drops",
      description: "New white papers, POVs, and technical assets.",
      meta: "Research",
      image: heroImage("hero-resources-cinematic.webp"),
    },
    {
      href: "https://gaiinsights.com/articles",
      title: "Ecosystem signals",
      description: "Curated headlines and market signals in one feed.",
      meta: "Signals",
      image: heroImage("hero-updates-cinematic.webp"),
      external: true,
    },
    {
      href: "/solutions",
      title: "Roadmap highlights",
      description: "What is shipping next across the platform layers.",
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

  const seoMeta: SeoMeta = {
    title: "Updates | Colaberry AI",
    description: "Announcements, releases, and curated AI ecosystem signals in one enterprise feed.",
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
              "description": "Announcements, releases, and curated AI ecosystem signals in one enterprise feed.",
              "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://colaberry.ai"}/updates`,
            }),
          }}
        />
      </Head>
      <EnterprisePageHero
        kicker="Modular layer"
        title="News & product"
        description="Announcements, releases, and curated AI ecosystem signals in one enterprise feed."
        image={heroImage("hero-updates-cinematic.webp")}
        alt="City skyline highlighting update signals"
        imageKicker="Signal feed"
        imageTitle="Updates and announcements"
        imageDescription="Product shipping notes, curated headlines, and briefing-level intelligence."
        chips={["Product releases", "Daily briefings", "Top-rated AI news", "Research drops"]}
        primaryAction={{ label: "Open updates feed", href: "/updates" }}
        secondaryAction={{ label: "View GAI Insights", href: "https://gaiinsights.com/ratings", external: true, variant: "secondary" }}
        metrics={[
          { label: "Top-rated news", value: `${ratings.length}`, note: "Curated items in current refresh." },
          { label: "Briefing signals", value: `${briefing.items.length}`, note: "Headlines in current briefing." },
          { label: "Refresh cycle", value: "6h", note: "Cache and revalidation cadence." },
        ]}
      />

      {/* Category filter tabs */}
      <nav className="mt-6 flex flex-wrap gap-2" aria-label="Update categories">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveCategory(tab)}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
              activeCategory === tab
                ? "border-brand-deep bg-brand-deep text-white dark:border-brand-deep dark:bg-brand-deep"
                : "border-slate-200/80 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:bg-[var(--surface-soft)] dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

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

      <div className="mt-6 grid gap-4 sm:mt-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="surface-panel border border-slate-200/80 bg-white/90 p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              kicker="Curated feed"
              title="Top-Rated AI News"
              description="Daily ratings and rationale from GAI Insights."
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

        <section className="surface-panel border border-slate-200/80 bg-white/90 p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              kicker="Daily briefing"
              title="Daily AI News Briefing"
              description={
                briefing.date
                  ? `Briefing for ${briefing.date}.`
                  : "Daily external headlines curated by GAI Insights."
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

      <section className="surface-panel mt-6 border border-slate-200/80 bg-white/90 p-6">
        <SectionHeader
          kicker="Subscription"
          title="Newsletter and release alerts"
          description="Subscribe for product releases, AI news briefings, and enterprise rollout signals."
          size="md"
        />
        <div className="mt-4">
          <NewsletterSignup
            sourcePath="/updates"
            sourcePage="updates-page"
            title="Stay informed"
            description="One digest covering platform releases, curated AI signals, and implementation notes."
            ctaLabel="Subscribe"
          />
        </div>
      </section>

      <EnterpriseCtaBand
        kicker="Update workflow"
        title="Turn AI signals into enterprise action"
        description="Connect product releases, curated news, and implementation playbooks into one decision surface for delivery teams."
        primaryHref="/aixcelerator"
        primaryLabel="Explore AIXcelerator"
        secondaryHref="/resources"
        secondaryLabel="Explore resources"
      />
    </Layout>
  );
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
