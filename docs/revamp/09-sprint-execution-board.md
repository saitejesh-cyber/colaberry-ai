# Premium Revamp Sprint Execution Board

## Scope
- Frontend: `/Users/colaberry016gmail.com/Desktop/Projects/colaberry-ai`
- CMS: `/Users/colaberry016gmail.com/Desktop/Projects/colaberry-ai-cms`
- Excluded: all fork repos

## Program Targets
- Premium enterprise visual quality across all key routes.
- Strong conversion UX for demo/contact funnels.
- WCAG 2.2 AA for key user journeys.
- Better discoverability and LLM indexability (semantic structure + schema + internal linking).
- No critical regressions to business logic or CMS data contracts.

## Team Topology
- UI/UX Studio: `3 UI/UX Designers` + `2 Business Analysts`
- FE Platform Squad: `1 FE Architect` + `1 Senior FE` + `2 FE Developers`
- FE Catalog Squad: `1 FE Architect` + `1 Senior FE` + `2 FE Developers`
- FE Experience Squad: `1 Senior FE` + `3 FE Developers`
- BE Core Squad: `1 BE Architect` + `1 Senior BE` + `3 BE Developers`
- BE Data/Integration Squad: `1 BE Architect` + `2 Senior BE` + `4 BE Developers`
- QA Guild: `4 Senior QA`
- Delivery: `1 Scrum Master` + `1 Delivery Manager`

## Ownership Model
- FE Architects: architecture decisions, cross-squad standards, merge gates.
- Senior FE: implementation review, component contracts, performance guardrails.
- UI/UX: Figma system, interaction specs, design QA signoff.
- BE Architects/Senior BE: schema evolution, API compatibility, indexing/telemetry.
- QA: test strategy, regression matrix, accessibility validation, release signoff.
- BA: requirements traceability, acceptance criteria, stakeholder feedback loop.
- Scrum Master: sprint planning, daily unblock, retro actions.
- Delivery Manager: risk register, dependency control, executive reporting.

## Sprint Cadence
- Sprint length: `2 weeks`
- Ceremonies:
- Planning: Day 1
- Daily standup: 15 min
- Mid-sprint checkpoint: Day 5/6
- Demo: Day 10
- Retro + next sprint prep: Day 10

## Sprint Plan

### Sprint 0: Inception And Baseline
- Duration: Week 1
- Primary owners: FE/BE Architects, UI/UX Lead, QA Lead, BAs
- Outputs:
- Route inventory, component inventory, CMS contract inventory.
- Baseline metrics: Lighthouse, accessibility, bundle profile, conversion baselines.
- Competitor pattern matrix from Moveworks, Pipedream, Sana, Arize, ZBrain.
- Acceptance criteria:
- Full inventory complete and approved.
- Top 20 UX and technical debt items prioritized by severity.

### Sprint 1: IA And Design System Blueprint
- Duration: Weeks 2-3
- Primary owners: UI/UX Studio + FE Platform Squad + BAs
- Outputs:
- New IA and navigation map.
- Figma design system v1 (tokens, typography, spacing, components, states).
- Page template set: homepage, catalog listing, detail page, solution page, conversion page.
- Acceptance criteria:
- Figma v1 signed off by FE Architects and BA.
- All design tokens mapped to code implementation plan.

### Sprint 2: Foundation Build
- Duration: Weeks 4-5
- Primary owners: FE Platform Squad + FE Architects + QA
- Outputs:
- Global shell rebuild: header, nav, footer, grid/container, section rhythm.
- Shared UI primitives implemented in code.
- Theming, motion, and state behavior standardized.
- Acceptance criteria:
- New shell and primitives used by at least 5 top routes.
- No visual drift between desktop and mobile at key breakpoints.

### Sprint 3: Core Discovery Experience
- Duration: Weeks 6-7
- Primary owners: FE Catalog Squad + BE Core Squad + QA
- Outputs:
- Rebuild discovery flows: catalog/search/listing/detail surfaces.
- Podcast listing and detail premiumization.
- Facet/filter/search usability improvement.
- Acceptance criteria:
- Discovery flows pass UX review and a11y checks.
- Podcast flows meet new premium pattern and interaction consistency.

### Sprint 4: Conversion And Enterprise Proof Surfaces
- Duration: Weeks 8-9
- Primary owners: FE Experience Squad + UI/UX + BE Data/Integration + QA
- Outputs:
- Rework solution/use-case/industry/resources pages.
- Conversion funnel hardening (`request-demo`, CTA hierarchy, proof sections).
- Trust and proof surfaces: schema, credibility blocks, entity-driven linking.
- Acceptance criteria:
- Demo funnel metrics instrumented.
- Key decision pages show clear enterprise narrative and CTA path.

