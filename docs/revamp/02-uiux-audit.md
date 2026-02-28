# Phase 2: UI/UX Audit

## Audit Methodology
Every page and component audited against: Typography, Spacing, Dark Mode, Accessibility, States, Forms, SEO.
Severity: P0=Critical, P1=High, P2=Medium, P3=Low.

---

## Cross-Cutting Issues (affect multiple pages)

### CC-1: Form inputs not using `.input-premium` (P1)
**Affected**: agents.tsx, mcp.tsx, skills.tsx, use-cases/index.tsx (all catalog filter inputs)
**Current**: Hardcoded `rounded-lg border border-slate-200/80 bg-white px-4 py-2 ...` repeated inline
**Fix**: Replace with `.input-premium` class (already defined in globals.css, used in 5 other places)

### CC-2: Arbitrary `text-[10px]` font size (P2)
**Affected**: index.tsx (2x), PremiumMediaCard.tsx, DemoRequestWizardModal.tsx, podcasts/index.tsx
**Current**: `text-[10px]` — banned by design system rules
**Fix**: Use `text-label` (11px) — closest design token

### CC-3: Hardcoded hex colors where CSS variables exist (P1)
**Affected**: 20+ files use `text-[#DC2626]`, `dark:text-[#F87171]`, `dark:border-[#374151]`
**Fix**: Use `text-[var(--pivot-fill)]`, `dark:text-[var(--brand-purple-light)]`, `dark:border-[var(--stroke)]`

### CC-4: Duplicated utility functions (P2)
**Affected**: agents.tsx, mcp.tsx, skills.tsx each define their own `formatShortDate`, `clipText`, `BackToTop`, `Stat`, `SignalRail`, sorting/filtering functions
**Fix**: Extract shared functions to `src/lib/catalogFormatters.ts` (already exists) and shared components

### CC-5: Missing loading skeletons on catalog pages (P2)
**Affected**: All catalog index pages and detail pages use SSG so initial load is fast, but no skeleton during client-side filter/search transitions
**Fix**: Add SkeletonCard grid as fallback during filter transitions

### CC-6: Dark mode cards missing `dark:bg-*` (P1)
**Affected**: books.tsx, white-papers.tsx, case-studies.tsx, industries/index.tsx — cards use `bg-white/90` without `dark:` variant
**Fix**: Add `dark:bg-slate-800/90` or `dark:bg-[var(--surface-card)]`

### CC-7: Inconsistent spacing between `p-5` and `p-6` in `.surface-panel` (P2)
**Affected**: All catalog pages — some sections use `p-5`, others `p-6`
**Fix**: Standardize to `p-6` on all `.surface-panel` sections (design system specifies p-6 for sections)

---

## Page-Level Findings

### Homepage (index.tsx)
| # | Sev | Category | Finding | Fix |
|---|-----|----------|---------|-----|
| 1 | P2 | Typography | `text-[10px]` used for source badges (line 668, 741) | Use `text-label` |
| 2 | P2 | Dark mode | Hardcoded hex in badge backgrounds | Use CSS variables |
| 3 | P3 | Spacing | Signal grid section gaps vary | Standardize to `gap-6` |

### AIXcelerator Hub (aixcelerator/index.tsx)
| # | Sev | Category | Finding | Fix |
|---|-----|----------|---------|-----|
| 1 | P2 | Dark mode | `bg-slate-100` badge without dark: variant (line 98) | Add `dark:bg-slate-800` |
| 2 | P3 | Spacing | Use case cards use `surface-panel surface-hover` but missing proper dark border | Add dark border token |
| 3 | P2 | Components | `btn btn-cta` class used (line 127) but not defined in globals.css | Define or use `btn btn-primary` |

