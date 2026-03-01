# LLM Indexability Report

## Schema.org JSON-LD Coverage

### Global (every page via Layout.tsx)
| Schema | Status | Notes |
|--------|--------|-------|
| Organization | Injected | Name, URL, logo, sameAs (LinkedIn, Twitter, Facebook, YouTube) |
| WebSite + SearchAction | Injected | Site search at `/search?q={query}` |

### Detail Pages
| Page Type | Schema | Status |
|-----------|--------|--------|
| Agent detail | SoftwareApplication | Present (inline) |
| MCP detail | SoftwareApplication | Present (inline) |
| Skill detail | DefinedTerm + SoftwareApplication | Present (inline) |
| Use case detail | Article + HowTo | Present (inline, HowTo conditional on steps) |
| Podcast detail | PodcastEpisode | Present (via `podcastEpisodeSchema()`) |
| Article detail | Article | Present (via `articleSchema()`) |

### Shared Schema Generators (`src/lib/seo.ts`)
| Function | Schema Type | Used By |
|----------|-------------|---------|
| `organizationSchema()` | Organization | Layout.tsx (global) |
| `webSiteSchema()` | WebSite + SearchAction | Layout.tsx (global) |
| `breadcrumbSchema()` | BreadcrumbList | All detail pages via Breadcrumb component |
| `articleSchema()` | Article | Article detail pages |
| `podcastEpisodeSchema()` | PodcastEpisode | Podcast detail pages |
| `faqSchema()` | FAQPage | Available for request-demo, landing pages |
| `productSchema()` | SoftwareApplication + AggregateRating | Available for catalog items |
| `howToSchema()` | HowTo | Available for use case implementation steps |

## Heading Hierarchy

### Audit Results (Post-Fix)
- All pages have exactly one `<h1>` (via `EnterprisePageHero` or direct `<h1>`)
- Fixed: Homepage h4 → h3 for podcast card titles
- Fixed: Solutions h3 → h2 for solution item titles
- All heading sequences are now sequential (h1 → h2 → h3)

## LLM Crawler Files

### `/llms.txt` (static)
- Platform description and capabilities overview
- "Who is it for" audience segments
- Core capability descriptions (agents, MCP, skills, use cases, resources)
- Discovery surfaces table with all routes
- Machine-readable data listing
- FAQ section (5 questions)
- Key entity definitions
- Contact information

### `/llms-full.txt` (dynamic, server-rendered)
- Complete content index generated from CMS data
- Each item includes: name, URL, status/industry/category metadata, description
- Content types: Agents, MCP Servers, Skills, Use Cases, Podcasts, Articles, Books, Case Studies
- Cached for 10 minutes, stale-while-revalidate for 20 minutes

## Meta Tags

All pages include:
- `<title>` with page-specific title
- `description` meta tag
- Open Graph tags (og:title, og:description, og:type, og:url, og:image, og:site_name)
- Twitter Card tags (twitter:card, twitter:site, twitter:title, twitter:description, twitter:image)
- Canonical `<link>` tag
- `noindex` where appropriate (internal pages)

## Sitemap

- Dynamic generation at `/sitemap.xml` via `getServerSideProps`
- Covers all published content types with `lastmod` timestamps
- `robots.txt` references sitemap URL