### Sprint 5: CMS Contract Hardening And Quality Gate
- Duration: Weeks 10-11
- Primary owners: BE Squads + FE Architects + QA Guild
- Outputs:
- CMS/API compatibility fixes.
- Structured data and metadata hardening for indexability.
- Regression automation for critical journeys.
- Acceptance criteria:
- Zero high-severity contract regressions.
- QA signoff for top user journeys and API-backed pages.

### Sprint 6: Launch Readiness
- Duration: Week 12
- Primary owners: All streams + Delivery Manager
- Outputs:
- UAT fixes, final visual polish, performance tuning.
- Release checklist, rollback strategy, post-launch monitoring plan.
- Executive handoff package.
- Acceptance criteria:
- Release checklist 100% complete.
- Critical/High defects closed or explicitly accepted by stakeholders.

## Cross-Sprint Quality Gates
- Design gate: no unapproved one-off components.
- FE gate: typed, reusable, lint-clean touched modules.
- BE gate: API/schema contract tests pass.
- QA gate: regression, accessibility, and responsive checks pass.
- Performance gate: no budget regressions on priority routes.
- SEO/LLM gate: semantic hierarchy, schema, canonical/sitemap/robots/llms validation.

## Definition Of Done
- Premium enterprise UI/UX across key routes.
- Unified design system and component architecture in production code.
- CMS compatibility maintained.
- Accessibility and performance measurably improved.
- Executive handoff completed with risks and next-step roadmap.

## Live Progress (2026-02-28)
- Completed:
- Request-demo premium conversion pass (`request-demo` + `DemoRequestForm`) with clearer executive outcomes, attendee guidance, and stronger intake UX while preserving API payload contract.
- Podcast listing premium pass with source filtering (`all/internal/external`), query-preserving navigation/search controls, and metadata/stat framing.
- Podcast detail premium pass with improved share feedback, transcript tab visual consistency, and episode intelligence sidebar.
- Solutions route premium pass with live-vs-planned track clarity, portfolio signal cards, and industry coverage framing.
- Industries route premium pass with catalog-density readiness signals and stronger vertical storytelling.
- Use-cases route premium pass with richer coverage metrics, top-industry quick filters, and delivery-lane CTA flow.
- Industry detail route (`/industries/[industry]`) rebuilt to the enterprise hero/surface standard with case-study-first narrative.
- Homepage trust/proof pass with executive-proof section linking decision pages into a clearer leadership journey.
- Resources hub premium pass with role-based decision tracks, objective-oriented collections, and stronger discovery-to-action flow.
- Updates hub premium pass with signal command-center framing, category counts, rating-priority snapshots, and action playbooks.
- Books/artifacts premium pass with role-based learning pathways, expanded hero metrics, and conversion-focused CTA banding.
- Podcast listing re-audit pass with editorial queues, trending topic facets, and stronger feed-state cues inspired by premium podcast competitors.
- Podcast detail re-audit pass with key-moment jump navigation (chapter/transcript-derived), richer episode utility, and improved listen-context flow.
- Articles hub revamp with editorial streams, category-intelligence chips, and stronger enterprise CTA framing.
- White papers hub revamp with decision pathways, asset metrics, and conversion-focused handoff sections.
- Case studies hub revamp with outcome categories, coverage metrics, and stronger proof-to-action narrative.
- Podcast company/tag facet revamp with listening strategy sections, related-signal navigation, and premium CTA continuity.
- Legal/trust utility revamp for `privacy-policy`, `cookie-policy`, and `unsubscribe` with premium enterprise consistency and clearer policy/status UX.
- Search experience revamp with shortcut chips, result-intelligence panel, and stronger discovery-to-demo CTA flow.
- Article detail revamp with article-intelligence snapshot, robust share-state UX, and premium next-step CTA continuity.
- Commit-ready packaging delivered with grouped commit plan and release changelog draft (`10-commit-plan.md`, `10-release-changelog.md`).
- Runtime smoke tooling delivered (`scripts/qa-runtime-smoke.sh`, `npm run qa:smoke`) for stable-environment signoff.
- Validation:
- `npm run lint`: clean (0 errors, 0 warnings).
- `npm run build`: passing.
- `npm run audit:data`: blocked (`fetch failed`) due unavailable upstream data source/CMS connectivity during this run.
- Remaining blockers / residual risks:
- Runtime smoke verification is blocked in this environment by Next.js 16 manifest/runtime errors (`pages-manifest.json`, `.next/dev/server/*`) even when compile/build succeeds.
- CMS-backed data-readiness audit remains blocked while upstream/CMS connectivity is unavailable (`fetch failed`).
- Recommended closeout action:
- Re-run runtime route smoke test and `npm run audit:data` in the target deployment/runtime environment with stable CMS access, then attach final screenshots/metrics to executive handoff.
