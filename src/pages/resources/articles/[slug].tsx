import { useState, useEffect } from "react";
import type { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import sanitizeHtml from "sanitize-html";
import Layout from "../../../components/Layout";
import Breadcrumb from "../../../components/Breadcrumb";
import EnterpriseCtaBand from "../../../components/EnterpriseCtaBand";
import EnterprisePageHero from "../../../components/EnterprisePageHero";
import SectionHeader from "../../../components/SectionHeader";
import StatePanel from "../../../components/StatePanel";
import { Article, ArticleMedia, fetchArticleBySlug } from "../../../lib/cms";
import { heroImage } from "../../../lib/media";
import { seoTags, canonicalUrl as buildCanonical, type SeoMeta } from "../../../lib/seo";

type ArticleDetailProps = {
  article: Article;
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<ArticleDetailProps> = async ({ params }) => {
  const slug = String(params?.slug || "");
  if (!slug) {
    return { notFound: true, revalidate: 120 };
  }

  try {
    const article = await fetchArticleBySlug(slug);
    if (!article) {
      return { notFound: true, revalidate: 120 };
    }

    return {
      props: { article },
      revalidate: 600,
    };
  } catch {
    return { notFound: true, revalidate: 120 };
  }
};

export default function ArticleDetailPage({ article }: ArticleDetailProps) {
  const publishedLabel = formatDateLabel(article.publishedAt || article.updatedAt);
  const blocks = Array.isArray(article.blocks) ? article.blocks : [];
  const readingMinutes = Math.max(1, Math.round(estimateWordCount(blocks) / 220));
  const seoMeta: SeoMeta = {
    title: `${article.title} | Articles | Colaberry AI`,
    description: article.description || "Enterprise AI article from Colaberry AI resources.",
    canonical: buildCanonical(`/resources/articles/${article.slug}`),
    ogType: "article",
    ogImage: article.coverImageUrl || null,
    ogImageAlt: article.coverImageAlt || article.title,
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
          "@type": "Article",
          "headline": article.title,
          "description": article.description || "Enterprise AI article from Colaberry AI resources.",
          "url": buildCanonical(`/resources/articles/${article.slug}`),
          ...(article.coverImageUrl ? { "image": article.coverImageUrl } : {}),
          ...(article.publishedAt ? { "datePublished": article.publishedAt } : {}),
          ...(article.updatedAt ? { "dateModified": article.updatedAt } : {}),
          ...(article.author?.name ? { "author": { "@type": "Person", "name": article.author.name } } : {}),
          "publisher": { "@type": "Organization", "name": "Colaberry AI" },
        }) }} />
      </Head>

      <ScrollProgress />

      <Breadcrumb items={[
        { label: "Home", href: "/" },
        { label: "Articles", href: "/resources/articles" },
        { label: article.title },
      ]} />

      <div className="mt-4">
        <EnterprisePageHero
          kicker={article.category?.name || "Article"}
          title={article.title}
          description={
            article.description ||
            "Structured CMS article for discoverability, indexing, and enterprise AI delivery."
          }
          image={heroImage("hero-updates-cinematic.webp")}
          alt="Editorial analysis surface"
          imageKicker="Editorial"
          imageTitle="Article narrative"
          imageDescription="Long-form analysis with structured blocks and LLM-ready context."
          chips={[
            article.category?.name || "Article",
            article.author?.name ? `By ${article.author.name}` : "Colaberry editorial",
            `${blocks.length} content block${blocks.length === 1 ? "" : "s"}`,
          ]}
          primaryAction={{ label: "Back to articles", href: "/resources/articles" }}
          secondaryAction={{ label: "Explore resources", href: "/resources", variant: "secondary" }}
          metrics={[
            {
              label: "Category",
              value: article.category?.name || "Article",
              note: "Primary taxonomy classification.",
            },
            {
              label: "Author",
              value: article.author?.name || "Colaberry editorial",
              note: "Article ownership and provenance.",
            },
            {
              label: "Published",
              value: publishedLabel || "Pending",
              note: "UTC normalized publication date.",
            },
          ]}
        />
      </div>

      <section className="surface-panel section-shell section-spacing p-5 sm:p-6">
        <SectionHeader
          kicker="At a glance"
          title="Article intelligence"
          description="Quick context for readers before diving into the full body."
          size="md"
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="section-card rounded-xl p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Category</div>
            <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
              {article.category?.name || "Article"}
            </div>
          </div>
          <div className="section-card rounded-xl p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Author</div>
            <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
              {article.author?.name || "Colaberry editorial"}
            </div>
          </div>
          <div className="section-card rounded-xl p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Reading time</div>
            <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
              ~{readingMinutes} min
            </div>
          </div>
          <div className="section-card rounded-xl p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Published</div>
            <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
              {publishedLabel || "Pending"}
            </div>
          </div>
        </div>
      </section>

      {article.coverImageUrl ? (
        <div className="surface-panel section-shell section-spacing overflow-hidden p-0">
          <div className="relative aspect-[16/7] w-full">
            <Image
              src={article.coverImageUrl}
              alt={article.coverImageAlt || article.title}
              fill
              className="h-full w-full object-cover"
              unoptimized
              loading="lazy"
            />
          </div>
        </div>
      ) : null}

      {blocks.length === 0 ? (
        <div className="section-spacing">
          <StatePanel
            variant="empty"
            title="Article body is not available yet"
            description="Publish rich text or media blocks in CMS to display full article content."
          />
        </div>
      ) : (
        <article className="surface-panel section-shell section-spacing p-6 sm:p-8">
          <div className="prose max-w-none text-slate-700 dark:text-slate-200">
            {blocks.map((block, index) => {
              const component = block.__component || "";
              if (component === "shared.rich-text") {
                const body = typeof block.body === "string" ? block.body : "";
                if (!body) return null;
                const safeHtml = sanitizeHtml(body, {
                  allowedTags: [
                    "p",
                    "br",
                    "strong",
                    "em",
                    "b",
                    "i",
                    "u",
                    "ul",
                    "ol",
                    "li",
                    "h2",
                    "h3",
                    "h4",
                    "a",
                    "blockquote",
                    "code",
                    "pre",
                  ],
                  allowedAttributes: {
                    a: ["href", "target", "rel"],
                  },
                  allowedSchemes: ["http", "https", "mailto"],
                });
                return <div key={`rich-${index}`} dangerouslySetInnerHTML={{ __html: safeHtml }} />;
              }

              if (component === "shared.quote") {
                const quoteBody = typeof block.body === "string" ? block.body : "";
                const quoteTitle = typeof block.title === "string" ? block.title : "";
                if (!quoteBody && !quoteTitle) return null;
                return (
                  <blockquote key={`quote-${index}`} className="section-card my-6 rounded-lg p-5">
                    {quoteTitle ? <div className="mb-2 text-sm font-semibold text-slate-900">{quoteTitle}</div> : null}
                    {quoteBody ? <p className="m-0 text-slate-700">{quoteBody}</p> : null}
                  </blockquote>
                );
              }

              if (component === "shared.media") {
                const [media] = extractMediaList(block.file);
                if (!media) return null;
                return (
                  <figure key={`media-${index}`} className="my-6">
                    <Image
                      src={media.url}
                      alt={media.alt || article.title}
                      width={1400}
                      height={840}
                      className="h-auto w-full rounded-lg border border-slate-200/80 object-cover"
                      unoptimized
                      loading="lazy"
                    />
                  </figure>
                );
              }

              if (component === "shared.slider") {
                const mediaItems = extractMediaList(block.files);
                if (mediaItems.length === 0) return null;
                return (
                  <div key={`slider-${index}`} className="my-6 grid gap-3 sm:grid-cols-2">
                    {mediaItems.map((media, mediaIndex) => (
                      <Image
                        key={`${media.url}-${mediaIndex}`}
                        src={media.url}
                        alt={media.alt || `${article.title} media ${mediaIndex + 1}`}
                        width={1200}
                        height={720}
                        className="h-auto w-full rounded-lg border border-slate-200/80 object-cover"
                        unoptimized
                        loading="lazy"
                      />
                    ))}
                  </div>
                );
              }

              return null;
            })}
          </div>
        </article>
      )}

      <div className="section-spacing flex flex-col gap-3 sm:flex-row">
        <Link href="/resources/articles" className="btn btn-secondary">
          Back to Articles
        </Link>
        <Link href="/resources" className="btn btn-primary">
          Explore Resources
        </Link>
      </div>

      <EnterpriseCtaBand
        kicker="Keep reading"
        title="Turn this article into practical next steps"
        description="Continue with related resources, implementation patterns, and decision-ready assets for your team."
        primaryHref="/resources"
        primaryLabel="Explore resources"
        secondaryHref="/updates"
        secondaryLabel="Open updates feed"
      />

      <ShareActions />
    </Layout>
  );
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      className="scroll-progress"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
      style={{ transform: `scaleX(${progress / 100})` }}
    />
  );
}