### Agents Catalog (agents.tsx)
| # | Sev | Category | Finding | Fix |
|---|-----|----------|---------|-----|
| 1 | P1 | Forms | All 5 filter inputs use inline Tailwind instead of `.input-premium` | Apply `.input-premium` |
| 2 | P2 | Spacing | Filter section uses p-5, should be p-6 | Standardize |
| 3 | P3 | A11y | Sort button aria-pressed is correct — no issue | — |

### MCP Catalog (mcp.tsx)
| # | Sev | Category | Finding | Fix |
|---|-----|----------|---------|-----|
| 1 | P1 | Forms | Same inline filter inputs (5 inputs) | Apply `.input-premium` |
| 2 | P2 | Spacing | Mix of p-5 and p-6 across sections | Standardize to p-6 |

### Skills Catalog (skills.tsx)
| # | Sev | Category | Finding | Fix |
|---|-----|----------|---------|-----|
| 1 | P1 | Forms | Same inline filter inputs | Apply `.input-premium` |
| 2 | P1 | Dark mode | `hover:text-[#DC2626]` without dark variant | Use design token |

### Agent Detail (agents/[slug].tsx)
| # | Sev | Category | Finding | Fix |
|---|-----|----------|---------|-----|
| 1 | P1 | Dark mode | `hover:text-[#DC2626]` without dark variant | Use CSS variable |
| 2 | P2 | Spacing | Gap-4 should be gap-6 in detail grid | Standardize |
| 3 | P2 | States | No loading skeleton during initial fetch | Add skeleton |

### MCP Detail (mcp/[slug].tsx)
| # | Sev | Category | Finding | Fix |
|---|-----|----------|---------|-----|
| 1 | P1 | Dark mode | Hardcoded `bg-[#059669]` list bullets | Use `bg-[var(--trusted-fill)]` |
| 2 | P2 | Spacing | Inconsistent gap-4 vs gap-6 | Standardize |

### Skill Detail (skills/[slug].tsx)
| # | Sev | Category | Finding | Fix |
|---|-----|----------|---------|-----|
| 1 | P1 | Dark mode | `.prose` text uses hardcoded slate | Use design tokens |
| 2 | P2 | A11y | MetadataRow uses `<div>` instead of `<dl>/<dt>/<dd>` | Use semantic HTML |

### Use Cases Index (use-cases/index.tsx)
| # | Sev | Category | Finding | Fix |
|---|-----|----------|---------|-----|
| 1 | P1 | Forms | Filter inputs missing `.input-premium` | Apply class |
| 2 | P1 | Dark mode | All inputs hardcoded dark colors | Use design tokens |
| 3 | P2 | A11y | Card titles not in heading elements | Use `<h3>` |

### Use Case Detail (use-cases/[slug].tsx)
| # | Sev | Category | Finding | Fix |
|---|-----|----------|---------|-----|
| 1 | P1 | Dark mode | Link hardcoded `text-[#DC2626]` | Use CSS variable |
| 2 | P2 | A11y | `detail-section` class not semantic | Use `<dl>` pattern |

### Industries Index (industries/index.tsx)
| # | Sev | Category | Finding | Fix |
|---|-----|----------|---------|-----|
| 1 | P1 | Dark mode | Hardcoded `dark:border-[#374151] dark:bg-[#1F2937]/90` | Use tokens |
| 2 | P2 | A11y | Badge uses `<div>` not semantic tag | Fix |

### Industry Detail (industries/[industry].tsx)
| # | Sev | Category | Finding | Fix |
|---|-----|----------|---------|-----|
| 1 | P1 | Dark mode | Multiple hardcoded dark mode colors | Use CSS variables |
| 2 | P2 | States | No loading/error states for dynamic data | Add StatePanel |

### Solutions (solutions/index.tsx)
| # | Sev | Category | Finding | Fix |
|---|-----|----------|---------|-----|
| 1 | P1 | Dark mode | Caption text lacks dark variant | Add `dark:text-slate-100` |
| 2 | P2 | A11y | Cards lack heading hierarchy (h3) | Fix |

