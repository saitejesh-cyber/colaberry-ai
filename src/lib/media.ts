export const HERO_ASSET_VERSION = "20260227-enterprise-v3";

const HERO_ALIASES: Record<string, string> = {
  "hero-platform-cinematic.webp": "hero-platform-enterprise-v3.svg",
  "hero-agents-cinematic.webp": "hero-agents-enterprise-v3.svg",
  "hero-mcp-cinematic.webp": "hero-mcp-enterprise-v3.svg",
  "hero-solutions-cinematic.webp": "hero-solutions-enterprise-v3.svg",
  "hero-resources-cinematic.webp": "hero-resources-enterprise-v3.svg",
  "hero-industries-cinematic.webp": "hero-industries-enterprise-v3.svg",
  "hero-updates-cinematic.webp": "hero-updates-enterprise-v3.svg",
  "hero-podcasts-cinematic.webp": "hero-podcasts-enterprise-v3.svg",
  "hero-books-cinematic.webp": "hero-books-enterprise-v3.svg",
  "hero-case-studies-cinematic.webp": "hero-case-studies-enterprise-v3.svg",
  "hero-whitepapers-cinematic.webp": "hero-whitepapers-enterprise-v3.svg",
};

export const heroImage = (filename: string) =>
  `/media/hero/${HERO_ALIASES[filename] ?? filename}?v=${HERO_ASSET_VERSION}`;
