# Phase 1: Discovery & Inventory

## 1. Route Map

### Public Pages (22 routes)

| Route | File | Data Strategy | Description |
|-------|------|--------------|-------------|
| `/` | `src/pages/index.tsx` | SSG + ISR 600s | Homepage — hero, signal grid, sections |
| `/aixcelerator` | `src/pages/aixcelerator/index.tsx` | SSG + ISR 600s | Platform hub |
| `/aixcelerator/agents` | `src/pages/aixcelerator/agents.tsx` | SSG + ISR 600s | Agents catalog — search, filter, grid |
| `/aixcelerator/agents/[slug]` | `src/pages/aixcelerator/agents/[slug].tsx` | SSG + ISR 600s | Agent detail — description, metadata, sidebar |
| `/aixcelerator/mcp` | `src/pages/aixcelerator/mcp.tsx` | SSG + ISR 600s | MCP Servers catalog |
| `/aixcelerator/mcp/[slug]` | `src/pages/aixcelerator/mcp/[slug].tsx` | SSG + ISR 600s | MCP Server detail |
| `/aixcelerator/skills` | `src/pages/aixcelerator/skills.tsx` | SSG + ISR 600s | Skills catalog |
| `/aixcelerator/skills/[slug]` | `src/pages/aixcelerator/skills/[slug].tsx` | SSG + ISR 600s | Skill detail |
| `/use-cases` | `src/pages/use-cases/index.tsx` | SSG + ISR 600s | Use cases index |
| `/use-cases/[slug]` | `src/pages/use-cases/[slug].tsx` | SSG + ISR 600s | Use case detail |
| `/industries` | `src/pages/industries/index.tsx` | SSG + ISR 600s | Industries hub |
| `/industries/[industry]` | `src/pages/industries/[industry].tsx` | SSG + ISR 600s | Industry landing page |
| `/solutions` | `src/pages/solutions/index.tsx` | SSG + ISR 600s | Solutions & playbooks |
| `/resources` | `src/pages/resources/index.tsx` | SSG + ISR 600s | Resources overview |
| `/resources/articles` | `src/pages/resources/articles/index.tsx` | SSG + ISR 600s | Articles listing |
| `/resources/articles/[slug]` | `src/pages/resources/articles/[slug].tsx` | SSG + ISR 600s | Article detail (RichText blocks) |
| `/resources/podcasts` | `src/pages/resources/podcasts/index.tsx` | SSR | Podcast listing (inline player) |
| `/resources/podcasts/[slug]` | `src/pages/resources/podcasts/[slug].tsx` | SSG + ISR 600s | Podcast episode detail |
| `/resources/podcasts/company` | `src/pages/resources/podcasts/company.tsx` | SSR | Company-filtered podcasts |
| `/resources/podcasts/tag/[tag]` | `src/pages/resources/podcasts/tag/[tag].tsx` | SSR | Tag-filtered podcasts |
| `/resources/books` | `src/pages/resources/books.tsx` | SSG + ISR 600s | Books catalog |
| `/resources/white-papers` | `src/pages/resources/white-papers.tsx` | SSG + ISR 600s | White papers index |
| `/resources/case-studies` | `src/pages/resources/case-studies.tsx` | SSG + ISR 600s | Case studies index |
| `/updates` | `src/pages/updates/index.tsx` | SSG + ISR 600s | News & product updates |
| `/request-demo` | `src/pages/request-demo.tsx` | Static | Demo request form |
| `/assistant` | `src/pages/assistant.tsx` | Static | Discovery assistant |
| `/search` | `src/pages/search.tsx` | Client-side | Global search |
| `/cookie-policy` | `src/pages/cookie-policy.tsx` | Static | Cookie policy |
| `/privacy-policy` | `src/pages/privacy-policy.tsx` | Static | Privacy policy |
| `/unsubscribe` | `src/pages/unsubscribe.tsx` | Client-side | Newsletter unsubscribe |

### Internal Pages (2 routes)

| Route | File | Description |
|-------|------|-------------|
| `/internal/newsletter-report` | `src/pages/internal/newsletter-report.tsx` | Campaign reporting |
| `/internal/catalog-health` | `src/pages/internal/catalog-health.tsx` | Catalog data health |

### API Routes (8 endpoints)

| Endpoint | File | Method | Description |
|----------|------|--------|-------------|
| `/api/demo-request` | `src/pages/api/demo-request.ts` | POST | Demo request submission + rate limiting |
| `/api/newsletter-subscribe` | `src/pages/api/newsletter-subscribe.ts` | POST | Newsletter subscription |
| `/api/newsletter-unsubscribe` | `src/pages/api/newsletter-unsubscribe.ts` | POST | Unsubscribe with token validation |
| `/api/newsletter-send` | `src/pages/api/newsletter-send.ts` | POST | Trigger newsletter send |
| `/api/newsletter-report` | `src/pages/api/newsletter-report.ts` | POST | Newsletter reporting |
| `/api/newsletter-template-preview` | `src/pages/api/newsletter-template-preview.ts` | GET | Preview newsletter HTML |
| `/api/podcast-log` | `src/pages/api/podcast-log.ts` | POST | Podcast event logging |
| `/api/catalog-health` | `src/pages/api/catalog-health.ts` | GET | Catalog health metrics |