### Updates (updates/index.tsx)
| # | Sev | Category | Finding | Fix |
|---|-----|----------|---------|-----|
| 1 | P1 | Dark mode | Category filter buttons hardcoded colors | Use design tokens |
| 2 | P1 | Dark mode | Link colors hardcoded | Use CSS variables |

### Resources Hub (resources/index.tsx)
| # | Sev | Category | Finding | Fix |
|---|-----|----------|---------|-----|
| 1 | P2 | Dark mode | Chip `bg-white` without dark variant (line 169) | Add `dark:bg-slate-800` |

### Articles Index (resources/articles/index.tsx)
| # | Sev | Category | Finding | Fix |
|---|-----|----------|---------|-----|
| 1 | P2 | Dark mode | Chip `bg-white` without dark variant | Add dark variant |

### Article Detail (resources/articles/[slug].tsx)
| # | Sev | Category | Finding | Fix |
|---|-----|----------|---------|-----|
| 1 | P1 | A11y | `dangerouslySetInnerHTML` content heading hierarchy unvalidated | Document risk |

### Podcasts Index (resources/podcasts/index.tsx)
| # | Sev | Category | Finding | Fix |
|---|-----|----------|---------|-----|
| 1 | P2 | Typography | `text-[10px]` for duration badge | Use `text-label` |
| 2 | P1 | Typography | Hardcoded hex `text-[#DC2626]` for "Listen now" | Use CSS variable |
| 3 | P2 | Forms | `focus:ring-brand-blue/25` — brand-blue doesn't exist | Use `focus:ring-[var(--stroke-focus)]` |

### Podcast Detail (resources/podcasts/[slug].tsx)
| # | Sev | Category | Finding | Fix |
|---|-----|----------|---------|-----|
| 1 | P1 | A11y | Tab buttons lack `role="tab"`, `aria-selected` | Add ARIA tab pattern |
| 2 | P2 | Dark mode | `bg-brand-purple-600` not verified in config | Verify or use CSS var |

### Books (resources/books.tsx)
| # | Sev | Category | Finding | Fix |
|---|-----|----------|---------|-----|
| 1 | P1 | Dark mode | `bg-white/90` cards without `dark:` variant | Add `dark:bg-slate-800/90` |
| 2 | P2 | A11y | Book titles in `<div>` not `<h3>` | Use semantic heading |

### White Papers (resources/white-papers.tsx)
| # | Sev | Category | Finding | Fix |
|---|-----|----------|---------|-----|
| 1 | P1 | Dark mode | Same `bg-white/90` issue | Add dark variant |
| 2 | P2 | A11y | Titles in `<div>` not `<h3>` | Use semantic heading |

### Case Studies (resources/case-studies.tsx)
| # | Sev | Category | Finding | Fix |
|---|-----|----------|---------|-----|
| 1 | P1 | Dark mode | Filter chips hardcoded dark colors | Use design tokens |
| 2 | P0 | SEO | JSON-LD renders even when CMS data empty | Guard with condition |

### Request Demo (request-demo.tsx)
| # | Sev | Category | Finding | Fix |
|---|-----|----------|---------|-----|
| 1 | P2 | Dark mode | Kicker hex `text-[#F87171]` | Use CSS variable |
| 2 | P1 | A11y | SVG checkmark icon missing accessible label | Add `aria-label` |

### Assistant (assistant.tsx)
| # | Sev | Category | Finding | Fix |
|---|-----|----------|---------|-----|
| 1 | P1 | SEO | Empty catch block in getStaticProps | Add error logging |

### Search (search.tsx)
| # | Sev | Category | Finding | Fix |
|---|-----|----------|---------|-----|
| 1 | P1 | A11y | aria-label mismatches placeholder text | Align |
| 2 | P0 | States | StatePanel properly implemented | No fix needed (positive) |

