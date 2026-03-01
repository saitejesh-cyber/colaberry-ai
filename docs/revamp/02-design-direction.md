# Design Direction: Obsidian Signal

## Rationale

Enterprise AI decision-makers need trust, clarity, and sophistication. The previous "Midnight Coral" palette used red/coral as a primary accent, which reads aggressive and startup-like. "Obsidian Signal" uses deep, confident surfaces with an indigo/violet accent that conveys intelligence and innovation, paired with jade/teal for success signals. This palette is proven across Linear, Raycast, and Vercel to project premium engineering quality.

## Color System

| Role | Light Mode | Dark Mode | Token |
|------|-----------|-----------|-------|
| Primary (Indigo) | #4F46E5 | #818CF8 | --pivot-fill |
| Primary Surface | #EEF2FF | #1E1B4B | --pivot-surface |
| Accent (Jade) | #0D9488 | #2DD4BF | --trusted-fill |
| Accent Surface | #F0FDFA | #042F2E | --trusted-surface |
| Error (Rose) | #E11D48 | #FB7185 | --failure-fill |
| Ink/Text | #0F172A | #F8FAFC | --neutral-text |
| Surface | #FAFBFC | #0F172A | --bg |
| Muted | #64748B | #94A3B8 | --text-muted |
| Stroke | #E2E8F0 | #334155 | --stroke |
| Warm Gold | #D97706 | #FBBF24 | --trust-amber |

## Typography

- Headlines + Body: Inter (variable) — single font family for clean modern feel
- Code/Data: JetBrains Mono — technical credibility for metrics and data

## Motion Language

- Ease: cubic-bezier(0.22, 1, 0.36, 1) — spring-like, snappy
- Entry: 300ms fade + 12px translate
- Hover: 150ms scale(1.02) on cards, translateY(-1px) on buttons
- All animations respect prefers-reduced-motion

## Elevation & Depth

- Cards: 1px border + subtle shadow
- Hover: border color shifts to --pivot-fill at 20% opacity
- Surfaces: frosted glass with backdrop-blur(12px)
- Dark mode: inner glow technique

## Shape

- Cards: 12px (rounded-xl)
- Buttons: 8px (rounded-lg)
- Inputs: 8px (rounded-lg)
- Chips/badges: 6px (rounded-md)

## Spacing

- Section gaps: 64px (sm) / 96px (md) / 128px (lg)
- Card grid gaps: 16px (mobile) / 20px (desktop)
- Inner card padding: 20px (mobile) / 24px (desktop)
