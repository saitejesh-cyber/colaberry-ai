# Phase 7: Fork Alignment Report

## Frontend: `colaberry-ai` vs `cairl-modern-client`

### Finding: These are completely separate codebases — not a fork

| Aspect | `colaberry-ai` (Main) | `cairl-modern-client` |
|---|---|---|
| Framework | Next.js 16 (SSR/SSG) | Vite + React (SPA/CSR) |
| Router | Next.js file-based routing | React Router v6 |
| Design system | Custom "Midnight Coral" CSS tokens + Tailwind v4 | shadcn/ui (Radix primitives) |
| Components | 28 custom components | 60+ shadcn-based components |
| Pages | 30+ pages (enterprise platform) | 21 pages (original CAiRL site) |
| CMS integration | Strapi v5 with typed fetching | None (static / EmailJS) |
| Shared code | Zero | Zero |

### Verdict
No alignment needed between these two projects. `cairl-modern-client` is the legacy CAiRL Center website (an SPA with shadcn/ui). `colaberry-ai` is the current enterprise platform built from scratch. They share no components, no design tokens, no page structure, and no data layer.

### Recommendation
- The `cairl-modern-client` repo can be archived or treated as a reference for the original CAiRL design intent
- All active development should continue on `colaberry-ai`

---

## CMS: `colaberry-ai-cms` vs `colaberry-ai-cms-fork`

### Finding: Genuine diverged forks that need reconciliation

Both repos share a common ancestor at commit `7883012` ("Create a Skill content type") and have diverged since.

### Commit Differences

**Main-only commits (import pipeline):**
```
06ef7e7  feat(cms): add unified catalog import jobs and skill import pipeline
24159fe  skills insert changes
24af0ab  Scripts fetch fix
5371c35  clawhub.ai skills
```

**Fork-only commits (transcript + skills fixes):**
```
4bc2a38  Podcast transcript script update even if transcriptStatus field is null
3acf535  Skills fetch issue fix
bcd2419  clawhub.ai skills
```

### Fork Uncommitted Changes (167 lines)

The CMS fork has extensive **uncommitted schema modifications** that the main does not have:

| Schema | Change Type | Fields Added |
|---|---|---|
| `agent/schema.json` | +22 lines | New fields for agent capabilities |
| `article/schema.json` | +17 lines | Extended article metadata |
| `category/schema.json` | +12 lines | Category extensions |
| `company/schema.json` | +24 lines | Company profile fields |
| `mcp-server/schema.json` | +17 lines | MCP server extensions |
| `podcast-episode/schema.json` | +5 lines | Podcast metadata additions |
| `skill/schema.json` | +20/-5 lines | Skill schema updates |
| `tag/schema.json` | +24 lines | Tag extensions |
| `use-case/schema.json` | +17/-2 lines | Use-case field additions |

### Fork-Only Content Types (not committed)

The fork has 4 new content types as untracked files:
1. `src/api/book/` — Book content type
2. `src/api/case-study/` — Case Study content type
3. `src/api/import-job/` — Import Job content type
4. `src/api/skill-import/` — Skill Import content type

**Note:** The main CMS repo already has `book`, `case-study`, `import-job`, and `skill-import` as committed content types. This means the main is ahead of the fork for these types.

### Reconciliation Actions Required

| Action | Priority | Detail |
|---|---|---|
| Merge fork transcript fix into main | P1 | `4bc2a38` — handles null transcriptStatus |
| Review fork schema additions | P2 | 167 lines of uncommitted changes — review which fields the frontend actually needs |
| No fork → main merge for content types | — | Main already has book, case-study, import-job, skill-import |
| Archive fork after reconciliation | P3 | Consolidate to single CMS repo |

### CMS Contract Impact on Frontend

The Phase 5 CMS Contract Report confirmed:
- The frontend `colaberry-ai` works correctly with the **main** CMS schemas
- PodcastEpisode has 5 dead frontend fields (`transcript`, `chapters`, `showNotes`, `guests`, `recordingDate`) — these don't exist in either CMS repo
- WhitePaper has no committed CMS schema in either repo
- All other content types are compatible

---

## Summary

| Repo Pair | Relationship | Alignment Needed |
|---|---|---|
| `colaberry-ai` ↔ `cairl-modern-client` | Separate codebases | None — different apps |
| `colaberry-ai-cms` ↔ `colaberry-ai-cms-fork` | Diverged forks | Merge transcript fix; review schema additions; consolidate |
