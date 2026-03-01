# Commit-Ready Plan (Batching)

## Objective
Split the revamp into reviewable commits with clean intent boundaries and reproducible validation.

## Pre-Commit Gate
Run before each commit batch:

```bash
npm run lint
rm -rf .next && npm run build
```

## Batch 1: Foundation + Design System
**Message**
`feat(ui): unify premium design tokens and shared component surfaces`

**Include**
- `src/styles/globals.css`
- `tailwind.config.ts`
- `src/pages/_app.tsx`
- `src/pages/_document.tsx`
- `src/components/Layout.tsx`
- `src/components/layout/*`
- `src/components/SectionHeader.tsx`
- `src/components/EnterprisePageHero.tsx`
- `src/components/EnterpriseCtaBand.tsx`
- `src/components/PremiumMediaCard.tsx`
- `src/components/CatalogCard.tsx`
- `src/components/AudioPlayerUI.tsx`
- `src/components/PodcastPlayer.tsx`
- `src/components/TranscriptTimeline.tsx`
- `src/components/CookieConsentBanner.tsx`
- `src/components/DemoRequestForm.tsx`
- `src/components/DemoRequestWizardModal.tsx`
- `src/components/MediaPanel.tsx`
- `src/components/AnimatedSignalBanner.tsx`
- `src/lib/media.ts`
- `src/lib/seo.ts`
- `eslint.config.mjs`
- `public/media/hero/*`
- `public/media/podcast/colaberry-ai-podcast-brand.svg`
- `public/brand/colaberry-ai-logo.svg`
- `scripts/generate-enterprise-hero-assets.mjs`
- `src/components/AgentCard.tsx` (delete)
- `src/components/MCPCard.tsx` (delete)

## Batch 2: Core Conversion + Discovery Routes
**Message**
`feat(routes): revamp core enterprise journeys and conversion surfaces`

**Include**
- `src/pages/index.tsx`
- `src/pages/request-demo.tsx`
- `src/pages/solutions/index.tsx`
- `src/pages/industries/index.tsx`
- `src/pages/industries/[industry].tsx`
- `src/pages/use-cases/index.tsx`
- `src/pages/use-cases/[slug].tsx`
- `src/pages/assistant.tsx`
- `src/pages/aixcelerator/index.tsx`
- `src/pages/aixcelerator/agents.tsx`
- `src/pages/aixcelerator/agents/[slug].tsx`
- `src/pages/aixcelerator/skills.tsx`
- `src/pages/aixcelerator/skills/[slug].tsx`
- `src/pages/aixcelerator/mcp.tsx`
- `src/pages/aixcelerator/mcp/[slug].tsx`

## Batch 3: Resources + Podcasts + Updates
**Message**
`feat(resources): premiumize editorial and podcast ecosystem routes`

**Include**
- `src/pages/resources/index.tsx`
- `src/pages/resources/books.tsx`
- `src/pages/resources/articles/index.tsx`
- `src/pages/resources/articles/[slug].tsx`
- `src/pages/resources/white-papers.tsx`
- `src/pages/resources/case-studies.tsx`
- `src/pages/resources/podcasts/index.tsx`
- `src/pages/resources/podcasts/[slug].tsx`
- `src/pages/resources/podcasts/company.tsx`
- `src/pages/resources/podcasts/tag/[tag].tsx`
- `src/pages/updates/index.tsx`

## Batch 4: Search + Legal + Utility
**Message**
`feat(ux): elevate search, privacy, cookie, and unsubscribe experiences`

**Include**
- `src/pages/search.tsx`
- `src/pages/privacy-policy.tsx`
- `src/pages/cookie-policy.tsx`
- `src/pages/unsubscribe.tsx`
- `src/pages/internal/catalog-health.tsx`
- `src/pages/internal/newsletter-report.tsx`

## Batch 5: SEO/LLM + Revamp Docs + QA Script
**Message**
`docs(launch): add revamp handoff reports and runtime smoke tooling`

**Include**
- `public/llms.txt`
- `src/pages/llms-full.txt.ts`
- `docs/revamp/*.md`
- `scripts/qa-runtime-smoke.sh`
- `package.json` (adds `qa:smoke`)
- `CLAUDE.md` (if you want operational notes versioned)

## Suggested Tag/Release
- Tag after final squash or merge: `revamp-premium-enterprise-2026-03`
