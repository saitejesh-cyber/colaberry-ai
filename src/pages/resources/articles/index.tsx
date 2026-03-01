import type { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import Layout from "../../../components/Layout";
import EnterprisePageHero from "../../../components/EnterprisePageHero";
import EnterpriseCtaBand from "../../../components/EnterpriseCtaBand";
import SectionHeader from "../../../components/SectionHeader";
import StatePanel from "../../../components/StatePanel";
import { heroImage } from "../../../lib/media";
import { Article, fetchArticles } from "../../../lib/cms";
import { seoTags, canonicalUrl as buildCanonical, type SeoMeta } from "../../../lib/seo";

type ArticlesPageProps = {
  articles: Article[];
  fetchError: boolean;
};

export const getStaticProps: GetStaticProps<ArticlesPageProps> = async () => {
  let articles: Article[] = [];
  let fetchError = false;

  try {
    articles = await fetchArticles({ maxRecords: 80 });
  } catch {
    fetchError = true;
  }

  return {
    props: {
      articles,
      fetchError,
    },
    revalidate: 600,
  };
};

export default function ArticlesPage({ articles, fetchError }: ArticlesPageProps) {
  const editorialLanes = [
    {
      title: "Executive perspective",
      description: "Guidance on ROI framing, governance posture, and enterprise AI operating models.",
      href: "/resources/case-studies",
      cta: "View case studies",
    },
    {
      title: "Architecture perspective",
      description: "Implementation patterns for reliability, integration, and scalable delivery.",
      href: "/resources/white-papers",
      cta: "Read white papers",
    },
    {
      title: "Delivery perspective",
      description: "Practical notes from teams deploying agents and MCP-enabled workflows.",
      href: "/resources/podcasts",
      cta: "Browse podcasts",
    },
  ];
  const categoryCounts = articles.reduce<Record<string, number>>((acc, article) => {
    const key = article.category?.name || "Article";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
  const topCategories = Object.entries(categoryCounts)
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, 8);
  const seoMeta: SeoMeta = {
    title: "Articles | Colaberry AI",
    description: "Actionable articles on enterprise AI deployment -- from agent architecture to production best practices and ROI analysis.",
    canonical: buildCanonical("/resources/articles"),
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
          "name": "Colaberry AI Articles",
          "description": "Actionable articles on enterprise AI deployment, agent architecture, and production best practices.",
          "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://colaberry.ai"}/resources/articles`,
        }) }} />
      </Head>

      <EnterprisePageHero
        kicker="Resources"
        title="Articles"
        description="Practical guidance for teams deploying AI agents in production -- from architecture decisions to measurable outcomes."
        image={heroImage("hero-articles-cinematic.webp")}
        alt="Enterprise AI articles and analysis"
        imageKicker="Expert analysis"
        imageTitle="AI deployment insights"
        imageDescription="Written for decision-makers and practitioners shipping AI in production."
        chips={["Strategy", "Architecture", "Best practices", "ROI analysis"]}
        primaryAction={{ label: "Open updates feed", href: "/updates" }}
        secondaryAction={{ label: "Back to resources", href: "/resources", variant: "secondary" }}
        metrics={[
          {
            label: "Articles",
            value: String(articles.length),
            note: "Published and continuously updated.",
          },
          {
            label: "Focus",
            value: "Production AI",
            note: "Real deployments, not just theory.",
          },
          {
            label: "Audience",
            value: "Leaders + builders",
            note: "Strategy through implementation.",
          },
        ]}
      />

      <section className="surface-panel section-spacing p-5 sm:p-6">
        <SectionHeader
          kicker="Editorial streams"
          title="Read by role, not by guesswork"
          description="Choose the stream that matches your current decision point and move faster from reading to execution."
          size="md"
        />
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {editorialLanes.map((lane) => (
            <article key={lane.title} className="card-feature p-4">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{lane.title}</h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {lane.description}
              </p>
              <Link href={lane.href} className="btn btn-ghost mt-3 text-xs">
                {lane.cta}
              </Link>
            </article>
          ))}
        </div>
        {topCategories.length > 0 ? (
          <div className="mt-4 border-t border-slate-200/70 pt-4 dark:border-slate-700/60">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
              Top categories
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {topCategories.map(([name, count]) => (
                <span key={`${name}-${count}`} className="chip chip-neutral rounded-md px-3 py-1 text-xs font-semibold">
                  {name} ({count})
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      {fetchError ? (
        <div className="section-spacing">
          <StatePanel
            variant="error"
            title="Articles are temporarily unavailable"
            description="The CMS feed could not be reached. Please retry in a few minutes."
          />
        </div>
      ) : null}

      {articles.length === 0 ? (
        <div className="section-spacing">
          <StatePanel
            variant="empty"
            title="No articles published yet"
            description="Publish articles in CMS and they will appear here automatically."
          />
        </div>
      ) : (
        <div className="section-spacing grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => {
            const category = article.category?.name || "Article";
            const updatedLabel = formatDateLabel(article.updatedAt || article.publishedAt);
            return (
              <Link
                key={article.id}
                href={`/resources/articles/${article.slug}`}
                className="card-feature group p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="chip chip-muted rounded-md border border-slate-200/80 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {category}
                  </span>
                  {updatedLabel ? (
                    <span className="text-label font-semibold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-300">
                      {updatedLabel}
                    </span>
                  ) : null}
                </div>
                <div className="mt-3 text-caption font-semibold text-slate-900">{article.title}</div>
                <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                  {article.description || "Open this article to read the full content."}
                </p>
                {article.author?.name ? (
                  <p className="mt-3 text-xs font-medium text-slate-500">By {article.author.name}</p>
                ) : null}
              </Link>
            );
          })}
        </div>
      )}

      <EnterpriseCtaBand
        kicker="Stay aligned"
        title="Turn article insights into rollout decisions"
        description="Use these articles to align leadership, architecture, and delivery teams on a single enterprise AI strategy."
        primaryHref="/resources"
        primaryLabel="Back to resources"
        secondaryHref="/updates"
        secondaryLabel="View latest updates"
      />
    </Layout>
  );
}

function formatDateLabel(value?: string | null) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
