# Design System: Obsidian Signal

## Token Inventory

### Colors

| Role | Light Mode | Dark Mode | CSS Token | Tailwind |
|------|-----------|-----------|-----------|----------|
| Primary (Indigo) | `#4F46E5` | `#818CF8` | `--pivot-fill` | `brand-purple-600` / `brand-purple-400` |
| Primary Surface | `#EEF2FF` | `#1E1B4B` | `--pivot-surface` | `brand-purple-50` / `brand-purple-950` |
| Accent (Jade) | `#0D9488` | `#2DD4BF` | `--trusted-fill` | `brand-teal-600` / `brand-teal-400` |
| Accent Surface | `#F0FDFA` | `#042F2E` | `--trusted-surface` | `brand-teal-50` / `brand-teal-950` |
| Error (Rose) | `#E11D48` | `#FB7185` | `--failure-fill` | `brand-rose-600` / `brand-rose-400` |
| Ink/Text | `#0F172A` | `#F8FAFC` | `--neutral-text` | `brand-ink` |
| Surface | `#FAFBFC` | `#0F172A` | `--bg` | — |
| Muted | `#64748B` | `#94A3B8` | `--text-muted` | `slate-500` / `slate-400` |
| Stroke | `#E2E8F0` | `#334155` | `--stroke` | `slate-200` / `slate-700` |
| Warm Gold | `#D97706` | `#FBBF24` | `--trust-amber` | `amber-600` / `amber-400` |

### Typography Scale

| Token | Size | Line Height | Letter Spacing | Usage |
|-------|------|-------------|----------------|-------|
| `display-2xl` | 4.5rem | 1.05 | -0.03em | Hero headlines (rare) |
| `display-xl` | 3.75rem | 1.06 | -0.028em | Page titles (desktop) |
| `display-lg` | 3rem | 1.08 | -0.025em | Page titles (tablet) |
| `display-md` | 2.25rem | 1.1 | -0.02em | Section titles |
| `display-sm` | 1.875rem | 1.15 | -0.015em | Card titles (large) |
| `display-xs` | 1.5rem | 1.2 | -0.01em | Card titles |
| `body-lg` | 1.125rem | 1.65 | 0 | Lead paragraphs |
| `body-md` | 1rem | 1.65 | 0 | Body text |
| `body-sm` | 0.875rem | 1.6 | 0.01em | Secondary text |
| `body-xs` | 0.75rem | 1.5 | 0.02em | Captions |
| `label` | 0.6875rem | 1 | 0.14em | Kickers, badges |
| `caption` | 0.9375rem | 1.45 | 0 | Card metadata |

### Fonts

| Family | Weight | Usage |
|--------|--------|-------|
| Inter (variable) | 400-800 | Headlines, body text, UI |
| JetBrains Mono | 400 | Metrics, code blocks, data |

### Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.04)` | Cards at rest |
| `--shadow-md` | `0 2px 4px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.06)` | Cards on hover |
| `--shadow-lg` | `0 4px 8px rgba(0,0,0,0.04), 0 12px 28px rgba(0,0,0,0.08)` | Dropdowns |
| `--shadow-xl` | `0 8px 16px rgba(0,0,0,0.05), 0 24px 48px rgba(0,0,0,0.10)` | Modals |

### Motion

| Property | Value | Context |
|----------|-------|---------|
| Ease | `cubic-bezier(0.22, 1, 0.36, 1)` | All transitions |
| Entry | 300ms fade + 12px translate | Page/section reveals |
| Hover | 150ms scale(1.02) | Cards |
| Button hover | 150ms translateY(-1px) | All buttons |
| Reduced motion | All animations disabled | `prefers-reduced-motion: reduce` |

### Shape

| Element | Radius |
|---------|--------|
| Cards | `12px` (rounded-xl) |
| Buttons | `8px` (rounded-lg) |
| Inputs | `8px` (rounded-lg) |
| Chips/badges | `6px` (rounded-md) |

---

## Component Catalog

### Layout Shell

