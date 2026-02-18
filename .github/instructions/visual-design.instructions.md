---
applyTo: "**/*.css,**/*.svelte"
---

# Visual Design System — Feed Tracker

This project uses a **Dried Flowers** palette with a strict three-tier token system.
All colour, spacing, and decoration decisions are encoded here.
**Never use hardcoded Tailwind colour classes in components** (e.g. `text-violet-600`, `bg-rose-50`, `text-gray-400`).
Always use the semantic tokens below instead.

---

## Token Reference

### Colour — Semantic (swap automatically in dark mode)

Use these for all UI surface and text colours.

| Token | Light value | Dark value | Use for |
|-------|------------|------------|---------|
| `bg-surface` | `#faf8f3` warm cream | `#170d08` | Page background |
| `bg-surface-raised` | `#ffffff` | `#261d18` | Cards, inputs, modal bg |
| `bg-surface-tint` | `#e4d9cc` | `#3d3029` | Unselected chips, disabled buttons, hover on cards |
| `border-edge` | `#e4d9cc` | `#3d3029` | All borders and dividers |
| `text-ink` | `#170d08` | `#faf8f3` | Primary body text, headings |
| `text-ink-subtle` | `#7a6457` | `#a08070` | Labels, secondary text, section headings |
| `text-ink-placeholder` | `#a08070` | `#5c4b40` | Input placeholders, disabled text |
| `bg-brand-subtle` | `#e8f0e9` | `#2e4531` | Selected chip / toggle background tint |
| `bg-success-subtle` | `#edf4ee` | `#1a3320` | Success state backgrounds |
| `bg-error-subtle` | `#f9ece9` | `#3d1a14` | Error state backgrounds |

### Colour — Brand (static, do not change between light/dark)

| Token | Value | Use for |
|-------|-------|---------|
| `bg-brand` / `text-brand` / `border-brand` / `ring-brand` | `#4d6e52` Dried Sage | Primary CTAs, active states, links, focus rings |
| `bg-brand-hover` | `#3d5a41` | Hover state on brand elements |
| `bg-brand-active` | `#2e4531` | Pressed state; also the UserToggle container background |
| `bg-signal` / `text-signal` / `bg-signal-hover` | `#9b5e6e` / `#7d4a58` Dried Rose | **Timer-running state only.** This is the only permitted second hue. |
| `text-success` | `#3d6b45` | Success confirmation text |
| `text-error` / `bg-error` | `#a0402e` | Error text and retry button |

### Neutral scale (static — only use for illustrative/decorative elements)

`neutral-50` through `neutral-900` are available as `bg-neutral-*` / `text-neutral-*`.
They do **not** automatically swap in dark mode. Only use them for:
- Illustrative icons (e.g. the poop/pee circles in ScaleSelector — intentional exceptions)
- `accent-brand` on range inputs

---

## Rules

### Colour
1. **Maximum 2 chromatic hues in active use:** Dried Sage (brand) + Dried Rose (signal). No others.
2. **No raw Tailwind colour classes in components:** `text-violet-*`, `bg-rose-*`, `text-gray-*`, `bg-sky-*`, `bg-amber-*`, `text-green-*`, `text-red-*` are all banned. Use semantic tokens.
3. **Exception:** The poop circle (`bg-neutral-600`) and pee circle (`bg-yellow-300`) in `ScaleSelector.svelte` are intentional illustrative exceptions — they represent physical things, not UI chrome.
4. **Focus rings:** Always `focus:ring-2 focus:ring-brand/25` and `focus:border-brand`. Never `focus:ring-violet-200`.
5. **Dark mode is automatic** via `prefers-color-scheme`. Never add `dark:` variant classes manually — fix the semantic token instead if something looks wrong in dark mode.

### Spacing
6. All spacing must be on the **8px base grid** — multiples of 4 or 8. Never use `gap-1.5`, `p-1.5`, `mt-1.5`, etc.

### Typography
7. No font-size values outside the Tailwind default scale (`text-xs` through `text-5xl`).
8. No font-weight values outside `font-normal`, `font-medium`, `font-semibold`, `font-bold`.

### Buttons
9. **Primary CTA:** `bg-brand text-white hover:bg-brand-hover active:bg-brand-active rounded-2xl`
10. **Disabled CTA:** `bg-surface-tint text-ink-placeholder cursor-not-allowed`
11. **Secondary / ghost:** `bg-surface-raised border border-edge text-ink hover:bg-surface-tint`
12. **Destructive (error retry):** `bg-error text-white hover:opacity-90`
13. **Timer Start:** `bg-signal text-white hover:bg-signal-hover` — the only place `signal` colour appears

### Cards (home screen)
14. All three home-screen navigation cards must be visually identical — differentiation is via emoji only. Use: `bg-surface-raised border border-edge rounded-2xl shadow-sm hover:bg-surface-tint`

### To change the palette
Edit **only** the CSS variable values in `src/app.css` — the `:root` block for light mode and the `@media (prefers-color-scheme: dark)` block for dark mode. No component files need to change.
