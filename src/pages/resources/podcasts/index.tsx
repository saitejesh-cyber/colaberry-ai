import Layout from "../../../components/Layout";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import type { GetServerSideProps } from "next";
import { useEffect, useRef, useState } from "react";
import NewsletterSignup from "../../../components/NewsletterSignup";
import StatePanel from "../../../components/StatePanel";
import {
  fetchPodcastEpisodes,
  getPodcastTrendingScore,
  type PodcastEpisode,
  type PodcastSortBy,
} from "../../../lib/cms";
import { heroImage } from "../../../lib/media";
import { logPodcastEvent } from "../../../lib/podcastTelemetry";
import { seoTags, type SeoMeta } from "../../../lib/seo";

const PAGE_SIZE = 24;
const PODCAST_BRAND_IMAGE = "/media/podcast/colaberry-ai-podcast-brand.svg";
const PODCAST_FALLBACK_IMAGE = heroImage("hero-podcasts-cinematic.webp");

type PodcastTypeFilter = "all" | "internal" | "external";

function buildPodcastsPath({ sort, type, q }: { sort?: string; type?: string; q?: string }) {
  const params = new URLSearchParams();
  if (sort && sort !== "latest") params.set("sort", sort);
  if (type && type !== "all") params.set("type", type);
  if (q) params.set("q", q);
  const qs = params.toString();
  return qs ? `/resources/podcasts?${qs}` : "/resources/podcasts";
}

type PodcastCompanyFacet = {
  slug: string;
  name: string;
  count: number;
};

type PodcastTagFacet = {
  slug: string;
  name: string;
  count: number;
};

type PodcastsPageProps = {
  episodes: PodcastEpisode[];
  companies: PodcastCompanyFacet[];
  fetchError: boolean;
  activeSort: PodcastSortBy;
  activeType: PodcastTypeFilter;
  searchQuery: string;
  canonicalPath: string;
};

function MetaStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200/80 bg-white/90 px-3 py-2 dark:border-slate-700 dark:bg-slate-900/70">
      <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
        {label}
      </div>
      <div className="mt-0.5 text-sm font-semibold text-slate-800 dark:text-slate-100">
        {value}
      </div>
    </div>
  );
}