### Generated Routes (3)

| Route | File | Description |
|-------|------|-------------|
| `/robots.txt` | `src/pages/robots.txt.ts` | Robots.txt generator |
| `/sitemap.xml` | `src/pages/sitemap.xml.ts` | Sitemap generator |
| `/llms-full.txt` | `src/pages/llms-full.txt.ts` | LLM catalog endpoint |

### URL Rewrites (from next.config.ts)

| From | To |
|------|----|
| `/podcasts` | `/resources/podcasts` |
| `/podcast/:slug` | `/resources/podcasts/company?slug=:slug` |
| `/articles` | `/resources/articles` |

---

## 2. Component Catalog (28 components)

### Shell & Layout
| Component | File | Lines | Purpose |
|-----------|------|-------|---------|
| Layout | `src/components/Layout.tsx` | ~524 | Root shell: header, nav, footer, sidebar, dark mode toggle |
| EnterprisePageHero | `src/components/EnterprisePageHero.tsx` | ~150 | Hero section with kicker, title, description, image, metrics |
| EnterpriseCtaBand | `src/components/EnterpriseCtaBand.tsx` | ~80 | Full-width CTA band with dual buttons |
| SectionHeader | `src/components/SectionHeader.tsx` | ~40 | Section title/subtitle divider |
| Breadcrumb | `src/components/Breadcrumb.tsx` | ~30 | Navigation breadcrumb for detail pages |

### Data Display & Cards
| Component | File | Purpose |
|-----------|------|---------|
| AgentCard | `src/components/AgentCard.tsx` | Agent catalog card with badges, metadata, gradient border |
| MCPCard | `src/components/MCPCard.tsx` | MCP server catalog card |
| PremiumMediaCard | `src/components/PremiumMediaCard.tsx` | Featured media card with playback |
| SkeletonCard | `src/components/SkeletonCard.tsx` | Shimmer loading skeleton for grids |
| ComparisonTable | `src/components/ComparisonTable.tsx` | Feature comparison table |
| MetricCounter | `src/components/MetricCounter.tsx` | Animated number counter |
| TrustBadge | `src/components/TrustBadge.tsx` | Trust signal badges |
| TestimonialBlock | `src/components/TestimonialBlock.tsx` | Testimonial with quote/author |
| LogoGrid | `src/components/LogoGrid.tsx` | Partner/customer logo grid |

### State & Feedback
| Component | File | Purpose |
|-----------|------|---------|
| StatePanel | `src/components/StatePanel.tsx` | Loading/empty/error state handler |
| AnimatedSignalBanner | `src/components/AnimatedSignalBanner.tsx` | Animated notification banner |

### Content & Media
| Component | File | Purpose |
|-----------|------|---------|
| RichText | `src/components/RichText.tsx` | Rich text renderer (bold, italic, links, code, blockquotes, images) |
| TableOfContents | `src/components/TableOfContents.tsx` | Auto-generated TOC from headings |
| MediaPanel | `src/components/MediaPanel.tsx` | Sidebar media panel |
| PodcastPlayer | `src/components/PodcastPlayer.tsx` | Hidden audio + play button for inline playback |
| AudioPlayerUI | `src/components/AudioPlayerUI.tsx` | Full audio player with progress/speed |
| BuzzsproutPlayer | `src/components/BuzzsproutPlayer.tsx` | Embedded Buzzsprout widget |
| TranscriptTimeline | `src/components/TranscriptTimeline.tsx` | Podcast transcript timeline |

### Forms & Input
| Component | File | Purpose |
|-----------|------|---------|
| DemoRequestForm | `src/components/DemoRequestForm.tsx` | Demo request form with validation |
| DemoRequestWizardModal | `src/components/DemoRequestWizardModal.tsx` | Multi-step demo wizard |
| NewsletterSignup | `src/components/NewsletterSignup.tsx` | Email subscription form |
| CatalogSearchBox | `src/components/CatalogSearchBox.tsx` | Search input with router query |
| CookieConsentBanner | `src/components/CookieConsentBanner.tsx` | GDPR cookie consent UI |

---

## 3. Library Modules (14 files)

| File | Purpose |
|------|---------|
| `src/lib/cms.ts` | CMS data fetching, caching (TTL), TypeScript types for all 10+ content models |
| `src/lib/catalogFormatters.ts` | Shared card helpers: formatShortDate, formatUsage, tone functions |
| `src/lib/seo.ts` | SEO tag generation: canonicalUrl, resolveOgImage, seoTags() |
| `src/lib/tracking.ts` | UTM parameter capture + localStorage persistence |
| `src/lib/demoRequest.ts` | Demo request submission logic, email validation |
| `src/lib/media.ts` | Hero asset versioning, image alias mapping |
| `src/lib/cookieConsent.ts` | Cookie consent state management |
| `src/lib/catalogHealth.ts` | Catalog health scoring and data readiness |
| `src/lib/gaiInsights.ts` | GAI-specific insights/analytics |
| `src/lib/podcastTelemetry.ts` | Podcast event logging utilities |
| `src/lib/newsletterTemplate.ts` | Newsletter HTML/text template generation |
| `src/lib/newsletterSender.ts` | Email sending abstraction |
| `src/lib/newsletterTokens.ts` | Token creation/validation for unsubscribe links |
| `src/lib/newsletterCampaignDefaults.ts` | Default newsletter campaign metadata |