### Cookie Policy (cookie-policy.tsx)
| # | Sev | Category | Finding | Fix |
|---|-----|----------|---------|-----|
| 1 | P3 | A11y | Sections lack heading structure | Add semantic headings |

### Privacy Policy (privacy-policy.tsx)
| # | Sev | Category | Finding | Fix |
|---|-----|----------|---------|-----|
| 1 | P1 | A11y | Email link lacks `aria-label` | Add label |
| 2 | P3 | A11y | Sections lack heading structure | Add semantic headings |

### Unsubscribe (unsubscribe.tsx)
| # | Sev | Category | Finding | Fix |
|---|-----|----------|---------|-----|
| 1 | P2 | A11y | No aria-busy during loading state | Add attribute |

### Newsletter Report (internal/newsletter-report.tsx)
| # | Sev | Category | Finding | Fix |
|---|-----|----------|---------|-----|
| 1 | P1 | Forms | Inputs not using `.input-premium` | Apply class |
| 2 | P1 | A11y | Table lacks `<caption>` or aria-label | Add |

### Catalog Health (internal/catalog-health.tsx)
| # | Sev | Category | Finding | Fix |
|---|-----|----------|---------|-----|
| 1 | P2 | Forms | Uses `.input` instead of `.input-premium` | Fix |
| 2 | P1 | A11y | Checkbox missing aria-label | Add |

### DemoRequestForm Component
| # | Sev | Category | Finding | Fix |
|---|-----|----------|---------|-----|
| 1 | P1 | A11y | Missing sr-only "(required)" text on required fields | Add |
| 2 | P2 | Forms | Error variant duplicates all input properties | Create `.input-premium--error` |

### DemoRequestWizardModal Component
| # | Sev | Category | Finding | Fix |
|---|-----|----------|---------|-----|
| 1 | P1 | A11y | Missing `aria-describedby` on modal | Add |
| 2 | P1 | A11y | Missing focus restoration on modal close | Implement |
| 3 | P2 | Forms | Inputs not using `.input-premium` | Apply |

### CookieConsentBanner Component
| # | Sev | Category | Finding | Fix |
|---|-----|----------|---------|-----|
| 1 | P2 | A11y | Checkboxes lack aria-label | Add |
| 2 | P2 | Dark mode | Hardcoded hex in dark borders | Use CSS vars |

### RichText Component
| # | Sev | Category | Finding | Fix |
|---|-----|----------|---------|-----|
| 1 | P1 | A11y | Image alt text can be empty string | Default to descriptive text |
| 2 | P2 | Dark mode | Blockquote text color may lack dark variant | Verify |

### CatalogSearchBox Component
| # | Sev | Category | Finding | Fix |
|---|-----|----------|---------|-----|
| 1 | P1 | Forms | Custom focus classes instead of `.input-premium` | Apply |
| 2 | P1 | A11y | Form lacks `role="search"` | Add |

### _document.tsx
| # | Sev | Category | Finding | Fix |
|---|-----|----------|---------|-----|
| 1 | P2 | SEO | Redundant Google Fonts preload for self-hosted fonts | Remove |

---

## Summary

| Severity | Count | Top Categories |
|----------|-------|---------------|
| P0 | 1 | SEO (JSON-LD guard) |
| P1 | ~30 | Dark mode hardcoding, form tokens, accessibility labels |
| P2 | ~35 | Spacing consistency, typography tokens, minor dark mode |
| P3 | ~15 | Polish items, section headings, chip semantics |

### Top 5 Fixes by Impact
1. **Apply `.input-premium` to all catalog filter inputs** — 5 pages, ~25 inputs (P1)
2. **Replace hardcoded hex colors with CSS variables** — 20+ files (P1)
3. **Add `dark:bg-*` to white cards** — books, white-papers, case-studies, industries (P1)
4. **Add ARIA labels to forms, modals, tables** — 10+ components (P1)
5. **Standardize `p-6` padding on `.surface-panel`** — all catalog pages (P2)