export default function Podcasts({
  episodes,
  companies,
  fetchError,
  activeSort,
  activeType,
  searchQuery,
  canonicalPath,
}: PodcastsPageProps) {
  const [playingSlug, setPlayingSlug] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(Boolean(searchQuery.trim()));
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Handle audio ended → reset icon
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => setPlayingSlug(null);
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, []);

  const handlePlay = (episode: PodcastEpisode, source: string) => {
    const audio = audioRef.current;
    if (!audio || !episode.audioUrl) return;

    if (playingSlug === episode.slug) {
      // Same episode → pause
      audio.pause();
      setPlayingSlug(null);
      return;
    }

    // Different episode → load and play
    audio.src = episode.audioUrl;
    audio.play();
    setPlayingSlug(episode.slug);
    logPodcastEvent("play", source, { slug: episode.slug, title: episode.title });
  };

  const copyShareUrl = async (value: string, source: string, slug: string) => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(value);
      logPodcastEvent("share", source, { slug });
    } catch {
      // Swallow clipboard failures in insecure/local contexts.
    }
  };

  const displayedEpisodes = episodes.slice(0, visibleCount);
  const hasMore = visibleCount < episodes.length;

  useEffect(() => {
    if (!hasMore) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, episodes.length));
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [episodes.length, hasMore]);

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://colaberry.ai").replace(/\/$/, "");
  const canonicalUrl = `${siteUrl}${canonicalPath}`;
  const latestSortHref = buildPodcastsPath({
    sort: "latest",
    type: activeType,
    q: searchQuery,
  });
  const trendingSortHref = buildPodcastsPath({
    sort: "trending",
    type: activeType,
    q: searchQuery,
  });
  const typeFilterLinks: Array<{ label: string; value: PodcastTypeFilter; href: string }> = [
    { label: "All", value: "all", href: buildPodcastsPath({ sort: activeSort, type: "all", q: searchQuery }) },
    { label: "Colaberry", value: "internal", href: buildPodcastsPath({ sort: activeSort, type: "internal", q: searchQuery }) },
    { label: "External", value: "external", href: buildPodcastsPath({ sort: activeSort, type: "external", q: searchQuery }) },
  ];
  const editorialQueues = [
    {
      title: "Executive brief",
      description: "High-signal episodes on enterprise ROI, governance, and adoption risk.",
      href: buildPodcastsPath({ sort: "trending", type: activeType, q: searchQuery }),
      cta: "Open top episodes",
    },
    {
      title: "Product + engineering watch",
      description: "Implementation tactics for teams shipping agents and workflow automation.",
      href: buildPodcastsPath({ sort: "latest", type: "internal", q: searchQuery }),
      cta: "Browse Colaberry episodes",
    },
    {
      title: "Market signals",
      description: "External ecosystem updates that impact roadmap and platform decisions.",
      href: buildPodcastsPath({ sort: "latest", type: "external", q: searchQuery }),
      cta: "Browse external episodes",
    },
  ];
  const topTags = buildTagFacets(episodes).slice(0, 12);
  const internalCount = episodes.filter((episode) => (episode.podcastType || "internal").toLowerCase() !== "external").length;
  const externalCount = episodes.length - internalCount;
  const seoMeta: SeoMeta = {
    title: "Podcasts | Colaberry AI",
    description: "Listen to expert conversations on AI strategy, deployment, and industry trends. Full transcripts and inline playback included.",
    canonical: canonicalUrl,
  };
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Colaberry AI Podcast",
    itemListOrder: activeSort === "trending" ? "https://schema.org/ItemListOrderDescending" : "https://schema.org/ItemListOrderAscending",
    numberOfItems: episodes.length,
    itemListElement: episodes.map((episode, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteUrl}/resources/podcasts/${episode.slug}`,
      name: episode.title,
      datePublished: episode.publishedDate || undefined,
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

      {fetchError ? (
        <div className="section-spacing">
          <StatePanel
            variant="error"
            title="Podcast data is temporarily unavailable"
            description="Showing available catalog data while we reconnect to the CMS."
          />
        </div>
      ) : null}

      {/* ── Premium header with sort + source filters + search ── */}
      <section className="hero-surface section-shell px-4 py-6 sm:px-6">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,260px)] lg:items-start">
          <div className="min-w-0">
            <div className="chip chip-neutral inline-flex w-fit rounded-md px-3 py-1 text-label font-semibold uppercase tracking-[0.14em]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--trusted-fill)]" />
              Podcast intelligence
            </div>
            <h1 className="mt-4 font-display text-display-sm font-bold text-slate-900 dark:text-slate-100 sm:text-display-md">
              Podcasts
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
              Explore strategy and engineering conversations with inline playback, structured transcripts, and episode-level metadata designed for enterprise discovery.
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
              {searchQuery ? `Filtered by: "${searchQuery}"` : "Editorially curated feed"}
              {" · "}
              {activeSort === "trending" ? "Top ranked" : "Latest episodes"}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 lg:grid-cols-1">
            <MetaStat label="Episodes" value={`${episodes.length}`} />
            <MetaStat label="Colaberry" value={`${internalCount}`} />
            <MetaStat label="External" value={`${externalCount}`} />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 rounded-lg border border-slate-200/80 p-1 dark:border-slate-700">
            <Link
              href={latestSortHref}
              className={`flex min-h-[36px] items-center rounded-md px-4 py-1.5 text-xs font-semibold transition ${
                activeSort === "latest"
                  ? "bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              Latest
            </Link>
            <Link
              href={trendingSortHref}
              className={`flex min-h-[36px] items-center rounded-md px-4 py-1.5 text-xs font-semibold transition ${
                activeSort === "trending"
                  ? "bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              Top
            </Link>
          </div>

          <div className="flex flex-wrap gap-2">
            {typeFilterLinks.map((filter) => (
              <Link
                key={filter.value}
                href={filter.href}
                className={`chip rounded-md px-3 py-1.5 text-xs font-semibold ${
                  activeType === filter.value ? "chip-brand" : "chip-muted"
                }`}
              >
                {filter.label}
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setSearchOpen((prev) => !prev)}
            aria-label="Toggle search"
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </div>

        {searchOpen ? (
          <form action="/resources/podcasts" method="get" className="mt-3">
            <input
              type="search"
              name="q"
              defaultValue={searchQuery}
              placeholder="Search episodes, tags, companies..."
              autoFocus
              aria-label="Search episodes"
              className="h-10 w-full rounded-lg border border-slate-200/80 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-brand-blue/40 focus:outline-none focus:ring-2 focus:ring-brand-blue/25 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            {activeSort !== "latest" ? <input type="hidden" name="sort" value={activeSort} /> : null}
            {activeType !== "all" ? <input type="hidden" name="type" value={activeType} /> : null}
          </form>
        ) : null}
        {topTags.length > 0 ? (
          <div className="mt-4 border-t border-slate-200/70 pt-4 dark:border-slate-700/60">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
              Trending topics
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {topTags.map((tag) => (
                <Link
                  key={`${tag.slug}-${tag.count}`}
                  href={`/resources/podcasts/tag/${tag.slug}`}
                  className="chip chip-neutral rounded-md px-3 py-1 text-xs font-semibold"
                >
                  #{tag.name} ({tag.count})
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <section className="surface-panel section-shell mt-4 px-4 py-5 sm:px-6">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
          Editorial queues
        </div>
        <div className="mt-3 grid gap-3 lg:grid-cols-3">
          {editorialQueues.map((queue) => (
            <article key={queue.title} className="card-feature p-4">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{queue.title}</h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {queue.description}
              </p>
              <Link href={queue.href} className="btn btn-ghost mt-3 text-xs">
                {queue.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* ── Content area: hero + list | sidebar ── */}
      <section className="section-shell px-4 pt-2 pb-8 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-8 lg:items-start">
        {/* Left column */}
        <div>
          {episodes.length === 0 ? (
            <div className="mt-4">
              <StatePanel
                variant="empty"
                title="No podcast episodes match this filter"
                description="Try broader search terms or reset filters to browse all episodes."
              />
            </div>
          ) : (
            <>
              {/* ── Featured hero episode ── */}
              {(() => {
                const hero = displayedEpisodes[0];
                const heroCanPlay = Boolean(hero.audioUrl);
                const heroIsPlaying = playingSlug === hero.slug;
                const heroType = (hero.podcastType || "internal").toLowerCase();
                const heroIsExternal = heroType === "external";
                const heroArtwork = heroIsExternal
                  ? hero.coverImageUrl || PODCAST_BRAND_IMAGE
                  : PODCAST_BRAND_IMAGE;
                const heroSubtitle = extractPlainText(hero.description, 200);
                const heroUrl = `/resources/podcasts/${hero.slug}`;
                const heroFullUrl = `${siteUrl}${heroUrl}`;

                return (
                  <div className="flex flex-col gap-5 border-b border-slate-200/60 pb-6 dark:border-slate-700/50 sm:flex-row sm:items-start sm:gap-6">
                    {/* Artwork */}
                    <div className="relative w-full shrink-0 overflow-hidden rounded-xl sm:w-64 lg:w-72">
                      <Link href={heroUrl} tabIndex={-1} aria-hidden="true">
                        <PodcastArtwork
                          src={heroArtwork}
                          alt={hero.coverImageAlt || hero.title}
                          className="aspect-square w-full object-cover"
                        />
                      </Link>
                      {heroCanPlay ? (
                        <button
                          type="button"
                          aria-label={heroIsPlaying ? `Pause ${hero.title}` : `Play ${hero.title}`}
                          onClick={() => handlePlay(hero, "hero-inline")}
                          className="absolute inset-0 flex items-center justify-center bg-slate-900/40 transition-colors hover:bg-slate-900/55"
                        >
                          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg backdrop-blur-sm">
                            {heroIsPlaying ? <PauseIcon size={22} /> : <PlayIcon size={22} />}
                          </span>
                        </button>
                      ) : null}
                      {hero.duration ? (
                        <span className="absolute bottom-3 right-3 z-10 flex items-center gap-1 rounded bg-black/70 px-2 py-1 text-xs font-semibold text-white">
                          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                            <circle cx="8" cy="8" r="6.5" />
                            <path d="M8 4.5V8l2.5 1.5" strokeLinecap="round" />
                          </svg>
                          {hero.duration}
                        </span>
                      ) : null}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <Link
                        href={heroUrl}
                        className="group/hero"
                        onClick={() => logPodcastEvent("click", "hero-detail", { slug: hero.slug, title: hero.title })}
                      >
                        <h2 className="font-display text-display-xs font-bold text-slate-900 group-hover/hero:text-slate-600 dark:text-slate-100 dark:group-hover/hero:text-slate-300 sm:text-display-sm">
                          {hero.title}
                        </h2>
                      </Link>

                      {heroSubtitle ? (
                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                          <span className="font-medium text-slate-700 dark:text-slate-300">Listen now</span>
                          <span className="mx-1 text-slate-300 dark:text-slate-600">|</span>
                          {heroSubtitle}
                        </p>
                      ) : null}

                      <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                        {formatShortDate(hero.publishedDate) || "Date pending"}
                        {" · "}
                        <span>{heroIsExternal ? "External" : "Colaberry AI Podcast"}</span>
                      </p>

                      {/* Hero share row */}
                      <div className="mt-3 flex items-center gap-1">
                        <button
                          type="button"
                          aria-label="Copy link"
                          onClick={() => {
                            void copyShareUrl(heroFullUrl, "hero-copy", hero.slug);
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                          title="Copy link"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                          </svg>
                        </button>
                        <a
                          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(heroFullUrl)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Share on LinkedIn"
                          onClick={() => logPodcastEvent("share", "hero-linkedin", { slug: hero.slug })}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                          title="Share on LinkedIn"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </a>
                        <a
                          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(heroFullUrl)}&text=${encodeURIComponent(hero.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Share on X"
                          onClick={() => logPodcastEvent("share", "hero-x", { slug: hero.slug })}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                          title="Share on X"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* ── Episode list (remaining episodes) ── */}
              <div className="divide-y divide-slate-200/60 dark:divide-slate-700/50">
                {displayedEpisodes.slice(1).map((episode) => {
                  const canPlay = Boolean(episode.audioUrl);
                  const isPlaying = playingSlug === episode.slug;
                  const shortDate = formatShortDate(episode.publishedDate);
                  const episodeType = (episode.podcastType || "internal").toLowerCase();
                  const isExternal = episodeType === "external";
                  const cardArtwork = isExternal
                    ? episode.coverImageUrl || PODCAST_BRAND_IMAGE
                    : PODCAST_BRAND_IMAGE;
                  const subtitle = extractPlainText(episode.description, 120);
                  const episodeUrl = `/resources/podcasts/${episode.slug}`;
                  const fullUrl = `${siteUrl}${episodeUrl}`;

                  return (
                    <div key={episode.id} className="flex gap-5 py-6">
                      {/* Left: Content */}
                      <div className="min-w-0 flex-1">
                        <Link
                          href={episodeUrl}
                          className="group/title"
                          onClick={() => logPodcastEvent("click", "list-detail", { slug: episode.slug, title: episode.title })}
                        >
                          <h3 className="font-display text-xl font-bold leading-snug text-slate-900 group-hover/title:text-slate-600 dark:text-slate-100 dark:group-hover/title:text-slate-300 sm:text-display-xs">
                            {episode.title}
                          </h3>
                        </Link>

                        {subtitle ? (
                          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                            <span className="font-medium text-slate-700 dark:text-slate-300">Listen now</span>
                            <span className="mx-1 text-slate-300 dark:text-slate-600">|</span>
                            {subtitle}
                          </p>
                        ) : null}

                        <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                          {shortDate || "Date pending"}
                          {" · "}
                          <span>{isExternal ? "External" : "Colaberry AI Podcast"}</span>
                        </p>

                        {/* Mobile-first quick playback controls */}
                        <div className="mt-3 flex items-center justify-between gap-3 sm:hidden">
                          <div className="flex items-center gap-2">
                            {canPlay ? (
                              <button
                                type="button"
                                aria-label={isPlaying ? `Pause ${episode.title}` : `Play ${episode.title}`}
                                onClick={() => handlePlay(episode, "list-inline-mobile")}
                                className="btn btn-secondary btn-compact h-9 px-3 tracking-normal normal-case"
                              >
                                {isPlaying ? (
                                  <>
                                    <PauseIcon />
                                    Pause
                                  </>
                                ) : (
                                  <>
                                    <PlayIcon />
                                    Play
                                  </>
                                )}
                              </button>
                            ) : null}
                            {episode.duration ? (
                              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                {episode.duration}
                              </span>
                            ) : null}
                          </div>
                          <Link
                            href={episodeUrl}
                            className="focus-ring inline-flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-200"
                            onClick={() => logPodcastEvent("click", "list-detail-mobile", { slug: episode.slug, title: episode.title })}
                          >
                            Open
                            <span aria-hidden="true">→</span>
                          </Link>
                        </div>

                        {/* Share / action row */}
                        <div className="mt-3 flex items-center gap-1">
                          <button
                            type="button"
                            aria-label="Copy link"
                            onClick={() => {
                              void copyShareUrl(fullUrl, "list-copy", episode.slug);
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                            title="Copy link"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                            </svg>
                          </button>
                          <a
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Share on LinkedIn"
                            onClick={() => logPodcastEvent("share", "list-linkedin", { slug: episode.slug })}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                            title="Share on LinkedIn"
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                          </a>
                          <a
                            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(episode.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Share on X"
                            onClick={() => logPodcastEvent("share", "list-x", { slug: episode.slug })}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                            title="Share on X"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                          </a>
                        </div>
                      </div>

                      {/* Right: Artwork with play overlay */}
                      <div className="relative hidden h-36 w-36 shrink-0 overflow-hidden rounded-xl sm:block lg:h-40 lg:w-40">
                        <Link href={episodeUrl} tabIndex={-1} aria-hidden="true">
                          <PodcastArtwork
                            src={cardArtwork}
                            alt={episode.coverImageAlt || episode.title}
                            className="h-full w-full object-cover"
                          />
                        </Link>
                        {canPlay ? (
                          <button
                            type="button"
                            aria-label={isPlaying ? `Pause ${episode.title}` : `Play ${episode.title}`}
                            onClick={() => handlePlay(episode, "list-inline")}
                            className="absolute inset-0 flex items-center justify-center bg-slate-900/40 transition-colors hover:bg-slate-900/55"
                          >
                            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg backdrop-blur-sm">
                              {isPlaying ? <PauseIcon /> : <PlayIcon />}
                            </span>
                          </button>
                        ) : null}
                        {episode.duration ? (
                          <span className="absolute bottom-2 right-2 z-10 flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5 text-label font-semibold text-white">
                            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                              <circle cx="8" cy="8" r="6.5" />
                              <path d="M8 4.5V8l2.5 1.5" strokeLinecap="round" />
                            </svg>
                            {episode.duration}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>

              {hasMore ? (
                <div ref={sentinelRef} className="mt-6 flex justify-center">
                  <span className="text-sm text-slate-500">Loading more episodes...</span>
                </div>
              ) : episodes.length > 0 ? (
                <div className="mt-6 text-center text-sm text-slate-500">
                  Showing all {episodes.length} episodes
                </div>
              ) : null}
            </>
          )}
        </div>

        {/* ── Right sidebar ── */}
        <aside className="hidden lg:block">
          <div className="surface-panel p-5 lg:sticky lg:top-24">
            {/* Podcast identity */}
            <div className="flex items-center gap-3">
              <Image
                src={PODCAST_BRAND_IMAGE}
                alt="Colaberry AI Podcast"
                width={48}
                height={48}
                className="h-12 w-12 rounded-lg"
                unoptimized
              />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Colaberry AI Podcast</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{episodes.length} episodes</p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Hear from AI leaders and practitioners on what works in production. Each episode covers strategy, architecture, and real deployment outcomes.
            </p>

            {/* Newsletter subscribe */}
            <div className="mt-5 border-t border-slate-200/60 pt-5 dark:border-slate-700/60">
              <NewsletterSignup
                compact
                sourcePage="podcast-listing"
                title="Subscribe"
                description="Get notified when new episodes drop."
                ctaLabel="Subscribe"
              />
            </div>

            {/* CTA */}
            <div className="mt-5 border-t border-slate-200/60 pt-5 dark:border-slate-700/60">
              <Link href="/request-demo" className="btn btn-cta w-full text-center text-sm">
                Let&apos;s Talk
              </Link>
            </div>

            {/* Company tags */}
            {companies.length > 0 ? (
              <div className="mt-5 border-t border-slate-200/60 pt-5 dark:border-slate-700/60">
                <div className="flex items-center gap-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Browse by company</h4>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {companies.slice(0, 20).map((company) => (
                    <Link
                      key={company.slug}
                      href={`/resources/podcasts/company?slug=${encodeURIComponent(company.slug)}`}
                      className="chip chip-neutral rounded-md px-2 py-0.5 text-label font-semibold"
                    >
                      {company.name}
                    </Link>
                  ))}
                  {companies.length > 20 ? (
                    <span className="text-label text-slate-400">+{companies.length - 20} more</span>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </aside>
      </section>

      {/* Hidden audio element for inline playback */}
      <audio ref={audioRef} preload="metadata" />
    </Layout>
  );
}

function PodcastArtwork({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [imageSrc, setImageSrc] = useState(src);

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={1400}
      height={900}
      className={className || "h-full w-full object-cover"}
      unoptimized
      onError={() => {
        if (imageSrc !== PODCAST_FALLBACK_IMAGE) {
          setImageSrc(PODCAST_FALLBACK_IMAGE);
        }
      }}
    />
  );
}

function PlayIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M4.5 2.5v11l9-5.5-9-5.5Z" />
    </svg>
  );
}

function PauseIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <rect x="3" y="2" width="3.5" height="12" rx="1" />
      <rect x="9.5" y="2" width="3.5" height="12" rx="1" />
    </svg>
  );
}

function formatShortDate(value?: string | null) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

type RichTextChild = {
  text?: string | null;
};

type RichTextBlock = {
  type?: string | null;
  children?: RichTextChild[] | null;
};

/** Extract plain text from Strapi rich-text (block array or string). */
function extractPlainText(description: unknown, maxLen = 140): string {
  if (!description) return "";
  if (typeof description === "string") return description.slice(0, maxLen);
  if (Array.isArray(description)) {
    const text = description
      .filter((block): block is RichTextBlock => typeof block === "object" && block !== null)
      .filter((block) => block.type === "paragraph")
      .flatMap((block) =>
        (block.children || []).map((child) => child?.text || "")
      )
      .join(" ")
      .trim();
    return text.length > maxLen ? text.slice(0, maxLen).trimEnd() + "…" : text;
  }
  return "";
}


function parseSort(value: string): PodcastSortBy {
  return value === "trending" ? "trending" : "latest";
}

function parseTypeFilter(value: string): PodcastTypeFilter {
  if (value === "internal" || value === "external") return value;
  return "all";
}

function normalizeSearchQuery(value: string) {
  return value.trim().slice(0, 100);
}

function matchesEpisodeSearch(episode: PodcastEpisode, query: string) {
  if (!query) return true;
  const text = query.toLowerCase();
  if (episode.title.toLowerCase().includes(text)) return true;
  if ((episode.tags || []).some((tag) => `${tag.name} ${tag.slug}`.toLowerCase().includes(text))) return true;
  if ((episode.companies || []).some((company) => `${company.name} ${company.slug}`.toLowerCase().includes(text))) return true;
  return false;
}

function buildTagFacets(episodes: PodcastEpisode[]): PodcastTagFacet[] {
  const tagMap = new Map<string, PodcastTagFacet>();
  for (const episode of episodes) {
    for (const tag of episode.tags || []) {
      if (!tag?.slug) continue;
      const existing = tagMap.get(tag.slug);
      if (existing) {
        existing.count += 1;
      } else {
        tagMap.set(tag.slug, {
          slug: tag.slug,
          name: tag.name || tag.slug,
          count: 1,
        });
      }
    }
  }
  return Array.from(tagMap.values()).sort((left, right) => {
    if (right.count !== left.count) return right.count - left.count;
    return left.name.localeCompare(right.name);
  });
}


export const getServerSideProps: GetServerSideProps<PodcastsPageProps> = async ({ query }) => {
  const rawSort = Array.isArray(query.sort) ? query.sort[0] : query.sort;
  const rawType = Array.isArray(query.type) ? query.type[0] : query.type;
  const rawSearch = Array.isArray(query.q) ? query.q[0] : query.q;

  const activeSort = parseSort(String(rawSort || "latest").toLowerCase());
  const activeType = parseTypeFilter(String(rawType || "all").toLowerCase());
  const searchQuery = normalizeSearchQuery(String(rawSearch || ""));

  const canonicalParams = new URLSearchParams();
  if (activeSort !== "latest") canonicalParams.set("sort", activeSort);
  if (activeType !== "all") canonicalParams.set("type", activeType);
  if (searchQuery) canonicalParams.set("q", searchQuery);
  const canonicalQs = canonicalParams.toString();
  const canonicalPath = canonicalQs ? `/resources/podcasts?${canonicalQs}` : "/resources/podcasts";

  try {
    const allEpisodes = await fetchPodcastEpisodes();
    const now = Date.now();

    const companyMap = new Map<string, PodcastCompanyFacet>();
    allEpisodes.forEach((episode) => {
      (episode.companies || []).forEach((company) => {
        if (!company.slug) return;
        const existing = companyMap.get(company.slug);
        if (existing) {
          existing.count += 1;
          return;
        }
        companyMap.set(company.slug, {
          slug: company.slug,
          name: company.name || company.slug,
          count: 1,
        });
      });
    });

    const sourceFiltered = allEpisodes.filter((episode) => {
      if (activeType === "all") return true;
      const episodeType = (episode.podcastType || "internal").toLowerCase();
      return episodeType === activeType;
    });

    const searchedEpisodes = sourceFiltered.filter((episode) => matchesEpisodeSearch(episode, searchQuery));
    const episodes =
      activeSort === "trending"
        ? [...searchedEpisodes].sort((a, b) => {
            const scoreDiff = getPodcastTrendingScore(b, now) - getPodcastTrendingScore(a, now);
            if (Math.abs(scoreDiff) > 0.001) return scoreDiff;
            const bDate = Date.parse(b.publishedDate || b.updatedAt || "") || 0;
            const aDate = Date.parse(a.publishedDate || a.updatedAt || "") || 0;
            return bDate - aDate;
          })
        : searchedEpisodes;

    const companies = Array.from(companyMap.values()).sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.name.localeCompare(b.name);
    });

    return {
      props: {
        episodes,
        companies,
        fetchError: false,
        activeSort,
        activeType,
        searchQuery,
        canonicalPath,
      },
    };
  } catch {
    return {
      props: {
        episodes: [],
        companies: [],
        fetchError: true,
        activeSort,
        activeType,
        searchQuery,
        canonicalPath,
      },
    };
  }
};
