/**
 * SEO utility functions for consistent meta tag generation across pages.
 */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://colaberry.ai";

const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`;

const TWITTER_HANDLE = "@colaberry";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type SeoMeta = {
  title: string;
  description: string;
  canonical?: string;
  ogType?: "website" | "article";
  ogImage?: string | null;
  ogImageAlt?: string;
  noindex?: boolean;
};

export type SeoTagDefinition =
  | { key: string; name: string; content: string }
  | { key: string; property: string; content: string }
  | { key: "canonical"; rel: "canonical"; href: string };

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Build an absolute canonical URL from a path segment. */
export function canonicalUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${clean}`;
}

/** Resolve the best og:image — fall back to default brand image. */
export function resolveOgImage(image?: string | null): string {
  if (!image) return DEFAULT_OG_IMAGE;
  // Already absolute
  if (/^https?:\/\//i.test(image)) return image;
  // Relative path → make absolute
  return `${SITE_URL}${image.startsWith("/") ? image : `/${image}`}`;
}

/**
 * Generate an array of `<meta>` / `<link>` JSX-compatible objects
 * for use inside `<Head>` via `.map()`.
 *
 * Usage:
 * ```tsx
 * import { seoTags, type SeoMeta } from "@/lib/seo";
 * // inside component:
 * <Head>
 *   <title>{meta.title}</title>
 *   {seoTags(meta).map(({ key, ...props }) => (
 *     props.rel ? <link key={key} {...props} /> : <meta key={key} {...props} />
 *   ))}
 * </Head>
 * ```
 */
export function seoTags(meta: SeoMeta) {
  const ogImage = resolveOgImage(meta.ogImage);
  const ogType = meta.ogType ?? "website";
  const canonical = meta.canonical ?? SITE_URL;

  const tags: SeoTagDefinition[] = [
    // Basic
    { key: "desc", name: "description", content: meta.description },

    // Open Graph
    { key: "og:title", property: "og:title", content: meta.title },
    { key: "og:desc", property: "og:description", content: meta.description },
    { key: "og:type", property: "og:type", content: ogType },
    { key: "og:url", property: "og:url", content: canonical },
    { key: "og:image", property: "og:image", content: ogImage },
    { key: "og:site", property: "og:site_name", content: "Colaberry AI" },

    // Twitter Card
    { key: "tw:card", name: "twitter:card", content: "summary_large_image" },
    { key: "tw:site", name: "twitter:site", content: TWITTER_HANDLE },
    { key: "tw:title", name: "twitter:title", content: meta.title },
    { key: "tw:desc", name: "twitter:description", content: meta.description },
    { key: "tw:image", name: "twitter:image", content: ogImage },

    // Canonical (rendered as <link>)
    { key: "canonical", rel: "canonical", href: canonical },
  ];

  if (meta.ogImageAlt) {
    tags.push({ key: "og:image:alt", property: "og:image:alt", content: meta.ogImageAlt });
    tags.push({ key: "tw:image:alt", name: "twitter:image:alt", content: meta.ogImageAlt });
  }

  if (meta.noindex) {
    tags.push({ key: "robots", name: "robots", content: "noindex,nofollow" });
  }

  return tags;
}

/* ------------------------------------------------------------------ */
/* JSON-LD Schema Generators                                           */
/* ------------------------------------------------------------------ */

/** Build a JSON-LD BreadcrumbList from an ordered array of breadcrumb items. */
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Build a JSON-LD Organization object for Colaberry AI. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Colaberry AI",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [
      "https://www.linkedin.com/company/colaberry",
      "https://twitter.com/colaberry",
      "https://www.facebook.com/colaberry",
      "https://www.youtube.com/@colaberry",
    ],
  };
}

/** Build a JSON-LD Article object. */
export function articleSchema(article: {
  title: string;
  description: string;
  author?: string;
  publishedAt?: string;
  updatedAt?: string;
  image?: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: article.url,
    ...(article.image && { image: resolveOgImage(article.image) }),
    ...(article.publishedAt && { datePublished: article.publishedAt }),
    ...(article.updatedAt && { dateModified: article.updatedAt }),
    ...(article.author && {
      author: {
        "@type": "Person",
        name: article.author,
      },
    }),
    publisher: {
      "@type": "Organization",
      name: "Colaberry AI",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
  };
}

/** Build a JSON-LD PodcastEpisode object. */
export function podcastEpisodeSchema(episode: {
  title: string;
  description?: string;
  audioUrl?: string;
  duration?: string;
  publishedDate?: string;
  episodeNumber?: number;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "PodcastEpisode",
    name: episode.title,
    url: episode.url,
    ...(episode.description && { description: episode.description }),
    ...(episode.audioUrl && {
      associatedMedia: {
        "@type": "MediaObject",
        contentUrl: episode.audioUrl,
      },
    }),
    ...(episode.duration && { timeRequired: episode.duration }),
    ...(episode.publishedDate && { datePublished: episode.publishedDate }),
    ...(episode.episodeNumber != null && {
      episodeNumber: episode.episodeNumber,
    }),
    partOfSeries: {
      "@type": "PodcastSeries",
      name: "Colaberry AI Podcast",
      url: `${SITE_URL}/resources/podcasts`,
    },
  };
}

/** Build a JSON-LD FAQPage object from an array of Q&A items. */
export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/** Build a JSON-LD SoftwareApplication / Product object for catalog items. */
export function productSchema(product: {
  name: string;
  description: string;
  url: string;
  category?: string;
  rating?: number | null;
  ratingCount?: number | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    description: product.description,
    url: product.url,
    applicationCategory: product.category ?? "AI Agent",
    ...(product.rating != null && product.ratingCount != null && product.ratingCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            ratingCount: product.ratingCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };
}

/** Build a JSON-LD HowTo object for use case implementation steps. */
export function howToSchema(howTo: {
  name: string;
  description: string;
  url: string;
  steps: { name: string; text: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: howTo.name,
    description: howTo.description,
    url: howTo.url,
    step: howTo.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

/** Build a JSON-LD WebSite object with a SearchAction for site search. */
export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Colaberry AI",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}
