# Phase 3: Design Strategy

## Direction: Refine & Polish Midnight Coral

No new design direction. Focus is on enforcing existing design system consistently.

## Token Updates Needed

### CSS Custom Properties to Add (globals.css)
None — existing token set is comprehensive. Issue is adoption, not gaps.

### Classes to Enforce
- `.input-premium` — must be used on ALL form inputs (search, select, text, textarea)
- `.surface-panel` with `p-6` — standardize padding
- CSS variable colors (`var(--pivot-fill)`, `var(--stroke)`, etc.) — replace all hardcoded hex

## Implementation Priorities

### Priority 1: Dark Mode Consistency
Replace all hardcoded hex in dark: variants with CSS variable references.
- `dark:border-[#374151]` → `dark:border-[var(--stroke)]`
- `dark:bg-[#1F2937]` → `dark:bg-[var(--surface-strong)]`
- `dark:text-[#F87171]` → `dark:text-[var(--brand-purple-light)]`
- `bg-white/90` → `bg-white/90 dark:bg-[var(--surface-card)]/90`

### Priority 2: Form Input Standardization
Apply `.input-premium` to all search inputs, select elements, and text inputs on catalog pages.

### Priority 3: Accessibility Quick Wins
- Add `role="search"` to CatalogSearchBox form
- Add `aria-label` to tables, checkboxes, modals
- Add ARIA tab pattern to podcast detail tabs
- Use `<h3>` for card titles in books, white-papers, case-studies

### Priority 4: Typography Scale Enforcement
Replace `text-[10px]` with `text-label` in 5 files.

### Priority 5: Spacing Normalization
Standardize `.surface-panel` padding to `p-6` across all catalog pages.