| Component | File | Description |
|-----------|------|-------------|
| `Layout` | `src/components/Layout.tsx` | Root shell — header, footer, nav, mobile menu, sidebar, search |
| `Breadcrumb` | `src/components/Breadcrumb.tsx` | Breadcrumb trail with Schema.org BreadcrumbList |

### Heroes & Banners

| Component | File | Description |
|-----------|------|-------------|
| `EnterprisePageHero` | `src/components/EnterprisePageHero.tsx` | Full hero with h1, kicker, description, image, metrics |
| `AnimatedSignalBanner` | `src/components/AnimatedSignalBanner.tsx` | Animated CTA band with orb effects (4 variants) |
| `EnterpriseCtaBand` | `src/components/EnterpriseCtaBand.tsx` | Static CTA band for page bottoms |

### Cards

| Component | File | Description |
|-----------|------|-------------|
| `AgentCard` | `src/components/AgentCard.tsx` | Agent card with status badge, rating, verified indicator |
| `MCPCard` | `src/components/MCPCard.tsx` | MCP server card with category, auth method, hosting |
| `PremiumMediaCard` | `src/components/PremiumMediaCard.tsx` | Rich media card with image, kicker, title |
| `SkeletonCard` | `src/components/SkeletonCard.tsx` | Shimmer loading skeleton for grids |

### Content

| Component | File | Description |
|-----------|------|-------------|
| `SectionHeader` | `src/components/SectionHeader.tsx` | Section title with kicker, configurable heading level |
| `RichText` | `src/components/RichText.tsx` | CMS rich text renderer |
| `MediaPanel` | `src/components/MediaPanel.tsx` | Image panel with aspect ratio options |
| `TableOfContents` | `src/components/TableOfContents.tsx` | Sticky sidebar TOC |
| `ComparisonTable` | `src/components/ComparisonTable.tsx` | Feature comparison table |
| `TestimonialBlock` | `src/components/TestimonialBlock.tsx` | Quote card with attribution |

### Forms & Inputs

| Component | File | Description |
|-----------|------|-------------|
| `DemoRequestForm` | `src/components/DemoRequestForm.tsx` | Lead gen form with `.input-premium` |
| `DemoRequestWizardModal` | `src/components/DemoRequestWizardModal.tsx` | Multi-step demo wizard |
| `NewsletterSignup` | `src/components/NewsletterSignup.tsx` | Email capture (compact + full) |
| `CatalogSearchBox` | `src/components/CatalogSearchBox.tsx` | Search input with icon |
| `CookieConsentBanner` | `src/components/CookieConsentBanner.tsx` | Cookie consent with preferences |

### Media & Audio

| Component | File | Description |
|-----------|------|-------------|
| `PodcastPlayer` | `src/components/PodcastPlayer.tsx` | Podcast player with progress bar |
| `AudioPlayerUI` | `src/components/AudioPlayerUI.tsx` | Audio controls (play, scrub, volume) |
| `TranscriptTimeline` | `src/components/TranscriptTimeline.tsx` | Transcript with timestamp nav |

### Data Display

| Component | File | Description |
|-----------|------|-------------|
| `StatePanel` | `src/components/StatePanel.tsx` | Loading, empty, error states |
| `MetricCounter` | `src/components/MetricCounter.tsx` | Animated number counter |
| `TrustBadge` | `src/components/TrustBadge.tsx` | Trust/verification badge |
| `LogoGrid` | `src/components/LogoGrid.tsx` | Logo strip with grayscale |

---

## State Matrix

| State | Treatment |
|-------|-----------|
| Default | Token colors, 1px border `--stroke` |
| Hover | Border → `--pivot-fill` at 20% opacity, scale(1.02) on cards |
| Focus | 3px indigo ring via `.focus-ring:focus-visible` |
| Active | Slightly darker bg, no scale |
| Disabled | 50% opacity, `cursor-not-allowed` |
| Loading | Skeleton shimmer or spinner |
| Error | `--failure-fill` border, `role="alert"` |
| Empty | StatePanel with illustration and CTA |

### Dark Mode

All components use CSS custom properties that switch between `:root` and `.dark` tokens. No manual dark mode overrides needed.