function ShareActions() {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const copy = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard || typeof window === "undefined") {
      setStatus("error");
      return;
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
      setStatus("copied");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
    }
  };
  return (
    <div className="fixed bottom-6 right-6 z-30 flex gap-2">
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--stroke)] bg-[var(--surface-strong)] shadow-lg transition-colors hover:bg-[var(--surface-soft)]"
        aria-label="Copy link"
        onClick={copy}
      >
        {status === "copied" ? (
          <svg viewBox="0 0 20 20" className="h-4 w-4 text-[var(--trust-green)]" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
        ) : status === "error" ? (
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v5" /><path d="M12 16h.01" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-[var(--text-secondary)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
        )}
      </button>
    </div>
  );
}

function formatDateLabel(value?: string | null) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function toRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object") return null;
  return value as Record<string, unknown>;
}

function toAbsoluteMediaUrl(rawUrl?: string | null) {
  if (!rawUrl) return null;
  const base = process.env.NEXT_PUBLIC_CMS_URL || "";
  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) return rawUrl;
  if (rawUrl.startsWith("/") && base) return `${base}${rawUrl}`;
  return rawUrl;
}

function extractMediaEntry(value: unknown): ArticleMedia | null {
  const root = toRecord(value);
  if (!root) return null;
  const attrs = toRecord(root.attributes);
  const rawUrl =
    (typeof root.url === "string" ? root.url : null) ??
    (typeof attrs?.url === "string" ? attrs.url : null) ??
    null;
  const rawAlt =
    (typeof root.alternativeText === "string" ? root.alternativeText : null) ??
    (typeof attrs?.alternativeText === "string" ? attrs.alternativeText : null) ??
    null;
  const url = toAbsoluteMediaUrl(rawUrl);
  if (!url) return null;
  return { url, alt: rawAlt };
}

function extractMediaList(value: unknown): ArticleMedia[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map(extractMediaEntry).filter((item): item is ArticleMedia => Boolean(item));
  }
  const root = toRecord(value);
  if (!root) return [];
  const data = root.data;
  if (Array.isArray(data)) {
    return data.map(extractMediaEntry).filter((item): item is ArticleMedia => Boolean(item));
  }
  if (data) {
    const one = extractMediaEntry(data);
    return one ? [one] : [];
  }
  const one = extractMediaEntry(root);
  return one ? [one] : [];
}

function estimateWordCount(blocks: Array<Record<string, unknown>>) {
  const text = blocks
    .map((block) => {
      const component = String(block.__component || "");
      if (component === "shared.rich-text") {
        return typeof block.body === "string" ? block.body.replace(/<[^>]*>/g, " ") : "";
      }
      if (component === "shared.quote") {
        return `${typeof block.title === "string" ? block.title : ""} ${typeof block.body === "string" ? block.body : ""}`.trim();
      }
      return "";
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return 0;
  return text.split(" ").filter(Boolean).length;
}
