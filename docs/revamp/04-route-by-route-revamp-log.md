# Route-by-Route Revamp Log

## Phase 1: Design Foundation (All Pages)

**Files:** `tailwind.config.ts`, `src/styles/globals.css`, `src/pages/_document.tsx`, `scripts/generate-enterprise-hero-assets.mjs`

- Replaced Midnight Coral palette with Obsidian Signal (indigo/teal)
- Migrated fonts: PT Serif + Source Sans 3 → Inter (variable) + JetBrains Mono
- Regenerated all 11 hero SVG assets with new palette
- Updated all CSS custom properties in `:root` and `.dark` scopes
- Updated logo and podcast brand SVG accent colors

## Phase 2: Global Shell

**File:** `src/components/Layout.tsx`

- Replaced 38 hardcoded brand colors with CSS variable references
- Header: frosted glass with `backdrop-blur-xl`, compact on scroll
- Added `aria-pressed` to theme toggle buttons
- Added keyboard navigation (ArrowDown/Up/Escape) to dropdown menus

## Phase 3: Components

| Component | Changes |
|-----------|---------|
| EnterprisePageHero | Dark gradient: `#450A0A` → `#1E1B4B` |
| SectionHeader | Kicker dot: `bg-[#059669]` → `bg-[var(--trusted-fill)]` |
| AnimatedSignalBanner | Typography to design tokens, `text-indigo-100` |
| EnterpriseCtaBand | `#059669` → `#0D9488`, `#111827` → `#0F172A` |
| CookieConsentBanner | All hardcoded hex → token-mapped values |
| AudioPlayerUI | Progress bar: `#DC2626` → `#4F46E5` |
| TranscriptTimeline | Active: `#F87171` → `#818CF8` |
| MediaPanel / PremiumMediaCard | Dark bg: `#1F2937` → `#1E293B` |
| DemoRequestWizardModal | Dark bg: `#111827` → `#0F172A` |

## Phase 4: Page Content Rewrites

### Homepage (`/`)
- Hero: "Ship AI programs with confidence"
- All section headers rewritten for outcome-first messaging
- Catalog card descriptions benefit-oriented
- Heading fix: h4 → h3 on podcast cards

### Request Demo (`/request-demo`)
- Hero: "Talk to our team about your AI strategy"

### AIXcelerator Hub (`/aixcelerator`)
- "Go from AI pilot to production in weeks"
- Section headers and CTAs rewritten

### Agent Catalog (`/aixcelerator/agents`)
- "Browse production-ready AI agents by industry, status, and owner"

### MCP Catalog (`/aixcelerator/mcp`)
- "Connect AI agents to your business apps and data"

### Skills Catalog (`/aixcelerator/skills`)
- "Add proven capabilities to your agents in minutes"

### Resources Hub (`/resources`)
- "Knowledge hub" kicker, all card descriptions rewritten

### Podcasts, Articles, Books, White Papers, Case Studies
- All descriptions rewritten for decision-maker clarity

### Industries (`/industries`)
- "AI built for your industry" with outcome-focused card copy

### Solutions (`/solutions`)
- "Accelerate AI delivery with ready-made solutions"
- Heading fix: h3 → h2 on solution items

### Updates (`/updates`)
- "One feed for everything that matters in AI"

### Search (`/search`)
- "Find what you need, fast" with concrete example placeholders

### Assistant (`/assistant`)
- "Find the right AI solution in seconds"

### Use Cases (`/use-cases`)
- "Real problems, real outcomes"

## Phase 5: SEO & LLM Indexability

- Injected `organizationSchema()` + `webSiteSchema()` globally in Layout
- Added `productSchema()` and `howToSchema()` to seo.ts
- Rewrote `public/llms.txt` with FAQ, entity definitions, route table
- Enhanced `llms-full.txt.ts` with status/industry/category/date metadata
- Fixed heading hierarchy across homepage and solutions
