export const HERO_ASSET_VERSION = "20260301-premium-assets-v2";

const HERO_ALIASES: Record<string, string> = {
  "hero-platform-cinematic.webp": "hero-platform-realistic-v1.webp",
  "hero-agents-cinematic.webp": "hero-agents-realistic-v1.webp",
  "hero-mcp-cinematic.webp": "hero-mcp-realistic-v1.webp",
  "hero-solutions-cinematic.webp": "hero-solutions-realistic-v1.webp",
  "hero-resources-cinematic.webp": "hero-resources-realistic-v1.webp",
  "hero-industries-cinematic.webp": "hero-industries-realistic-v1.webp",
  "hero-updates-cinematic.webp": "hero-updates-realistic-v1.webp",
  "hero-podcasts-cinematic.webp": "hero-podcasts-realistic-v1.webp",
  "hero-books-cinematic.webp": "hero-books-realistic-v1.webp",
  "hero-case-studies-cinematic.webp": "hero-case-studies-realistic-v1.webp",
  "hero-whitepapers-cinematic.webp": "hero-whitepapers-realistic-v1.webp",
  "hero-request-demo-cinematic.webp": "hero-request-demo-realistic-v1.webp",
  "hero-assistant-cinematic.webp": "hero-assistant-realistic-v1.webp",
  "hero-articles-cinematic.webp": "hero-articles-realistic-v1.webp",
  "hero-privacy-cinematic.webp": "hero-privacy-realistic-v1.webp",
  "hero-cookie-cinematic.webp": "hero-cookie-realistic-v1.webp",
  "hero-unsubscribe-cinematic.webp": "hero-unsubscribe-realistic-v1.webp",
};

const HERO_NANO_ALIASES: Record<string, string> = {
  "hero-platform-cinematic.webp": "hero-platform-nano-banner-v1.webp",
  "hero-agents-cinematic.webp": "hero-agents-nano-banner-v1.webp",
  "hero-mcp-cinematic.webp": "hero-mcp-nano-banner-v1.webp",
  "hero-solutions-cinematic.webp": "hero-solutions-nano-banner-v1.webp",
  "hero-resources-cinematic.webp": "hero-resources-nano-banner-v1.webp",
  "hero-industries-cinematic.webp": "hero-industries-nano-banner-v1.webp",
  "hero-updates-cinematic.webp": "hero-updates-nano-banner-v1.webp",
  "hero-podcasts-cinematic.webp": "hero-podcasts-nano-banner-v1.webp",
  "hero-books-cinematic.webp": "hero-books-nano-banner-v1.webp",
  "hero-case-studies-cinematic.webp": "hero-case-studies-nano-banner-v1.webp",
  "hero-whitepapers-cinematic.webp": "hero-whitepapers-nano-banner-v1.webp",
  "hero-request-demo-cinematic.webp": "hero-request-demo-nano-banner-v1.webp",
  "hero-assistant-cinematic.webp": "hero-assistant-nano-banner-v1.webp",
  "hero-articles-cinematic.webp": "hero-articles-nano-banner-v1.webp",
  "hero-privacy-cinematic.webp": "hero-privacy-nano-banner-v1.webp",
  "hero-cookie-cinematic.webp": "hero-cookie-nano-banner-v1.webp",
  "hero-unsubscribe-cinematic.webp": "hero-unsubscribe-nano-banner-v1.webp",
};

export const heroImage = (filename: string) =>
  `/media/hero/${HERO_ALIASES[filename] ?? filename}?v=${HERO_ASSET_VERSION}`;

export const heroNanoImage = (filename: string) =>
  `/media/hero/${HERO_NANO_ALIASES[filename] ?? HERO_ALIASES[filename] ?? filename}?v=${HERO_ASSET_VERSION}`;