## 4. Hooks (1 file)

| File | Purpose |
|------|---------|
| `src/hooks/useScrollProgress.ts` | Returns 0-1 scroll progress (rAF-based) |

---

## 5. Design Token Inventory

### Color Tokens (from tailwind.config.ts + globals.css)
- **Coral/Primary**: `#DC2626` (light), `#F87171` (dark) — CTAs, active states
- **Emerald/Accent**: `#059669` (light), `#10B981` (dark) — success, trust
- **Ink**: `#111827` (light bg dark), `#F9FAFB` (dark bg light) — text
- **Surface**: `#FAF9F6` (light), `#111827` (dark) — page background
- **Muted**: `#6B7280` / `#9CA3AF` — secondary text
- **Stroke**: `#E5E7EB` / `#374151` — borders
- **Semantic families**: `pivot-*`, `trusted-*`, `failure-*`, `neutral-*` (each with surface/stroke/text/fill)

### Typography Scale
- Display: `display-2xl` (4.5rem) → `display-xs` (1.5rem) — PT Serif
- Body: `body-lg` (1.125rem) → `body-xs` (0.75rem) — Source Sans
- Special: `label` (0.6875rem, tracking 0.14em), `caption` (0.9375rem)

### Spacing
- Section gaps: 4rem (sm) → 5rem (md) → 6rem (lg)
- Card padding: p-4 (compact), p-5 (sidebar), p-6 (sections)
- Content max-width: `max-w-7xl` (56rem)

### Component Classes (from globals.css)
- Buttons: `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-compact`, `.btn-icon`
- Cards: `.card-elevated`, `.card-featured`, `.card-glass`, `.card-catalog`
- Chips: `.chip`, `.chip-brand`, `.chip-muted`
- Panels: `.surface-panel`
- Sections: `.section-shell`, `.section-spacing`
- Header: `.site-header`, `.site-header--compact`
- Animations: `.reveal`, `.reveal-left`, `.reveal-right`, `.reveal-scale`
- Links: `.link-underline`
- Inputs: `.input-premium`
- Badges: `.badge-verified`, `.badge-external`, `.badge-beta`, `.badge-private`

### Animation Keyframes
- `fade-in`, `slide-up`, `slide-down`, `scale-in`, `shimmer`
- `slide-in-left`, `slide-in-right`, `blur-in`, `pulse-soft`, `float`
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)`
- Reduced motion: all animations disabled via `prefers-reduced-motion: reduce`

---

## 6. CMS Content Type → Page Mapping

| CMS Type | Frontend Type (cms.ts) | Pages Using It |
|----------|----------------------|----------------|
| `api::agent.agent` | `Agent` | agents.tsx, agents/[slug].tsx, index.tsx |
| `api::mcp-server.mcp-server` | `MCPServer` | mcp.tsx, mcp/[slug].tsx |
| `api::skill.skill` | `Skill` | skills.tsx, skills/[slug].tsx |
| `api::podcast-episode.podcast-episode` | `PodcastEpisode` | podcasts/*.tsx |
| `api::article.article` | `Article` | articles/*.tsx |
| `api::use-case.use-case` | `UseCase` | use-cases/*.tsx |
| `api::book.book` | `Book` | books.tsx |
| `api::case-study.case-study` | `CaseStudy` | case-studies.tsx |
| `api::tag.tag` | `Tag` | Multiple (filtering) |
| `api::company.company` | `Company` | Multiple (filtering) |
| `api::category.category` | `Category` | articles, books, case-studies |
| `api::global-navigation.global-navigation` | `GlobalNavigation` | Layout.tsx |
| `api::newsletter-subscriber.newsletter-subscriber` | — | newsletter-subscribe/unsubscribe APIs |
| `api::podcast-log.podcast-log` | — | podcast-log API |
| `api::author.author` | — | articles (via relation) |
| `api::import-job.import-job` | — | Internal only |

---

## 7. Dependencies

### Runtime
- `next@^16.1.6` — Next.js 16 (Pages Router)
- `react@19.2.3` / `react-dom@19.2.3` — React 19
- `sanitize-html@^2.13.0` — HTML sanitization for RichText

### Dev
- `tailwindcss@^4` / `@tailwindcss/postcss@^4` — Tailwind CSS v4
- `typescript@^5` — TypeScript 5
- `eslint@^9` / `eslint-config-next@^16.1.6` — ESLint 9

---

## 8. Security Configuration (next.config.ts)

- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
- CSP: script-src 'self' 'unsafe-inline' *.googletagmanager.com; img-src 'self' data: CMS_ORIGIN; connect-src 'self' CMS_ORIGIN *.google-analytics.com
- HSTS: max-age=31536000; includeSubDomains; preload
