import type { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import CatalogSearchBox from "../../components/CatalogSearchBox";
import Layout from "../../components/Layout";
import SectionHeader from "../../components/SectionHeader";
import EnterprisePageHero from "../../components/EnterprisePageHero";
import StatePanel from "../../components/StatePanel";
import { fetchUseCases, UseCase } from "../../lib/cms";
import { heroImage } from "../../lib/media";
import { seoTags, canonicalUrl as buildCanonical, type SeoMeta } from "../../lib/seo";

type UseCasesPageProps = {
  useCases: UseCase[];
  allowPrivate: boolean;
  fetchError: boolean;
};

type VisibilityFilter = "all" | "public" | "private";
type UseCaseSortMode = "alphabetical" | "latest" | "trending";

const PAGE_SIZE = 24;

export const getStaticProps: GetStaticProps<UseCasesPageProps> = async () => {
  const allowPrivate = process.env.NEXT_PUBLIC_SHOW_PRIVATE === "true";
  const visibilityFilter = allowPrivate ? undefined : "public";

  try {
    const useCases = (await fetchUseCases(visibilityFilter, { maxRecords: 400, sortBy: "latest" }))
      .filter((item) => Boolean(item.title && item.slug))
      .map((item) => ({
        ...item,
        title: item.title.trim(),
        slug: item.slug.trim(),
      }));

    return {
      props: { useCases, allowPrivate, fetchError: false },
      revalidate: 600,
    };
  } catch {
    return {
      props: { useCases: [], allowPrivate, fetchError: true },
      revalidate: 120,
    };
  }
};

export default function UseCasesPage({ useCases, allowPrivate, fetchError }: UseCasesPageProps) {
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [visibility, setVisibility] = useState<VisibilityFilter>(allowPrivate ? "all" : "public");
  const [sortMode, setSortMode] = useState<UseCaseSortMode>("trending");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const industries = useMemo(
    () =>
      Array.from(new Set(useCases.map((item) => (item.industry || "General").trim())))
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b)),
    [useCases]
  );

  const statuses = useMemo(
    () =>
      Array.from(new Set(useCases.map((item) => (item.status || "live").toLowerCase())))
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b)),
    [useCases]
  );

  const scopedUseCases = useMemo(
    () => filterUseCasesByVisibility(useCases, allowPrivate, visibility),
    [allowPrivate, useCases, visibility]
  );

  const visibilityCounts = useMemo(
    () =>
      useCases.reduce<Record<string, number>>((acc, item) => {
        const key = (item.visibility || "public").toLowerCase();
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
      }, {}),
    [useCases]
  );
  const verifiedCount = useMemo(
    () => scopedUseCases.filter((item) => item.verified).length,
    [scopedUseCases]
  );
  const topIndustrySignals = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of scopedUseCases) {
      const key = (item.industry || "General").trim();
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
      .slice(0, 8);
  }, [scopedUseCases]);

  const filteredUseCases = useMemo(() => {
    const query = search.trim().toLowerCase();

    return scopedUseCases.filter((item) => {
      const industryMatch =
        industryFilter === "all" ? true : (item.industry || "General") === industryFilter;
      const statusMatch =
        statusFilter === "all" ? true : (item.status || "live").toLowerCase() === statusFilter;
      const queryMatch =
        query.length === 0
          ? true
          : [
              item.title,
              item.summary,
              item.longDescription,
              item.industry,
              item.category,
              item.status,
              ...(item.tags || []).map((tag) => tag.name || tag.slug || ""),
              ...(item.companies || []).map((company) => company.name || company.slug || ""),
            ]
              .join(" ")
              .toLowerCase()
              .includes(query);

      return industryMatch && statusMatch && queryMatch;
    });
  }, [industryFilter, scopedUseCases, search, statusFilter]);

  const sortedUseCases = useMemo(
    () => sortUseCases(filteredUseCases, sortMode),
    [filteredUseCases, sortMode]
  );
  const latestUseCases = useMemo(
    () => sortUseCases(scopedUseCases, "latest").slice(0, 6),
    [scopedUseCases]
  );
  const trendingUseCases = useMemo(
    () => sortUseCases(scopedUseCases, "trending").slice(0, 6),
    [scopedUseCases]
  );
  const shownCount = Math.min(visibleCount, sortedUseCases.length);
  const visibleUseCases = useMemo(
    () => sortedUseCases.slice(0, shownCount),
    [shownCount, sortedUseCases]
  );
  const hasMore = shownCount < sortedUseCases.length;

  useEffect(() => {
    if (!hasMore) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, sortedUseCases.length));
        }
      },
      { rootMargin: "320px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, sortedUseCases.length]);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add("revealed");
        obs.disconnect();
      }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [visibleUseCases]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://colaberry.ai";
  const canonicalUrl = `${siteUrl}/use-cases`;
  const seoMeta: SeoMeta = {
    title: "Use Cases | Colaberry AI",
    description: "See how enterprises deploy AI to solve real problems. Browse use cases by industry, outcome, and agent.",
    canonical: buildCanonical("/use-cases"),
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
              "name": "Colaberry AI Use Cases",
              "description": "See how enterprises deploy AI to solve real problems. Browse use cases by industry, outcome, and agent.",
              "url": canonicalUrl,
            }),
          }}
        />
      </Head>

      {fetchError ? (
        <div className="mb-6">
          <StatePanel
            variant="error"
            title="Use case data is temporarily unavailable"
            description="Showing available cached data while CMS reconnects."
          />
        </div>
      ) : null}

      <EnterprisePageHero
        kicker="Proven deployments"
        title="Real problems, real outcomes"
        description="Each use case shows the problem, the AI approach, and the measurable result -- so you can evaluate what fits."
        image={heroImage("hero-solutions-cinematic.webp")}
        alt="Enterprise AI use case catalog"
        imageKicker="Use cases"
        imageTitle="From problem to production"
        imageDescription="Each use case links to the agents, integrations, and outcomes that power it."
        chips={["Outcome-first", "Industry-aligned", "Agent-linked", "Production-ready"]}
        primaryAction={{ label: "Browse use cases", href: "#catalog" }}
        secondaryAction={{ label: "Book a demo", href: "/request-demo", variant: "secondary" }}
        metrics={[
          { label: "Use cases", value: `${useCases.length}`, note: "Documented with outcomes and context." },
          { label: "Coverage", value: "Cross-industry", note: "From agriculture to fintech." },
          { label: "Linked assets", value: "Agents + MCP", note: "Every use case connects to real tools." },
        ]}
      />

      <section className="surface-panel mt-6 p-6 sm:mt-8">
        <SectionHeader
          kicker="At a glance"
          title="Catalog coverage"
          description="How many use cases are available, which industries they cover, and their current status."
          size="md"
        />
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:items-center sm:gap-6">
          <Stat title="Use cases" value={String(useCases.length)} note="Structured profiles" />
          <Stat
            title="Industries"
            value={String(new Set(useCases.map((item) => item.industry)).size)}
            note="Domain-aligned"
          />
          <Stat
            title="Visibility"
            value={`${visibilityCounts.public ?? 0} public`}
            note={allowPrivate ? `${visibilityCounts.private ?? 0} private` : "Private hidden"}
          />
          <Stat
            title="Verified"
            value={String(verifiedCount)}
            note="Profiles with stronger readiness signals."
          />
        </div>
        {topIndustrySignals.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {topIndustrySignals.map(([industry, count]) => (
              <button
                key={`${industry}-${count}`}
                type="button"
                onClick={() => {
                  setIndustryFilter(industry);
                  setVisibleCount(PAGE_SIZE);
                }}
                className="chip chip-neutral rounded-md px-3 py-1 text-xs font-semibold"
              >
                {industry} ({count})
              </button>
            ))}
          </div>
        ) : null}
      </section>

      <section className="surface-panel mt-6 p-6">
        <SectionHeader
          kicker="What's hot"
          title="Latest and trending"
          description="Recently updated use cases and the ones getting the most attention right now."
          size="md"
        />
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <SignalRail
            title="Recently updated"
            description="Use cases with the freshest content and outcomes."
            items={latestUseCases}
            emptyText="No recently updated use cases available."
            detailType="latest"
          />
          <SignalRail
            title="Trending now"
            description="High-interest use cases based on linked agents, completeness, and recency."
            items={trendingUseCases}
            emptyText="Trending signals will appear after more use case activity is recorded."
            detailType="trending"
          />
        </div>
      </section>

      <section id="catalog" className="surface-panel mt-6 p-6">
        <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr_auto]">
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            placeholder="Search by problem, industry, or outcome..."
            className="input-premium w-full"
            aria-label="Search use cases"
          />
          <select
            value={industryFilter}
            onChange={(event) => {
              setIndustryFilter(event.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            className="input-premium w-full"
            aria-label="Filter by industry"
          >
            <option value="all">All industries</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            className="input-premium w-full"
            aria-label="Filter by status"
          >
            <option value="all">All statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
          {allowPrivate ? (
            <select
              value={visibility}
              onChange={(event) => {
                setVisibility(event.target.value as VisibilityFilter);
                setVisibleCount(PAGE_SIZE);
              }}
              className="input-premium w-full md:min-w-[10.5rem]"
              aria-label="Filter by visibility"
            >
              <option value="all">All visibility</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          ) : null}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Sort
          </span>
          {(
            [
              { value: "trending", label: "Trending" },
              { value: "latest", label: "Latest" },
              { value: "alphabetical", label: "A-Z" },
            ] as { value: UseCaseSortMode; label: string }[]
          ).map((option) => {
            const active = sortMode === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setSortMode(option.value);
                  setVisibleCount(PAGE_SIZE);
                }}
                aria-pressed={active}
                className={`chip focus-ring rounded-md px-3 py-1 text-xs font-semibold ${
                  active ? "chip-neutral ring-1 ring-slate-300 dark:ring-slate-600" : "chip-neutral"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        <div className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500" aria-live="polite">
          Showing {shownCount} of {sortedUseCases.length} (catalog {scopedUseCases.length})
        </div>
      </section>

      {sortedUseCases.length === 0 ? (
        <div className="mt-6">
          <StatePanel
            variant="empty"
            title="No matching use cases"
            description="Try a different keyword or clear your filters to browse the full catalog."
          />
        </div>
      ) : (
        <div ref={gridRef} className="stagger-grid mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {visibleUseCases.map((item) => {
            const statusLabel = (item.status || "live").toLowerCase();
            const visibilityLabel = (item.visibility || "public").toLowerCase();
            return (
              <Link
                key={item.id}
                href={`/use-cases/${item.slug}`}
                className="card-feature p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{item.title}</h2>
                    {item.summary ? <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{item.summary}</p> : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="chip chip-neutral rounded-md px-3 py-1 text-xs font-semibold">
                      {item.industry || "General"}
                    </span>
                    {item.category ? (
                      <span className="chip chip-muted rounded-md px-3 py-1 text-xs font-semibold">
                        {item.category}
                      </span>
                    ) : null}
                    <span className="chip chip-muted rounded-md px-3 py-1 text-xs font-semibold">
                      {statusLabel.charAt(0).toUpperCase() + statusLabel.slice(1)}
                    </span>
                    <span className="chip chip-muted rounded-md px-3 py-1 text-xs font-semibold">
                      {visibilityLabel.charAt(0).toUpperCase() + visibilityLabel.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>Agents: {item.agents.length}</span>
                  <span>•</span>
                  <span>MCP servers: {item.mcpServers.length}</span>
                  {item.lastUpdated ? (
                    <>
                      <span>•</span>
                      <span>Updated {formatDate(item.lastUpdated)}</span>
                    </>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </div>
      )}
      <div className="mt-6 flex flex-col items-center gap-3">
        {sortedUseCases.length > 0 ? (
          hasMore ? (
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, sortedUseCases.length))}
              className="btn btn-secondary"
            >
              Load more use cases
            </button>
          ) : (
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              End of results
            </div>
          )
        ) : null}
        <div ref={sentinelRef} className="h-1 w-full" aria-hidden="true" />
      </div>

      <section className="surface-panel mt-6 p-6">
        <SectionHeader
          kicker="Delivery paths"
          title="Choose your next execution lane"
          description="Move from exploration to production with a path aligned to your team maturity and timeline."
          size="md"
        />
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          <article className="card-elevated p-4">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Evaluate</div>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Review high-signal use cases and compare business outcomes across industries.
            </p>
            <Link href="/industries" className="mt-3 inline-flex text-xs font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-200">
              Explore industries →
            </Link>
          </article>
          <article className="card-elevated p-4">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Design</div>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Map use cases to agents, MCP servers, and governance controls before implementation.
            </p>
            <Link href="/solutions" className="mt-3 inline-flex text-xs font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-200">
              View solutions →
            </Link>
          </article>
          <article className="card-elevated p-4">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Launch</div>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Run an executive demo to align stakeholders and finalize your phased rollout plan.
            </p>
            <Link href="/request-demo" className="mt-3 inline-flex text-xs font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-200">
              Book a demo →
            </Link>
          </article>
        </div>
      </section>

      <CatalogSearchBox placeholder="Describe a problem or search by industry..." />
      <BackToTop />
    </Layout>
  );
}

function formatDate(value?: string | null) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function filterUseCasesByVisibility(
  useCases: UseCase[],
  allowPrivate: boolean,
  visibility: VisibilityFilter
) {
  if (!allowPrivate) {
    return useCases.filter((item) => (item.visibility || "public").toLowerCase() === "public");
  }
  if (visibility === "all") {
    return useCases;
  }
  return useCases.filter((item) => (item.visibility || "public").toLowerCase() === visibility);
}

function sortUseCases(useCases: UseCase[], mode: UseCaseSortMode) {
  const sorted = [...useCases];
  if (mode === "alphabetical") {
    return sorted.sort((a, b) => a.title.localeCompare(b.title));
  }
  if (mode === "latest") {
    return sorted.sort((a, b) => compareDatesDesc(a.lastUpdated, b.lastUpdated) || a.title.localeCompare(b.title));
  }
  return sorted.sort((a, b) => {
    const scoreDelta = scoreTrendingUseCase(b) - scoreTrendingUseCase(a);
    if (scoreDelta !== 0) return scoreDelta;
    return compareDatesDesc(a.lastUpdated, b.lastUpdated) || a.title.localeCompare(b.title);
  });
}

function compareDatesDesc(left?: string | null, right?: string | null) {
  return toTimestamp(right) - toTimestamp(left);
}

function toTimestamp(value?: string | null) {
  if (!value) return 0;
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
}

function scoreTrendingUseCase(item: UseCase) {
  const linkageScore = Math.min(item.agents.length * 5 + item.mcpServers.length * 4, 30);
  const verifiedScore = item.verified ? 8 : 0;
  const completenessScore =
    (item.summary ? 2 : 0) +
    (item.longDescription ? 4 : 0) +
    (item.outcomes ? 3 : 0) +
    (item.metrics ? 3 : 0);
  const freshnessScore = (() => {
    const timestamp = toTimestamp(item.lastUpdated);
    if (!timestamp) return 0;
    const days = (Date.now() - timestamp) / (1000 * 60 * 60 * 24);
    if (days <= 14) return 12;
    if (days <= 45) return 8;
    if (days <= 90) return 4;
    return 0;
  })();
  return linkageScore + verifiedScore + completenessScore + freshnessScore;
}

function SignalRail({
  title,
  description,
  items,
  emptyText,
  detailType,
}: {
  title: string;
  description: string;
  items: UseCase[];
  emptyText: string;
  detailType: "latest" | "trending";
}) {
  return (
    <article className="card-elevated p-5">
      <div className="text-label font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{title}</div>
      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{description}</p>
      {items.length === 0 ? (
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{emptyText}</p>
      ) : (
        <ul className="mt-3 grid gap-2">
          {items.map((item) => {
            const detail =
              detailType === "latest"
                ? formatDate(item.lastUpdated) || "Date pending"
                : item.verified
                ? "Verified"
                : `${item.agents.length + item.mcpServers.length} links`;
            return (
              <li key={item.slug || item.id}>
                <Link
                  href={`/use-cases/${item.slug}`}
                  className="card-elevated group flex items-center justify-between px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
                >
                  <span className="truncate pr-3">{item.title}</span>
                  <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200">
                    {detail}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </article>
  );
}

function Stat({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <div className="card-elevated p-4">
      <div className="text-label font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{title}</div>
      <div className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{value}</div>
      <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">{note}</div>
    </div>
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 1200);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!visible) return null;
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="back-to-top visible"
      aria-label="Back to top"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m18 15-6-6-6 6" />
      </svg>
    </button>
  );
}
