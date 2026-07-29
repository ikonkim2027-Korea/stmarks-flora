# Tiny Worlds Field Atlas — v2 Renewal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild stmarks-flora into a field guide that (a) looks designed rather than generated, (b) tells the truth about the current date, (c) is genuinely explorable — adjustable survey radius, serendipity, instant search, a personal life list — and (d) grounds its hand-authored claims in real institutional data (GBIF, iNaturalist, Wikipedia, NOAA, USDA).

**Architecture:** Three layers.
1. **Design system** — Tailwind v4 `@theme` tokens replace the inline-style + CSS-var hybrid; a handful of primitives (Chip, StatTile, `.card`/`.glass`/`.btn-*`) carry every page.
2. **Hydration-safe runtime** — anything date-dependent moves into client components fed by `useCurrentMonthWeek()`, so all routes stay statically prerendered while showing the real date.
3. **Build-time enrichment** — `scripts/enrich.mjs` fetches taxonomy, observed phenology, nearby-sighting counts, and encyclopedic text once, and **commits the result to the repo**. The live site never depends on a third-party API being up. Only two runtime fetches exist, both no-key and CORS-enabled: NOAA current conditions and GBIF map tiles.

**Tech Stack:** Next.js 16.2.4 (App Router, SSG), React 19, Tailwind CSS v4, lucide-react, Leaflet, Vitest 4. Fonts: Instrument Sans + Source Serif 4 (next/font/google).

**Repo:** `~/Documents/stmarks-flora` (github.com/ikonkim2027-Korea/stmarks-flora → Vercel auto-deploy at stmarks-flora.vercel.app)

**Phases:** 1 Foundation (Tasks 0–4) · 2 Redesign (5–10) · 3 Radius explorer (10.5) · 4 Chrome & verification of the redesign (11–12) · 5 Data pipeline (14–15) · 6 Discovery features (16–23) · 7 Ship (24). Phases 1–4 are shippable on their own; Phase 5 must land before Phase 6.

---

## Confirmed defects (debugging scope)

| # | Defect | Evidence | Fix task |
|---|--------|----------|----------|
| D1 | **Frozen build-time date.** Live site shows "May W1" on 2026-07-28. `getCurrentMonthWeek()` calls `new Date()` inside statically-prerendered Server Components (`/` is `○ Static` in build output), so "Active survey frame", "Field-ready now", and every "Collectible Now" badge are frozen at deploy time. | [page.tsx:71](../../src/app/page.tsx), [plants/[id]/page.tsx:43](../../src/app/plants/%5Bid%5D/page.tsx), build output, live screenshot | Task 1–2 |
| D2 | **Hydration mismatch risk.** `BrowseContent` (client) calls `getCurrentMonthWeek()` during render; prerendered HTML has the build-time month, client has the real month → React hydration mismatch whenever they differ. | [BrowseContent.tsx:23](../../src/app/plants/BrowseContent.tsx) | Task 2 |
| D3 | **Full-page reload on search.** Navigation submits via `window.location.href` instead of `router.push`. | [Navigation.tsx:25](../../src/components/Navigation.tsx) | Task 5 |
| D4 | **Hardcoded month range 4–11.** PlantCard month dots and CollectionCalendar only render Apr–Nov; any collection window outside that range would be silently invisible. Needs a data-integrity test to pin the invariant. | [PlantCard.tsx:130](../../src/components/PlantCard.tsx), [CollectionCalendar.tsx:13](../../src/components/CollectionCalendar.tsx) | Task 12 |
| D5 | **Service worker: stale cache + no offline images.** Cache constants are already at `-v2`, so redeploying without bumping them leaves existing users on stale HTML. Worse, the fetch handler returns early for any non-same-origin request, so all 65 hotlinked `upload.wikimedia.org` images are **unavailable offline** — the guide is unusable in the field, which is its entire purpose. | public/sw.js:1-3, 41-47 | Task 11 (bump to v3), Task 15 (local images) |
| D6 | **PDF palette disconnected from site palette** (`#2D5016`/`#8B6914` browns — matches neither old nor new design). | [PDFExport.tsx:18-22](../../src/components/PDFExport.tsx) | Task 11 |
| D7 | **`themeColor: #111816` (dark ink)** will clash with the new light design; manifest colors likewise. | [layout.tsx:27](../../src/app/layout.tsx), public/manifest.json | Task 11 |

Tests (3), build, and lint currently all pass — regressions are detectable.

## Design direction (benchmark synthesis)

What makes the current site read as "AI-generated": `font-black` everywhere, uppercase `tracking-[0.2em]` kickers, numbered 01–04 cards, Tailwind default badge rainbow (`green-100`/`pink-100`/`amber-100`…), uniform 8px radius, hard 1px borders on everything, graph-paper background, dark hero + gold accent, emoji habitat icons, inline `style={{}}` var soup.

Renewal language (from the three references):

- **Canvas:** warm sage-tinted off-white `#F0F1EA`; cards pure white; separation via soft shadow + tint, **not** 1px borders. Hairlines only where structure demands (`rgba(23,27,23,0.07)`).
- **Radius:** cards 22px (`rounded-card`), tiles 16px, chips/buttons full pill.
- **Type:** Instrument Sans, weights 400–600 only (no more 700+ walls); display headings `font-semibold tracking-tight`; scientific names in Source Serif 4 *italic* (botanical-editorial signature). Micro-labels: `text-[11px] font-medium text-text-soft` — **no uppercase-tracking kickers**.
- **Color system:** moss `#3D5A44` (primary), sprout `#C9E265` (data/growth accent), sage `#AEC2A4`, clay `#B0603F` (invasive), mist-slate `#64707A` (photo-only), ink `#171B17` (black pill buttons, ref image 3).
- **Patterns:** glass panels (`backdrop-blur` white/70) only over photography; dot-matrix availability grids (ref image 3) replace colored table cells; stat tiles with big numeral + quiet label (ref images 1+3); pill chips everywhere badges existed.
- **Hero:** light, photography-as-card (feathered rounded image right, ref image 1) instead of full-bleed dark overlay.

---

### Task 0: Branch + Next.js 16 docs check

**Files:** none created.

- [ ] **Step 0.1:** `cd ~/Documents/stmarks-flora && git checkout -b redesign/atlas-v2`
- [ ] **Step 0.2:** Per AGENTS.md, skim `node_modules/next/dist/docs/` guides relevant to this plan (app router pages, fonts, client components) before writing code. Confirm `next/font/google` API is unchanged in Next 16.
- [ ] **Step 0.3:** `npm test && npm run build` — record green baseline.

### Task 1: Hydration-safe current-date logic (TDD)

**Files:**
- Create: `src/lib/useCurrentMonthWeek.ts`
- Modify: `src/lib/utils.ts:3-9`
- Test: `src/lib/__tests__/monthWeek.test.ts`

- [ ] **Step 1.1: Write the failing test**

```ts
// src/lib/__tests__/monthWeek.test.ts
import { describe, expect, it } from "vitest";
import { resolveMonthWeek } from "@/lib/useCurrentMonthWeek";

describe("resolveMonthWeek", () => {
  it("maps day-of-month to week 1-4", () => {
    expect(resolveMonthWeek(new Date(2026, 6, 1))).toEqual({ month: 7, week: 1 });
    expect(resolveMonthWeek(new Date(2026, 6, 8))).toEqual({ month: 7, week: 2 });
    expect(resolveMonthWeek(new Date(2026, 6, 28))).toEqual({ month: 7, week: 4 });
    expect(resolveMonthWeek(new Date(2026, 6, 31))).toEqual({ month: 7, week: 4 });
  });
  it("uses 1-indexed months", () => {
    expect(resolveMonthWeek(new Date(2026, 0, 15)).month).toBe(1);
    expect(resolveMonthWeek(new Date(2026, 11, 3)).month).toBe(12);
  });
});
```

- [ ] **Step 1.2:** Run `npm test` → FAIL (module not found).
- [ ] **Step 1.3: Implement hook + pure function**

```ts
// src/lib/useCurrentMonthWeek.ts
"use client";

import { useEffect, useState } from "react";

export interface MonthWeek {
  month: number; // 1-12
  week: number; // 1-4
}

export function resolveMonthWeek(date: Date): MonthWeek {
  return {
    month: date.getMonth() + 1,
    week: Math.min(Math.ceil(date.getDate() / 7), 4),
  };
}

// Returns null on the server and during the first client render, then the
// real value after mount — so static HTML never bakes in a build-time date.
export function useCurrentMonthWeek(): MonthWeek | null {
  const [value, setValue] = useState<MonthWeek | null>(null);
  useEffect(() => {
    setValue(resolveMonthWeek(new Date()));
  }, []);
  return value;
}
```

- [ ] **Step 1.4:** In `src/lib/utils.ts`, replace the body of `getCurrentMonthWeek` with `return resolveMonthWeek(new Date());` (import from `./useCurrentMonthWeek`) and mark its docstring: "server/build-time only — client UI must use useCurrentMonthWeek()". Run `npm test` → PASS (all files).
- [ ] **Step 1.5:** Commit `fix: hydration-safe month/week resolution`.

### Task 2: Wire date-dependent UI to the hook

**Files:**
- Create: `src/components/SurveyFrameCard.tsx`, `src/components/FieldReadySection.tsx`, `src/components/AvailabilityBadge.tsx`
- Modify: `src/app/page.tsx` (hero aside + "Field-ready now" section), `src/app/plants/[id]/page.tsx` (both `isAvailableNow` blocks), `src/app/plants/BrowseContent.tsx:23`

- [ ] **Step 2.1:** Create `SurveyFrameCard.tsx` — `"use client"` component that renders the hero stat panel. It receives `{ speciesCount, nativeCount, invasiveCount, photoOnlyCount }` as props, calls `useCurrentMonthWeek()`, and renders `–` for the month/week cell until the hook resolves. (Styling is finalized in Task 6; initially copy the existing aside JSX from page.tsx:130-157.)
- [ ] **Step 2.2:** Create `FieldReadySection.tsx` — `"use client"`, imports `plants` and `getDiscoverablePlantsForWeek` directly, calls the hook, returns `null` while unresolved and when `fieldReadyPlants.length === 0`. Move the whole section (page.tsx:168-197) into it.
- [ ] **Step 2.3:** Create `AvailabilityBadge.tsx` — `"use client"`, props `{ plant }`; computes `isAvailableNow`/`currentWindow` via the hook; renders the "Collectible/Photograph Now" pill and the "Collectible This Week" note block (currently plants/[id]/page.tsx:91-103 and 216-256). Detail page passes `plant` and drops its own `getCurrentMonthWeek` usage; `CollectionCalendar` receives `currentMonth`/`currentWeek` from a small client wrapper using the same hook (create the wrapper inline in AvailabilityBadge file as a second export `CalendarWithNow`).
- [ ] **Step 2.4:** In `BrowseContent.tsx` replace line 23 with `const now = useCurrentMonthWeek();` and pass `currentMonth={now?.month}` to PlantCard.
- [ ] **Step 2.5:** `npm run build` → all routes still `○ Static`/`● SSG`. `npm run dev` + open `/` — hero must show **July W4** (today), not May W1. Screenshot as proof.
- [ ] **Step 2.6:** Commit `fix: live month/week on statically generated pages`.

### Task 3: Design tokens + fonts

**Files:**
- Modify: `src/app/globals.css` (full rewrite), `src/app/layout.tsx`

- [ ] **Step 3.1:** Rewrite `globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-canvas: #f0f1ea;
  --color-surface: #ffffff;
  --color-tint: #e7ebdf;
  --color-ink: #171b17;
  --color-moss: #3d5a44;
  --color-moss-soft: #5c7a62;
  --color-sage: #aec2a4;
  --color-sprout: #c9e265;
  --color-clay: #b0603f;
  --color-clay-tint: #f4e3db;
  --color-mist: #64707a;
  --color-mist-tint: #e2e8ed;
  --color-moss-tint: #e3edd8;
  --color-text: #20241f;
  --color-text-soft: #6b7268;
  --color-hairline: rgb(23 27 23 / 0.07);

  --radius-card: 22px;
  --radius-tile: 16px;

  --font-sans: var(--font-instrument-sans);
  --font-serif: var(--font-source-serif);

  --shadow-card: 0 1px 2px rgb(23 27 23 / 0.04), 0 16px 40px -16px rgb(23 27 23 / 0.1);
  --shadow-float: 0 24px 60px -20px rgb(23 27 23 / 0.18);
}

body {
  background: var(--color-canvas);
  color: var(--color-text);
  font-family: var(--font-instrument-sans), system-ui, sans-serif;
  font-feature-settings: "ss01";
}

.atlas-shell {
  max-width: 1180px;
  margin-inline: auto;
  padding-inline: 1rem;
}
@media (min-width: 640px) { .atlas-shell { padding-inline: 1.5rem; } }
@media (min-width: 1024px) { .atlas-shell { padding-inline: 2rem; } }

/* Cards: shadow + tint separation, no hard borders */
.card {
  background: var(--color-surface);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}
.card-hover { transition: transform 200ms ease, box-shadow 200ms ease; }
.card-hover:hover { transform: translateY(-2px); box-shadow: var(--shadow-float); }

/* Glass panel — only over photography */
.glass {
  background: rgb(255 255 255 / 0.72);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}

/* Pill chip */
.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  border-radius: 999px;
  padding: 0.3125rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1;
}

/* Buttons */
.btn-ink,
.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 999px;
  min-height: 2.75rem;
  padding: 0.75rem 1.375rem;
  font-size: 0.875rem;
  font-weight: 550;
  transition: background 180ms ease, color 180ms ease, transform 180ms ease;
}
.btn-ink { background: var(--color-ink); color: #fff; }
.btn-ink:hover { background: var(--color-moss); transform: translateY(-1px); }
.btn-ghost { background: var(--color-surface); color: var(--color-text); box-shadow: inset 0 0 0 1px var(--color-hairline); }
.btn-ghost:hover { background: var(--color-tint); }

.section-label { font-size: 0.6875rem; font-weight: 500; color: var(--color-text-soft); letter-spacing: 0.02em; }
.sci-name { font-family: var(--font-source-serif), Georgia, serif; font-style: italic; }

::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: var(--color-canvas); }
::-webkit-scrollbar-thumb { background: var(--color-sage); border-radius: 4px; }
```

Delete: `.herbarium-border`, `.atlas-kicker`, `.atlas-panel`, `.atlas-button-*`, `.specimen-grid`, `.atlas-card`, the graph-paper body background. Keep `--color-primary`/`--color-border`-style legacy names OUT — grep will find stragglers in Step 3.3.

- [ ] **Step 3.2:** In `layout.tsx` swap fonts:

```tsx
import { Instrument_Sans, Source_Serif_4 } from "next/font/google";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
});
const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});
```

`<html>` className: `${instrumentSans.variable} ${sourceSerif.variable} h-full antialiased`. Body: `className="flex min-h-full flex-col bg-canvas text-text"` (drop the inline style). Footer: `border-t border-hairline`, text `text-text-soft`, brand line `font-semibold text-text`.

- [ ] **Step 3.3:** `grep -rn "atlas-kicker\|atlas-panel\|atlas-card\|atlas-button\|specimen-grid\|herbarium\|--color-primary\|--color-border\|--color-card\|--color-field\|--color-text-muted\|--color-accent\|--color-secondary\|--color-sky" src/` — this is the migration worklist for Tasks 5–10. Site will look broken until those land; that is expected on this branch.
- [ ] **Step 3.4:** Commit `feat: v2 design tokens and typography`.

### Task 4: Primitives + status color maps

**Files:**
- Create: `src/components/ui/Chip.tsx`, `src/components/ui/StatTile.tsx`
- Modify: `src/lib/utils.ts:23-45,93-97`

- [ ] **Step 4.1:** `Chip.tsx`:

```tsx
import { ReactNode } from "react";

const TONES = {
  moss: "bg-moss-tint text-moss",
  sage: "bg-tint text-text-soft",
  clay: "bg-clay-tint text-clay",
  mist: "bg-mist-tint text-mist",
  sprout: "bg-sprout text-ink",
  ink: "bg-ink text-white",
} as const;

export type ChipTone = keyof typeof TONES;

export default function Chip({
  tone = "sage",
  children,
  className = "",
}: {
  tone?: ChipTone;
  children: ReactNode;
  className?: string;
}) {
  return <span className={`chip ${TONES[tone]} ${className}`}>{children}</span>;
}
```

- [ ] **Step 4.2:** `StatTile.tsx`:

```tsx
export default function StatTile({
  value,
  label,
  className = "",
}: {
  value: string | number;
  label: string;
  className?: string;
}) {
  return (
    <div className={`rounded-tile bg-surface p-4 shadow-card ${className}`}>
      <div className="text-3xl font-semibold tracking-tight text-text">{value}</div>
      <div className="mt-1 text-xs text-text-soft">{label}</div>
    </div>
  );
}
```

- [ ] **Step 4.3:** In `utils.ts`, replace the Tailwind-default color maps with tone maps (typed as `ChipTone`):

```ts
import type { ChipTone } from "@/components/ui/Chip";

export function getCategoryTone(category: PlantCategory): ChipTone {
  const map: Record<PlantCategory, ChipTone> = {
    tree: "moss", shrub: "clay", wildflower: "sprout",
    fern: "moss", grass: "sage", vine: "mist",
  };
  return map[category] ?? "sage";
}

export function getNativeStatusTone(status: Plant["nativeStatus"]): ChipTone {
  if (status === "native") return "moss";
  if (status === "naturalized") return "mist";
  return "clay";
}
```

Delete `getCategoryColor`, `getCategoryDotColor`, `getNativeStatusColor`, `getHabitatIcon` (emoji) after their call sites migrate (Tasks 6–10); until then keep them exported with a `/** @deprecated v2 */` tag so the build stays green between tasks.

- [ ] **Step 4.4:** `npm test && npm run build` → green. Commit `feat: chip/stat primitives and tone maps`.

### Task 5: Navigation

**Files:**
- Modify: `src/components/Navigation.tsx` (full restyle)

- [ ] **Step 5.1:** Replace `window.location.href` submit with `useRouter`:

```tsx
import { useRouter } from "next/navigation";
// in component:
const router = useRouter();
function handleSearchSubmit(e: React.FormEvent) {
  e.preventDefault();
  if (searchQuery.trim()) {
    router.push(`/plants?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setSearchQuery("");
  }
}
```

- [ ] **Step 5.2:** Restyle (ref image 1's top bar): outer `nav` → `sticky top-0 z-50 bg-canvas/85 backdrop-blur-xl` (no border-b). Desktop links live inside a segmented pill: wrapper `hidden md:flex items-center gap-1 rounded-full bg-surface p-1 shadow-card`; each link `rounded-full px-4 py-2 text-sm font-medium`, active = `bg-ink text-white`, inactive = `text-text-soft hover:bg-tint`. Logo mark: `h-9 w-9 rounded-full bg-moss text-white grid place-items-center` with `Sprout size={16}`; wordmark `text-sm font-semibold tracking-tight` + `text-[10px] text-text-soft` subtitle (no uppercase tracking). Search & hamburger buttons: `rounded-full bg-surface p-2.5 shadow-card text-text hover:bg-tint` (no border). Search input: `rounded-full bg-surface px-5 py-3 text-sm shadow-card focus:outline-none focus:ring-2 focus:ring-sage`; submit uses `.btn-ink`. Mobile menu links mirror desktop pill styles, `border-t border-hairline` separator.
- [ ] **Step 5.3:** Dev-server check: all 5 links navigate, active state correct on `/plants/red-maple` (Browse active), search from nav lands on `/plants?q=maple` without full reload (verify via React DevTools no page reload / network doc request). Commit `feat: v2 navigation`.

### Task 6: Home page renewal

**Files:**
- Modify: `src/app/page.tsx`, `src/components/SurveyFrameCard.tsx`, `src/components/FieldReadySection.tsx`

- [ ] **Step 6.1: Hero → light editorial split (ref image 1).** Replace the dark full-bleed section (page.tsx:88-166) with: section `atlas-shell pt-14 pb-10 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center`. Left column: `section-label` line "St. Mark's School · Southborough MA"; `h1` `text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.02]` — "Tiny Worlds Field Atlas" with "Field Atlas" wrapped in `<span className="text-moss">`; lede `mt-6 max-w-xl text-lg leading-8 text-text-soft`; CTA row `mt-8 flex flex-wrap gap-3`: Browse specimens `.btn-ink`, This season `.btn-ghost`, `<PDFExport variant="secondary">` restyled to `.btn-ghost` (Task 11 aligns PDFExport variants). Below CTAs: quiet meta row `mt-10 flex flex-wrap gap-x-8 gap-y-2 text-xs text-text-soft` for "1km survey radius · 9 habitat systems · Ethical collection policy" (plain text, no uppercase).
  Right column: hero photo as an object — `relative` wrapper; img `aspect-[4/5] w-full rounded-card object-cover shadow-float`; `SurveyFrameCard` absolutely overlapped `absolute -bottom-8 -left-8 hidden sm:block w-[280px]` as a `.glass` panel.
- [ ] **Step 6.2: SurveyFrameCard restyle** — `.glass p-5`; header `section-label` "Active survey frame" + `text-2xl font-semibold` month/week (`–` until hook resolves); 2×2 stat grid where each cell is `text-2xl font-semibold` + `text-[11px] text-text-soft` label; no icon, no border dividers (use `divide-y divide-hairline` only between header and grid).
- [ ] **Step 6.3: FieldReadySection** — section header: `section-label` "Current field window" + `h2 text-3xl font-semibold tracking-tight`; counts sentence `text-sm text-text-soft`; "View full calendar" link `text-sm font-medium text-moss inline-flex items-center gap-1.5`; card grid unchanged structurally (`sm:grid-cols-2 lg:grid-cols-4 gap-4`).
- [ ] **Step 6.4: Quick links (page.tsx:199-227)** — drop the `01/02/03` numbering and the field-tint band. Section: `atlas-shell py-12`, grid `md:grid-cols-4 gap-4`; each card `card card-hover flex min-h-44 flex-col justify-between p-6`: icon in a `h-10 w-10 rounded-full bg-moss-tint text-moss grid place-items-center` disc (`size={18}`), title `text-lg font-semibold tracking-tight`, desc `mt-1.5 text-sm leading-6 text-text-soft`.
- [ ] **Step 6.5: Habitat matrix (page.tsx:229-275)** — heading pattern as 6.3; habitat links become `.chip bg-surface shadow-card text-text hover:bg-tint` pills with the count in `text-moss font-semibold`; map wrapper `card overflow-hidden p-2`.
- [ ] **Step 6.6: Category scan (page.tsx:277-326)** — section on plain canvas (no border-y band); each tile → `<StatTile>` wrapped in a Link with `card-hover`, icon `text-moss` above, using `getCategoryTone` accent dot `h-2 w-2 rounded-full bg-sprout` next to the label.
- [ ] **Step 6.7:** Dev check at 1280px + 375px (resize_window): no horizontal scroll, hero photo overlap collapses gracefully on mobile (SurveyFrameCard falls back to `mt-4 static block sm:absolute`). Commit `feat: v2 home page`.

### Task 7: PlantCard

**Files:**
- Modify: `src/components/PlantCard.tsx` (full rewrite)

- [ ] **Step 7.1:** Rewrite render:

```tsx
import Link from "next/link";
import { Plant } from "@/data/plants";
import { getCategoryTone, getNativeStatusTone, getNativeStatusLabel, getHabitatLabel, formatMonthShort } from "@/lib/utils";
import { getCollectionPolicy } from "@/lib/plantDiscovery";
import Chip from "@/components/ui/Chip";

interface PlantCardProps {
  plant: Plant;
  currentMonth?: number;
}

export default function PlantCard({ plant, currentMonth }: PlantCardProps) {
  const collectionPolicy = getCollectionPolicy(plant);
  const activeMonths = Array.from(new Set(plant.collectionWindows.map((w) => w.month))).sort((a, b) => a - b);
  const isCurrentlyAvailable =
    currentMonth !== undefined && plant.collectionWindows.some((w) => w.month === currentMonth);

  return (
    <Link href={`/plants/${plant.id}`} className="group block">
      <div className="card card-hover flex h-full flex-col overflow-hidden">
        {plant.imageUrl && (
          <div className="relative aspect-[4/3] overflow-hidden bg-tint">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={plant.imageUrl}
              alt={plant.commonName}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
            {isCurrentlyAvailable && (
              <Chip
                tone={collectionPolicy.type === "photograph-only" ? "mist" : "sprout"}
                className="absolute left-3 top-3 shadow-card"
              >
                {collectionPolicy.type === "photograph-only" ? "Photo now" : "In season"}
              </Chip>
            )}
          </div>
        )}
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold tracking-tight text-text">{plant.commonName}</h3>
            <p className="sci-name mt-0.5 truncate text-sm text-text-soft">{plant.scientificName}</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Chip tone={getCategoryTone(plant.category)}>{plant.category}</Chip>
            <Chip tone={getNativeStatusTone(plant.nativeStatus)}>{getNativeStatusLabel(plant.nativeStatus)}</Chip>
            {collectionPolicy.type !== "collect" && <Chip tone="mist">{collectionPolicy.shortLabel}</Chip>}
          </div>
          <p className="truncate text-xs text-text-soft">
            {plant.family} · {plant.habitat.map(getHabitatLabel).join(", ")}
          </p>
          <div className="mt-auto pt-3">
            <div className="flex items-center gap-1">
              {[4, 5, 6, 7, 8, 9, 10, 11].map((month) => {
                const active = activeMonths.includes(month);
                const isCurrent = currentMonth === month;
                return (
                  <span
                    key={month}
                    title={`${formatMonthShort(month)}${active ? ": in window" : ""}`}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      active ? (isCurrent ? "bg-sprout" : "bg-moss/70") : "bg-tint"
                    }`}
                  />
                );
              })}
            </div>
            <div className="mt-1.5 flex justify-between text-[10px] text-text-soft">
              <span>Apr</span>
              <span>Nov</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
```

(The letter-dot month row becomes a quiet segmented season bar — ref image 3's dot-matrix language.)

- [ ] **Step 7.2:** Dev check on `/` and `/plants`; hover lift works; chips readable over images. Commit `feat: v2 plant card`.

### Task 8: Browse page (BrowseContent, SearchBar, FilterPanel)

**Files:**
- Modify: `src/app/plants/BrowseContent.tsx`, `src/components/SearchBar.tsx`, `src/components/FilterPanel.tsx`, `src/app/plants/page.tsx` (if it carries styling wrappers)

- [ ] **Step 8.1:** Page header: drop `border-b`; `section-label` "Specimen database", `h1 text-4xl sm:text-5xl font-semibold tracking-tight`, count line `text-sm text-text-soft`.
- [ ] **Step 8.2:** Toolbar: SearchBar input → `w-full rounded-full bg-surface px-5 py-3 text-sm shadow-card focus:outline-none focus:ring-2 focus:ring-sage` with leading `Search size={16} text-text-soft` icon; sort `<select>` wrapped in `rounded-full bg-surface shadow-card px-4 py-3 text-sm font-medium`; Filters toggle `.btn-ghost` with active-count badge `<Chip tone="ink">{n}</Chip>`.
- [ ] **Step 8.3:** FilterPanel: panel container `card p-5`; every checkbox/toggle row becomes a pill toggle — unselected `chip bg-tint text-text-soft`, selected `chip bg-ink text-white`; month toggles same; section titles `section-label mb-2`. Reset button `.btn-ghost text-sm`.
- [ ] **Step 8.4:** Empty state (`filtered.length === 0`): `card p-10 text-center` with `text-text-soft` copy and a `.btn-ghost` reset.
- [ ] **Step 8.5:** Dev check: query param `?category=tree` preselects pill; search/sort/filter all live; no leftover `--color-*` legacy vars (grep the three files). Commit `feat: v2 browse experience`.

### Task 9: Plant detail + CollectionCalendar

**Files:**
- Modify: `src/app/plants/[id]/page.tsx`, `src/components/CollectionCalendar.tsx`, `src/components/AvailabilityBadge.tsx`

- [ ] **Step 9.1: Header (replaces dark ink band, lines 68-154):** breadcrumb link `text-sm text-text-soft hover:text-text inline-flex items-center gap-1.5`. Then a two-column open layout (no giant bordered panel): left `lg:col-span-1` photo `aspect-[4/5] rounded-card object-cover shadow-float`; right column starts with `section-label` "Specimen record", `h1 text-4xl sm:text-5xl font-semibold tracking-tight text-text`, `p.sci-name text-xl text-text-soft`, then `AvailabilityBadge` chip row. Meta strip (ref image 3's quiet metadata row): `mt-6 flex flex-wrap gap-x-10 gap-y-3 border-y border-hairline py-4` with 4 cells each `text-[11px] text-text-soft` label over `text-sm font-medium text-text` value: Category / Status / Family (sci-name style) / Abundance. Collection-policy chip: tone `mist` for photograph-only else `moss`.
- [ ] **Step 9.2: Notes → tinted wells, not alert boxes.** Current-window note `rounded-tile bg-moss-tint p-4` (mist-tint variant for photo-only); conservation note `rounded-tile bg-[#f5eeda] p-4` with `text-text`; invasive warning `rounded-tile bg-clay-tint p-4 text-clay` — all with `text-sm leading-6`, bold lead `font-semibold`, lucide icon `size={16}` matching the text color. No red-100/amber-100.
- [ ] **Step 9.3: Description / ID tips:** headings `text-lg font-semibold tracking-tight` (no icons); tips keep numbered squares but restyled `h-5 w-5 rounded-full bg-tint text-text-soft text-[11px]`; body `text-[15px] leading-7 text-text`.
- [ ] **Step 9.4: Habitats card** → `card p-5` list of `.chip bg-tint` links; **Preservation notes** → `card bg-tint/60 p-6` (still white-family, no border); **Sources** → `card p-6`, links `text-moss text-sm font-medium hover:underline`.
- [ ] **Step 9.5: CollectionCalendar → dot-matrix (ref image 3).** Replace the green table cells: keep the `table` for a11y but each cell renders `span h-3.5 w-3.5 rounded-full mx-auto block` — in-window `bg-moss`, current week `bg-sprout ring-2 ring-sprout/40`, empty `bg-tint`. Month headers `text-xs font-medium text-text-soft`, current month `text-moss` + "now" tag as `text-[9px] text-moss`. Tooltip div: `card px-3 py-2 text-xs shadow-float` fixed positioning as today. Legend row underneath: three dots + labels `text-[11px] text-text-soft`.
- [ ] **Step 9.6:** Footer nav buttons → `.btn-ghost`. Dev check `/plants/spring-beauty` and one invasive plant (e.g. `/plants/oriental-bittersweet` if present — else pick from data) at both breakpoints. Commit `feat: v2 specimen page`.

### Task 10: Calendar, Habitats, Map, Field-guide pages

**Files:**
- Modify: `src/app/calendar/page.tsx`, `src/app/habitats/page.tsx`, `src/app/map/page.tsx`, `src/app/field-guide/page.tsx`, `src/components/HabitatMap.tsx` (popup/legend styling only), `src/components/PrintButton.tsx`, `src/components/InstallPrompt.tsx`

- [ ] **Step 10.1:** Apply the shared recipe to each page (these pages currently use the same legacy vocabulary — the Step 3.3 grep output is the checklist): page headers → `section-label` + `font-semibold tracking-tight` h1; `atlas-panel|atlas-card` → `.card`; badges → `<Chip>`; buttons → `.btn-ink`/`.btn-ghost`; `style={{ color: "var(--color-text-muted)" }}` → `text-text-soft`; `borderColor var(--color-border)` → `border-hairline` or removal; uppercase tracking labels → `section-label`. Calendar page month-grid cells reuse the Task 9.5 dot language. If calendar page uses `getCurrentMonthWeek` server-side, switch it to `useCurrentMonthWeek` (client) the same way as Task 2.
- [ ] **Step 10.2:** HabitatMap: Leaflet popups/legend → white rounded cards (`card` classes in popup HTML), radius circle stroke `#3d5a44` fill `rgba(201,226,101,0.12)`; remove emoji icons if `getHabitatIcon` is used here — replace with a `h-2.5 w-2.5 rounded-full` colored dot per habitat (single moss/sage scale). Then delete deprecated helpers from utils.ts (`getCategoryColor`, `getCategoryDotColor`, `getNativeStatusColor`, `getHabitatIcon`) and confirm `grep -rn "getCategoryColor\|getCategoryDotColor\|getNativeStatusColor\|getHabitatIcon" src/` returns nothing.
- [ ] **Step 10.3:** InstallPrompt/PrintButton restyle to `.btn-ink`/`card`. Dev check all four routes desktop+mobile. Commit `feat: v2 secondary pages`.

### Task 10.5: Interactive radius explorer (map) — TDD

The `/map` page becomes an interactive "survey radius explorer": the circle stays centered on St. Mark's (`SCHOOL_CENTER`, never movable), but the user resizes the radius — mouse-dragging a handle on the circle's edge on desktop, finger-dragging the same handle or a large slider on mobile — and watches the species/habitat counts grow and shrink live as habitat zones enter and leave the circle.

**Files:**
- Create: `src/lib/radiusExplorer.ts`, `src/components/RadiusExplorer.tsx`
- Modify: `src/components/HabitatMap.tsx` (controlled-radius props), `src/app/map/page.tsx`
- Test: `src/lib/__tests__/radiusExplorer.test.ts`

- [ ] **Step 10.5.1: Write the failing tests**

```ts
// src/lib/__tests__/radiusExplorer.test.ts
import { describe, expect, it } from "vitest";
import {
  haversineMeters,
  zonesWithinRadius,
  speciesWithinRadius,
  destinationPoint,
} from "@/lib/radiusExplorer";
import { habitatLocations, SCHOOL_CENTER } from "@/data/habitatLocations";
import { plants } from "@/data/plants";

describe("radius explorer geometry", () => {
  it("haversine distance is 0 for identical points and symmetric", () => {
    expect(haversineMeters(SCHOOL_CENTER, SCHOOL_CENTER)).toBe(0);
    const a: [number, number] = [42.3075, -71.5235];
    const b: [number, number] = [42.3095, -71.527];
    expect(haversineMeters(a, b)).toBeCloseTo(haversineMeters(b, a), 6);
    // ~0.002deg lat + ~0.0035deg lng near 42N ≈ 360m ± 60m
    expect(haversineMeters(a, b)).toBeGreaterThan(300);
    expect(haversineMeters(a, b)).toBeLessThan(420);
  });

  it("destinationPoint lands at the requested distance from center", () => {
    const p = destinationPoint(SCHOOL_CENTER, 800, 90);
    expect(haversineMeters(SCHOOL_CENTER, p)).toBeCloseTo(800, -1); // within ~5m
  });
});

describe("zone / species inclusion", () => {
  it("includes the on-campus zone even at radius 0 (zone overlap rule)", () => {
    const zones = zonesWithinRadius(habitatLocations, SCHOOL_CENTER, 0);
    expect(zones.map((z) => z.name)).toContain("School Grounds");
  });

  it("includes all 12 zones at 2km and is monotonic in radius", () => {
    expect(zonesWithinRadius(habitatLocations, SCHOOL_CENTER, 2000)).toHaveLength(
      habitatLocations.length
    );
    let previous = 0;
    for (const r of [0, 200, 400, 600, 800, 1000, 1500]) {
      const count = zonesWithinRadius(habitatLocations, SCHOOL_CENTER, r).length;
      expect(count).toBeGreaterThanOrEqual(previous);
      previous = count;
    }
  });

  it("species count grows with radius and reaches all plants at full coverage", () => {
    const small = speciesWithinRadius(plants, habitatLocations, SCHOOL_CENTER, 100);
    const full = speciesWithinRadius(plants, habitatLocations, SCHOOL_CENTER, 2000);
    expect(small.length).toBeLessThanOrEqual(full.length);
    // every plant lives in at least one mapped habitat, so full coverage = all species
    expect(full).toHaveLength(plants.length);
  });
});
```

Run `npm test` → FAIL (module not found). (If the last assertion fails because some plant's habitats have no mapped zone, that is a real data gap — list the orphaned habitat in the test output, add a zone for it to `habitatLocations.ts`, and keep the assertion.)

- [ ] **Step 10.5.2: Implement the pure logic**

```ts
// src/lib/radiusExplorer.ts
import { HabitatLocation } from "@/data/habitatLocations";
import { Plant, Habitat } from "@/data/plants";

const EARTH_RADIUS_M = 6371000;
const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

export function haversineMeters(a: [number, number], b: [number, number]): number {
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}

// A zone counts as "inside" when its own circle overlaps the survey circle.
export function zonesWithinRadius(
  zones: HabitatLocation[],
  center: [number, number],
  radiusMeters: number
): HabitatLocation[] {
  return zones.filter(
    (zone) => haversineMeters(center, zone.coords) - zone.radius <= radiusMeters
  );
}

export function speciesWithinRadius(
  plants: Plant[],
  zones: HabitatLocation[],
  center: [number, number],
  radiusMeters: number
): Plant[] {
  const habitats = new Set<Habitat>(
    zonesWithinRadius(zones, center, radiusMeters).map((z) => z.habitat)
  );
  return plants.filter((p) => p.habitat.some((h) => habitats.has(h)));
}

// Point at `distanceMeters` from center along `bearingDeg` (90 = due east) —
// used to place the drag handle on the circle's edge.
export function destinationPoint(
  center: [number, number],
  distanceMeters: number,
  bearingDeg: number
): [number, number] {
  const angular = distanceMeters / EARTH_RADIUS_M;
  const bearing = toRad(bearingDeg);
  const lat1 = toRad(center[0]);
  const lng1 = toRad(center[1]);
  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(angular) +
      Math.cos(lat1) * Math.sin(angular) * Math.cos(bearing)
  );
  const lng2 =
    lng1 +
    Math.atan2(
      Math.sin(bearing) * Math.sin(angular) * Math.cos(lat1),
      Math.cos(angular) - Math.sin(lat1) * Math.sin(lat2)
    );
  return [toDeg(lat2), toDeg(lng2)];
}

export const RADIUS_MIN = 100;
export const RADIUS_MAX = 1500;
export const RADIUS_STEP = 25;
```

Run `npm test` → PASS.

- [ ] **Step 10.5.3: HabitatMap controlled-radius mode.** Add optional props `radius?: number` (falls back to `surveyRadius`), `onRadiusChange?: (meters: number) => void`, `activeHabitats?: Set<Habitat>`. Implementation notes (all inside the existing Leaflet effect + one new effect):
  - Store layer handles in refs: `circleRef` (survey circle), `handleRef` (drag handle marker), `zoneLayersRef` (`Map<string, L.CircleMarker>` keyed by zone name).
  - Keep the dashed 1km reference circle always drawn (`SURVEY_RADIUS`, `dashArray: "8 4"`, color `#3d5a44`, fillOpacity 0). The **adjustable** circle is a second solid circle: color `#3d5a44`, fillColor `#c9e265`, fillOpacity 0.10, weight 2.
  - When `onRadiusChange` is set, add the handle: `L.marker(destinationPoint(schoolCenter, radius, 90), { draggable: true, icon: handleIcon })` where `handleIcon = L.divIcon({ className: "radius-handle", iconSize: [44, 44], iconAnchor: [22, 22], html: '<div class="radius-handle-dot"></div>' })` — 44px touch target, visible 18px sprout dot with white ring and shadow (styles added to globals.css: `.radius-handle-dot { width:18px; height:18px; margin:13px; border-radius:999px; background:#c9e265; box-shadow:0 0 0 3px #fff, 0 2px 8px rgb(23 27 23/.35); }`). On `drag`, compute `haversineMeters(schoolCenter, handleLatLng)`, clamp to `[RADIUS_MIN, RADIUS_MAX]`, call `onRadiusChange(clamped)`. On `dragend`, snap the handle back onto the due-east edge point for the final radius.
  - New `useEffect([radius, activeHabitats])`: `circleRef.current?.setRadius(radius)`; `handleRef.current?.setLatLng(destinationPoint(schoolCenter, radius, 90))`; for each zone layer call `setStyle({ fillOpacity: active ? 0.55 : 0.12, opacity: active ? 1 : 0.25 })` — zones visibly "light up" as they enter the circle and fade as they leave. Do **not** re-create the map on radius change (keep `radius` out of the main effect's dependency array; only the new effect reacts).
- [ ] **Step 10.5.4: RadiusExplorer component**

```tsx
// src/components/RadiusExplorer.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { plants } from "@/data/plants";
import {
  habitatLocations,
  SCHOOL_CENTER,
  SURVEY_RADIUS,
} from "@/data/habitatLocations";
import {
  RADIUS_MAX,
  RADIUS_MIN,
  RADIUS_STEP,
  speciesWithinRadius,
  zonesWithinRadius,
} from "@/lib/radiusExplorer";
import HabitatMapLoader from "@/components/HabitatMapLoader";

// Tween a number toward its target so counts tick up/down as the circle moves.
function useAnimatedNumber(target: number, durationMs = 350): number {
  const [display, setDisplay] = useState(target);
  const fromRef = useRef(target);
  useEffect(() => {
    const from = fromRef.current;
    if (from === target) return;
    const start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1);
      const eased = 1 - (1 - t) * (1 - t);
      setDisplay(Math.round(from + (target - from) * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
      else fromRef.current = target;
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);
  return display;
}

export default function RadiusExplorer() {
  const [radius, setRadius] = useState(SURVEY_RADIUS);

  const activeZones = useMemo(
    () => zonesWithinRadius(habitatLocations, SCHOOL_CENTER, radius),
    [radius]
  );
  const activeHabitats = useMemo(
    () => new Set(activeZones.map((z) => z.habitat)),
    [activeZones]
  );
  const species = useMemo(
    () => speciesWithinRadius(plants, habitatLocations, SCHOOL_CENTER, radius),
    [radius]
  );

  const speciesCount = useAnimatedNumber(species.length);
  const zoneCount = useAnimatedNumber(activeZones.length);

  return (
    <div className="relative">
      <div className="card overflow-hidden p-2">
        <HabitatMapLoader
          habitatLocations={habitatLocations}
          plants={plants}
          schoolCenter={SCHOOL_CENTER}
          surveyRadius={SURVEY_RADIUS}
          radius={radius}
          onRadiusChange={setRadius}
          activeHabitats={activeHabitats}
          height={520}
          showLegend={false}
        />
      </div>

      {/* Live readout — glass panel floating over the map, ref image 1 */}
      <div className="glass pointer-events-none absolute left-5 top-5 z-[500] w-[230px] p-4 sm:w-[260px]">
        <p className="section-label">Survey radius · St. Mark&apos;s</p>
        <p className="mt-1 text-2xl font-semibold tracking-tight text-text">
          {radius >= 1000 ? `${(radius / 1000).toFixed(2)} km` : `${radius} m`}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3 border-t border-hairline pt-3">
          <div>
            <div className="text-3xl font-semibold tracking-tight text-moss">{speciesCount}</div>
            <div className="text-[11px] text-text-soft">species in reach</div>
          </div>
          <div>
            <div className="text-3xl font-semibold tracking-tight text-text">{zoneCount}</div>
            <div className="text-[11px] text-text-soft">habitat zones</div>
          </div>
        </div>
      </div>

      {/* Radius control — primary input on touch, works everywhere */}
      <div className="card mt-4 flex flex-wrap items-center gap-4 p-4">
        <input
          type="range"
          min={RADIUS_MIN}
          max={RADIUS_MAX}
          step={RADIUS_STEP}
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          aria-label="Survey radius in meters"
          className="h-2 min-w-0 flex-1 cursor-pointer appearance-none rounded-full bg-tint accent-moss"
        />
        <div className="flex items-center gap-2">
          {[250, 500, 1000, 1500].map((preset) => (
            <button
              key={preset}
              onClick={() => setRadius(preset)}
              className={`chip cursor-pointer ${
                radius === preset ? "bg-ink text-white" : "bg-tint text-text-soft hover:bg-sage/40"
              }`}
            >
              {preset >= 1000 ? `${preset / 1000}km` : `${preset}m`}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-2 text-xs text-text-soft">
        Drag the dot on the circle&apos;s edge — or use the slider — to grow or shrink
        the survey area. Zones light up as they come into reach.
      </p>
    </div>
  );
}
```

`HabitatMapLoader` passes the three new props through to `HabitatMap` (update its prop types accordingly).

- [ ] **Step 10.5.5:** `src/app/map/page.tsx`: header (`section-label` "Survey area" + h1 "Explore the radius" in v2 type) then `<RadiusExplorer />`; keep any existing habitat-list content below using v2 recipes. The home-page map (Task 6.5) stays non-interactive — it omits `onRadiusChange`, so nothing changes there.
- [ ] **Step 10.5.6:** Verify in dev: desktop — drag the edge handle with the mouse; circle resizes continuously, species count ticks up/down, off-radius zones dim. Mobile (375px, touch emulation) — slider thumb ≥ 44px tap target, handle draggable by finger, glass panel does not block map gestures (`pointer-events-none`). Confirm map does not fully re-render on radius change (no tile flash). `npm test` green. Commit `feat: interactive survey-radius explorer`.

### Task 11: App chrome — theme color, manifest, SW, PDF

**Files:**
- Modify: `src/app/layout.tsx:26-28`, `public/manifest.json`, `public/sw.js`, `src/components/PDFExport.tsx:17-22` (+ its variant styles)

- [ ] **Step 11.1:** `themeColor: "#f0f1ea"`. manifest.json: `"theme_color": "#f0f1ea"`, `"background_color": "#f0f1ea"`.
- [ ] **Step 11.2:** sw.js: bump all three cache constants from `-v2` to `-v3` (`CACHE_NAME`, `STATIC_CACHE`, `DATA_CACHE` on lines 1-3) so deployed users actually receive the redesign. `skipWaiting()` and `clients.claim()` are already present and the activate handler already deletes non-current caches — leave those alone. Offline image caching is handled separately in Task 15.5.
- [ ] **Step 11.3:** PDFExport: palette constants → `PRIMARY [61,90,68]` (#3d5a44), `SECONDARY [176,96,63]` (#b0603f), `TEXT [32,36,31]`, `MUTED [107,114,104]`, `BG [240,241,234]`; variant classes → primary `.btn-ink`, secondary/subtle `.btn-ghost` (remove the `!important` overrides at page.tsx call site — home now passes plain `variant="secondary"`).
- [ ] **Step 11.4:** Update `docs/visual-philosophy.md`: rewrite to describe the v2 language (canvas/sage/moss/sprout, pill geometry, shadow-over-border, serif taxonomy accents) so future agents stop reproducing the v1 look. Commit `feat: v2 chrome, PWA cache bump, PDF palette`.

### Task 12: Data-integrity test + verification sweep

**Files:**
- Modify: `src/lib/__tests__/plantDiscovery.test.ts` (append)

- [ ] **Step 12.1:** Add the month-range invariant test (defect D4):

```ts
import { plants } from "@/data/plants";

describe("collection window invariants", () => {
  it("all windows fall within the rendered Apr-Nov range", () => {
    for (const plant of plants) {
      for (const window of plant.collectionWindows) {
        expect(window.month, `${plant.id} month`).toBeGreaterThanOrEqual(4);
        expect(window.month, `${plant.id} month`).toBeLessThanOrEqual(11);
        for (const week of window.weeks) {
          expect(week, `${plant.id} week`).toBeGreaterThanOrEqual(1);
          expect(week, `${plant.id} week`).toBeLessThanOrEqual(4);
        }
      }
    }
  });
});
```

- [ ] **Step 12.2:** `npm test && npm run build && npm run lint` → all green, all routes still Static/SSG.
- [ ] **Step 12.3:** Legacy-vocabulary zero check — **exclude `src/data/`**, whose plant prose legitimately contains the word "herbarium" (17 matches in `specimenNotes`; those are botanical content, not CSS):

```bash
grep -rn "font-black\|tracking-\[0.2\|tracking-\[0.16\|tracking-\[0.18\|tracking-\[0.22\|bg-green-100\|bg-pink-100\|bg-amber-100\|bg-sky-100\|atlas-kicker\|atlas-card\|atlas-panel\|atlas-button\|specimen-grid\|--color-primary\|--color-border\|--color-card\|--color-field\|--color-text-muted\|--color-accent\|--color-secondary\|--color-sky" src/ --exclude-dir=data
```

→ must be empty.
- [ ] **Step 12.4:** Browser verification via `.claude/launch.json` dev server: screenshot `/`, `/plants`, `/plants/spring-beauty`, `/calendar`, `/habitats`, `/map`, `/field-guide` at desktop (1280) and mobile (375), light scheme. Confirm: current date correct everywhere, no hydration errors in console, no horizontal scroll, PDF download still generates, and the `/map` radius explorer passes the acceptance-criterion-7 interaction checks at both breakpoints.
- [ ] **Step 12.5:** Run the `visual-verdict` skill comparing screenshots against the three reference images for: radius language, border-vs-shadow separation, type weight discipline, palette adherence. Iterate on misses before shipping.

---

# Phase 5 — Data pipeline

Everything here runs **at build/author time and is committed to the repo**. Rationale (verified 2026-07-28): a static site that fetches taxonomy at request time breaks the day an upstream changes. Baking + committing means an outage degrades to last-known-good.

### Task 14: Build-time enrichment pipeline

**Files:**
- Create: `scripts/enrich.mjs`, `src/data/enrichment.json`, `src/lib/enrichment.ts`
- Test: `src/lib/__tests__/enrichment.test.ts`

**Verified API facts** (real `curl` runs, 2026-07-28 — do not re-litigate these):

| API | Verified | Key | CORS |
|---|---|---|---|
| GBIF `api.gbif.org/v1/species/match?name=` | `Claytonia virginica` → `usageKey 3084745, status ACCEPTED, family Montiaceae`. `Osmunda cinnamomea` → `status SYNONYM, acceptedUsageKey 7629105, Osmundastrum cinnamomeum` | none | `access-control-allow-origin: *` (only when `Origin` is sent — GBIF `vary`s on Origin) |
| GBIF `occurrence/search?...&facet=month` | `Claytonia virginica` in MA → `{4:64, 5:46, 6:1}` | none | `*` |
| iNat `observations?taxon_name=&place_id=2&term_id=12&term_value_id=13` | `Claytonia virginica` → Apr peak; `Hamamelis virginiana` → Oct–Nov peak | none | `*` |
| iNat `observations?...&lat=42.3075&lng=-71.5235&radius=25` | `Claytonia virginica` → 55 nearby observations | none | `*` |
| Wikipedia `api/rest_v1/page/summary/{Name}` | returns extract + thumbnail | none | `*` |

**Scoping rule that matters:** phenology histograms must use `place_id=2` (Massachusetts), **not** a campus radius — at 5–8 km the sample is 10–13 observations, too thin to chart. The campus radius is only for "seen near here" counts.

- [ ] **Step 14.1: Write the failing test**

```ts
// src/lib/__tests__/enrichment.test.ts
import { describe, expect, it } from "vitest";
import { plants } from "@/data/plants";
import { getEnrichment, observedMonths } from "@/lib/enrichment";

describe("enrichment data", () => {
  it("has an entry for every plant", () => {
    for (const plant of plants) {
      expect(getEnrichment(plant.id), `missing enrichment for ${plant.id}`).toBeDefined();
    }
  });

  it("flags no unresolved taxonomy conflicts silently", () => {
    for (const plant of plants) {
      const e = getEnrichment(plant.id);
      if (e?.gbif?.status === "SYNONYM") {
        // A synonym must carry the accepted name so the UI can show it.
        expect(e.gbif.acceptedName, `${plant.id} synonym without acceptedName`).toBeTruthy();
      }
    }
  });

  it("observedMonths returns 12 non-negative numbers", () => {
    const months = observedMonths(plants[0].id);
    expect(months).toHaveLength(12);
    expect(months.every((n) => Number.isInteger(n) && n >= 0)).toBe(true);
  });
});
```

Run `npm test` → FAIL.

- [ ] **Step 14.2: Define the data contract**

```ts
// src/lib/enrichment.ts
import raw from "@/data/enrichment.json";

export interface GbifInfo {
  usageKey: number | null;
  taxonKey: number | null;      // accepted key — use for map tiles
  status: string | null;        // ACCEPTED | SYNONYM | ...
  matchedName: string | null;
  acceptedName: string | null;  // present whenever status === "SYNONYM"
  family: string | null;
  vernacularNames: string[];
}

export interface PlantEnrichment {
  id: string;
  scientificName: string;
  fetchedAt: string;            // ISO date of the last successful bake
  gbif: GbifInfo | null;
  /** Flowering-annotation counts by month, index 0 = January. Source: iNaturalist, Massachusetts. */
  floweringByMonth: number[];
  /** Fruiting-annotation counts by month, index 0 = January. */
  fruitingByMonth: number[];
  /** Observation count within 25 km of campus. */
  nearbyObservations: number;
  inatTaxonId: number | null;
  wikipedia: { extract: string; url: string; thumbnail: string | null } | null;
}

const data = raw as { generatedAt: string; plants: Record<string, PlantEnrichment> };

export function getEnrichment(id: string): PlantEnrichment | undefined {
  return data.plants[id];
}

export function observedMonths(id: string): number[] {
  return getEnrichment(id)?.floweringByMonth ?? new Array(12).fill(0);
}

/** Months (1-12) where observed flowering is at least 15% of the species' peak. */
export function observedPeakMonths(id: string): number[] {
  const months = observedMonths(id);
  const peak = Math.max(...months);
  if (peak === 0) return [];
  return months
    .map((count, i) => ({ month: i + 1, count }))
    .filter(({ count }) => count >= peak * 0.15)
    .map(({ month }) => month);
}

export const enrichmentGeneratedAt = data.generatedAt;
```

- [ ] **Step 14.3: Write `scripts/enrich.mjs`.** Requirements, all non-negotiable:
  - Reads `src/data/plants.ts` by importing the built module (`node --experimental-strip-types` is unavailable in Next 16's toolchain — instead parse with a regex over `scientificName: "..."` / `id: "..."` pairs, the same technique `scripts/add-sources.mjs` already uses; follow that file's existing style).
  - Per plant, sequentially with a **1000 ms courtesy sleep** between plants (measured: ~3 s/plant → ~3.5 min for 65; acceptable, run manually not on every `next build`):
    - `GET https://api.gbif.org/v1/species/match?name={sci}` → usageKey, status, family; if `status === "SYNONYM"`, follow `acceptedUsageKey` via `/v1/species/{key}` for `acceptedName`.
    - `GET https://api.gbif.org/v1/species/{taxonKey}/vernacularNames?limit=20` → dedupe English names.
    - `GET https://api.inaturalist.org/v1/observations?taxon_name={sci}&place_id=2&term_id=12&term_value_id=13&per_page=200&order_by=observed_on` → tally `observed_on_details.month` into `floweringByMonth`. Repeat with `term_value_id=14` for fruiting.
    - `GET https://api.inaturalist.org/v1/observations?taxon_name={sci}&lat=42.3075&lng=-71.5235&radius=25&per_page=1` → `total_results` into `nearbyObservations`.
    - `GET https://en.wikipedia.org/api/rest_v1/page/summary/{sci.replace(/ /g,"_")}` → `extract`, `content_urls.desktop.page`, `thumbnail.source`.
  - **Every fetch wrapped in try/catch. On any failure, keep the previously committed value for that field and log `WARN <id> <field> <reason>`.** The script must exit 0 even if every request fails, and must never write `null` over existing good data.
  - Sends `User-Agent: StMarksFlora/2.0 (educational field guide; https://github.com/ikonkim2027-Korea/stmarks-flora)` on every request — required by Wikimedia policy and requested by GBIF/iNat.
  - Writes `src/data/enrichment.json` with `{ generatedAt, plants: { [id]: PlantEnrichment } }`, keys sorted, 2-space indent, so diffs stay readable.
  - Add `"enrich": "node scripts/enrich.mjs"` to package.json scripts. **Do not** wire it into `build` — a network hiccup must never fail a deploy.
- [ ] **Step 14.4:** Run `npm run enrich`. Review the diff. Print and record any `status: "SYNONYM"` hits — those are real data corrections for the guide (the *Osmunda cinnamomea* case is already confirmed present in this family of names; check whether the repo's own records contain it).
- [ ] **Step 14.5:** `npm test` → PASS. Commit `feat: build-time enrichment pipeline (GBIF/iNat/Wikipedia)` including the generated JSON.

### Task 15: Local images, licensing, and real offline support

Two defects motivate this: (a) `public/sw.js` only caches **same-origin** requests, so all 65 hotlinked `upload.wikimedia.org` images are unavailable offline — fatal for a field guide used in the woods; (b) hotlinking Commons at scale is discouraged by Wikimedia and gives us no licence record.

**Files:**
- Create: `scripts/fetch-local-images.mjs`, `public/plants/*.jpg`, `src/data/imageMeta.json`
- Modify: `src/data/plants.ts` (imageUrl → local path), `public/sw.js`, every `<img>` call site
- Test: `src/lib/__tests__/images.test.ts`

- [ ] **Step 15.1: Write the failing test**

```ts
// src/lib/__tests__/images.test.ts
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { plants } from "@/data/plants";
import meta from "@/data/imageMeta.json";

describe("plant images", () => {
  it("every plant has a local image that exists on disk", () => {
    for (const plant of plants) {
      expect(plant.imageUrl, `${plant.id} has no imageUrl`).toBeTruthy();
      expect(plant.imageUrl!.startsWith("/plants/"), `${plant.id} is not local`).toBe(true);
      expect(existsSync(resolve("public", plant.imageUrl!.slice(1))), `${plant.id} file missing`).toBe(true);
    }
  });

  it("every image carries licence and attribution", () => {
    for (const plant of plants) {
      const entry = (meta as Record<string, { license: string; attribution: string; sourceUrl: string }>)[plant.id];
      expect(entry, `${plant.id} missing image metadata`).toBeDefined();
      expect(entry.license).toBeTruthy();
      expect(entry.attribution).toBeTruthy();
      expect(entry.sourceUrl).toMatch(/^https:\/\//);
    }
  });

  it("every image has an extracted dominant colour", () => {
    for (const plant of plants) {
      const entry = (meta as Record<string, { dominantColor: string; hue: number }>)[plant.id];
      expect(entry.dominantColor).toMatch(/^#[0-9a-f]{6}$/i);
      expect(entry.hue).toBeGreaterThanOrEqual(0);
      expect(entry.hue).toBeLessThan(360);
    }
  });
});
```

- [ ] **Step 15.2: Write `scripts/fetch-local-images.mjs`.** For each plant: download the existing `imageUrl` to `public/plants/{id}.jpg` (skip if present unless `--force`); query the Commons API for the file's licence + author (`https://commons.wikimedia.org/w/api.php?action=query&titles=File:{name}&prop=imageinfo&iiprop=extmetadata&format=json&origin=*` → `extmetadata.LicenseShortName.value`, `.Artist.value` stripped of HTML, `.Credit`); compute the dominant colour and hue. Use `sharp` for both resize and colour (`npm i -D sharp`; it is already a transitive Next dependency, so no new runtime weight): downscale to 16×16, average the pixels ignoring near-white/near-black, convert to hex + HSL hue. Write `src/data/imageMeta.json` keyed by plant id with `{ file, license, attribution, sourceUrl, dominantColor, hue, width, height }`. Then rewrite `imageUrl` in `plants.ts` to `/plants/{id}.jpg` (regex replace in place, same approach as `scripts/add-sources.mjs`). Add `"images": "node scripts/fetch-local-images.mjs"` to scripts.
- [ ] **Step 15.3:** Run `npm run images`. Confirm 65 files land in `public/plants/`, total size is reasonable (resize the stored copy to max 1600px wide, quality 82 — target < 25 MB for the whole set), and `git status` shows the rewritten `plants.ts`.
- [ ] **Step 15.4:** Replace every raw `<img>` with `next/image` now that files are local and dimensions are known (home hero, PlantCard, detail page). Use `fill` + `sizes` inside the existing aspect-ratio wrappers; set `priority` only on the home hero and the detail-page hero.
- [ ] **Step 15.5:** Add image caching to `public/sw.js`: extend the fetch handler so same-origin `/plants/*` and `/_next/image*` requests use cache-first, and add `/plants` index + the detail routes already listed to `PRE_CACHE_URLS`. **Bump all three cache constants to `-v3`** (they are currently `-v2`, so reusing them would leave existing users on stale HTML).
- [ ] **Step 15.6:** Add an image credit line under every hero image: `Photo: {attribution} · {license}` linking to `sourceUrl`, styled `text-[11px] text-text-soft`. Wikimedia licences require this and it teaches the right habit for a research project.
- [ ] **Step 15.7:** `npm test && npm run build`. Then a real offline check: dev server → load `/plants` → DevTools Network "Offline" → navigate to a detail page → **image renders**. Commit `feat: local images, licence metadata, offline image cache`.

---

# Phase 6 — Discovery features

Benchmark note: the Google Arts & Culture **Botanic Atlas** was reverse-engineered for this plan (its own source bundles + live behaviour). Its onboarding card reads *"Search, click Feeling Lucky, or select a country to explore"* — three discovery modes: **search**, **serendipity**, **spatial browse**. We already have spatial browse (Task 10.5). Tasks 16–23 build the other two, plus the things Botanic Atlas conspicuously lacks: autocomplete, trait filtering, related-species jumping, and provenance. At 65 records those are all cheap, which is precisely where a small guide can beat a 450,000-specimen one.

### Task 16: Observed-vs-expected phenology chart

The scientific centrepiece: the hand-authored collection window drawn against **real iNaturalist flowering observations from Massachusetts**. Where they disagree, that is a finding, not a bug.

**Files:**
- Create: `src/components/PhenologyChart.tsx`
- Modify: `src/app/plants/[id]/page.tsx` (below Collection Calendar)

- [ ] **Step 16.1:** Build `PhenologyChart` (server component, no client JS needed): a 12-column grid, Jan–Dec. For each month draw two stacked rows — (1) **Guide window**: filled `bg-moss` block when the plant has a `collectionWindow` in that month, else `bg-tint`; (2) **Observed flowering**: a bar whose height is `count / peak` of `floweringByMonth`, filled `bg-sprout`, minimum 2px when count > 0. Month labels `text-[10px] text-text-soft`, current month label `text-moss font-medium`. Above the chart: title `Season check`, and a one-line verdict computed at render — compare `observedPeakMonths(id)` with the guide's window months and emit exactly one of: `"Guide window matches observed bloom."` / `"Observed bloom also extends into {months}."` / `"Guide window is narrower than observed records."` / `"No observation records for this species yet."` (when `peak === 0`).
- [ ] **Step 16.2:** Footnote under the chart: `Flowering records: {n} iNaturalist observations, Massachusetts` linking to `https://www.inaturalist.org/observations?taxon_id={inatTaxonId}&place_id=2`, plus `Nearby: {nearbyObservations} observations within 25 km`. Both `text-[11px] text-text-soft`.
- [ ] **Step 16.3:** Verify on `/plants/spring-beauty` (expect an April/May bloom peak, matching its April–May guide window) and on a late-season species such as witch hazel if present in the data (expect an autumn peak). If a species shows `peak === 0`, the empty state must render cleanly. Commit `feat: observed-vs-expected phenology chart`.

### Task 17: Feeling Lucky

Botanic Atlas's headline discovery control (an extended FAB in the header, collapsing to an icon button on mobile, firing `/api/random_specimen`). Ours needs no API and can be smarter: it can prefer something findable *today*.

**Files:**
- Create: `src/components/FeelingLucky.tsx`
- Modify: `src/components/Navigation.tsx`, `src/app/page.tsx` (hero CTA row)

- [ ] **Step 17.1:** `FeelingLucky.tsx` — `"use client"`. Props `{ variant?: "button" | "icon" }`. Uses `useRouter` and `useCurrentMonthWeek`. On click: build the candidate pool as plants whose `collectionWindows` include the current month; **if that pool has fewer than 3 entries, fall back to all plants**. Pick with `Math.random()` **inside the click handler only** — never during render, which would break hydration. Then `router.push('/plants/' + pick.id)`. Show a 400 ms shuffle affirmation before navigating: swap the label to the names of 5 random plants at 80 ms intervals, then navigate — cheap, and it communicates "this is a dice roll". Respect `window.matchMedia("(prefers-reduced-motion: reduce)")` by skipping straight to the push.
- [ ] **Step 17.2:** Mount it in the nav as an icon button (`Shuffle` from lucide-react, `rounded-full bg-surface p-2.5 shadow-card`, `aria-label="Feeling lucky — open a random plant"`), and in the home hero CTA row as a labelled `.btn-ghost`. On the detail page footer add the same control labelled "Another plant" so lateral browsing never dead-ends.
- [ ] **Step 17.3:** Add a global keyboard shortcut: pressing `r` (when no input/textarea is focused) triggers the same action. Register it in `FeelingLucky` with a `useEffect` keydown listener guarded by `document.activeElement` tag check. Document it in the nav tooltip as `Press R`.
- [ ] **Step 17.4:** Click it 10 times in dev — must land on 10 different plant pages, all in season (July → expect summer-window plants). Verify no hydration warning. Commit `feat: feeling lucky`.

### Task 18: Related species

Botanic Atlas's "other images of this specimen" slot is a dead end (same taxon only). The same UI slot pointed at *related* plants turns the guide into a browsable graph.

**Files:**
- Create: `src/lib/related.ts`, `src/components/RelatedPlants.tsx`
- Modify: `src/app/plants/[id]/page.tsx`
- Test: `src/lib/__tests__/related.test.ts`

- [ ] **Step 18.1: Write the failing test**

```ts
// src/lib/__tests__/related.test.ts
import { describe, expect, it } from "vitest";
import { plants } from "@/data/plants";
import { relatedPlants } from "@/lib/related";

describe("relatedPlants", () => {
  it("returns up to 4 others, never the plant itself", () => {
    for (const plant of plants) {
      const related = relatedPlants(plant, plants, 4);
      expect(related.length).toBeGreaterThan(0);
      expect(related.length).toBeLessThanOrEqual(4);
      expect(related.map((r) => r.id)).not.toContain(plant.id);
      expect(new Set(related.map((r) => r.id)).size).toBe(related.length);
    }
  });

  it("ranks same-family plants above unrelated ones", () => {
    const maple = plants.find((p) => p.id === "red-maple")!;
    const sameFamily = plants.filter((p) => p.id !== maple.id && p.family === maple.family);
    if (sameFamily.length > 0) {
      expect(relatedPlants(maple, plants, 4)[0].family).toBe(maple.family);
    }
  });

  it("is deterministic", () => {
    const a = relatedPlants(plants[0], plants, 4).map((p) => p.id);
    const b = relatedPlants(plants[0], plants, 4).map((p) => p.id);
    expect(a).toEqual(b);
  });
});
```

- [ ] **Step 18.2: Implement**

```ts
// src/lib/related.ts
import { Plant } from "@/data/plants";

/** Deterministic similarity: shared family > shared habitat > shared season > same category. */
export function relatedPlants(plant: Plant, all: Plant[], limit = 4): Plant[] {
  const months = new Set(plant.collectionWindows.map((w) => w.month));
  const habitats = new Set(plant.habitat);

  return all
    .filter((candidate) => candidate.id !== plant.id)
    .map((candidate) => {
      let score = 0;
      if (candidate.family === plant.family) score += 10;
      score += candidate.habitat.filter((h) => habitats.has(h)).length * 4;
      score += candidate.collectionWindows.filter((w) => months.has(w.month)).length * 2;
      if (candidate.category === plant.category) score += 3;
      if (candidate.nativeStatus === plant.nativeStatus) score += 1;
      return { candidate, score };
    })
    .sort((a, b) =>
      b.score - a.score || a.candidate.commonName.localeCompare(b.candidate.commonName)
    )
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}
```

- [ ] **Step 18.3:** `RelatedPlants.tsx` — section header `section-label` "Nearby in the guide" + `h2 text-lg font-semibold tracking-tight`; a 2/4-column grid of compact cards (image thumb `aspect-square rounded-tile`, common name `text-sm font-medium`, `sci-name text-xs text-text-soft`), each with a one-word reason chip explaining the link (`Same family` / `Same habitat` / `Same season`) — derive the reason from the highest-contributing term. Mount above the footer nav on the detail page. `npm test` → PASS. Commit `feat: related species navigation`.

### Task 19: Specimen wall — the browse-everything surface

Botanic Atlas's country grid is alphabetical-only across thousands of items. At 65 we can render every specimen at once and let people re-sort the whole wall — including by colour, which GA&C ships only as a separate tool.

**Files:**
- Create: `src/app/wall/page.tsx`, `src/components/SpecimenWall.tsx`, `src/components/Lightbox.tsx`
- Modify: `src/components/Navigation.tsx` (add "Wall" link)

- [ ] **Step 19.1:** `SpecimenWall` — `"use client"`. Renders all 65 as a dense image mosaic (`grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2`), each tile `aspect-square rounded-tile overflow-hidden` with the common name revealed on hover/focus as a bottom gradient caption. A sort control (pill group, same styling as the browse toolbar) with four modes: **Colour** (sort by `imageMeta[id].hue` — the visually striking default), **Family**, **Season** (earliest collection month), **Name**. Sorting animates via CSS `transition` on a CSS-grid reorder; if that proves jumpy, fall back to sorting without animation rather than adding a layout library.
- [ ] **Step 19.2:** Big count in the accent colour above the wall: `{filtered.length}` at `text-6xl font-semibold text-moss` beside stacked `species / in the atlas` at `text-sm text-text-soft` — the one Botanic Atlas pattern that is honest at this scale.
- [ ] **Step 19.3:** `Lightbox.tsx` — click any tile to open a full-screen overlay: `fixed inset-0 z-[100] bg-ink/92 backdrop-blur-sm grid place-items-center`, image `object-contain max-h-[85vh]`, caption bar with common + scientific name, an "Open full record" link to the detail page, and the photo credit. Close on click-anywhere, `Escape`, or the close button; trap focus while open and restore it on close; lock body scroll. **Deliberately not deep zoom** — one large image is the right cost/benefit at this scale.
- [ ] **Step 19.4:** Verify: wall renders 65 tiles, colour sort visibly groups greens/whites/yellows, lightbox keyboard-closes, mobile shows 2 columns without horizontal scroll. Commit `feat: specimen wall with colour sort and lightbox`.

### Task 20: Instant autocomplete search

Botanic Atlas has **no autocomplete** (verified: no `role="listbox"`, no `aria-autocomplete`) because it queries a vector service over 450,000 records. Our whole index is ~50 KB in the bundle, so this is where we straightforwardly beat the reference.

**Files:**
- Create: `src/components/SearchAutocomplete.tsx`
- Modify: `src/components/Navigation.tsx`, `src/components/SearchBar.tsx`

- [ ] **Step 20.1:** `SearchAutocomplete` — `"use client"`, reuses the existing `filterPlants` scorer from `src/lib/plantDiscovery.ts` (no new ranking logic). Shows the top 6 matches in a `.card` dropdown: thumbnail, common name with the matched substring wrapped in `<mark className="bg-sprout/50 text-inherit">`, `sci-name` line, and a right-aligned family. A final row "See all N results" pushes to `/plants?q=`.
- [ ] **Step 20.2:** Full keyboard support and correct ARIA: input gets `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`; list gets `role="listbox"`, items `role="option"`. `ArrowDown`/`ArrowUp` move the active option, `Enter` opens it, `Escape` closes and restores the raw query, `Tab` closes. Mouse hover sets the active option too.
- [ ] **Step 20.3:** Wire into the nav search overlay and the browse-page SearchBar. On mobile the nav search opens as a full-screen sheet (Botanic Atlas's own pattern below 1000px) with the input autofocused. Commit `feat: instant autocomplete search`.

### Task 21: Life list — "Tiny Worlds **Collectibles**"

The site is literally named for collecting; there is currently nothing to collect. A localStorage life list needs no account, no backend, and keeps working forever.

**Files:**
- Create: `src/lib/lifeList.ts`, `src/components/CollectButton.tsx`, `src/components/LifeListSummary.tsx`, `src/app/my-atlas/page.tsx`
- Modify: `src/components/PlantCard.tsx`, `src/app/plants/[id]/page.tsx`, `src/components/Navigation.tsx`
- Test: `src/lib/__tests__/lifeList.test.ts`

- [ ] **Step 21.1: Write the failing test** (pure logic only — the storage layer is injected so it is testable without a DOM):

```ts
// src/lib/__tests__/lifeList.test.ts
import { describe, expect, it } from "vitest";
import { addEntry, removeEntry, parseLifeList, serializeLifeList } from "@/lib/lifeList";

describe("life list", () => {
  it("round-trips through serialize/parse", () => {
    const list = addEntry({}, "red-maple", "2026-07-28");
    expect(parseLifeList(serializeLifeList(list))).toEqual(list);
  });

  it("keeps the first-found date when re-adding", () => {
    const first = addEntry({}, "red-maple", "2026-07-28");
    const again = addEntry(first, "red-maple", "2026-08-01");
    expect(again["red-maple"].foundOn).toBe("2026-07-28");
  });

  it("removes entries and tolerates unknown ids", () => {
    const list = addEntry({}, "red-maple", "2026-07-28");
    expect(removeEntry(list, "red-maple")).toEqual({});
    expect(removeEntry(list, "nonexistent")).toEqual(list);
  });

  it("parses malformed storage into an empty list instead of throwing", () => {
    expect(parseLifeList("not json")).toEqual({});
    expect(parseLifeList(null)).toEqual({});
    expect(parseLifeList('{"bad": 123}')).toEqual({});
  });
});
```

- [ ] **Step 21.2: Implement** `src/lib/lifeList.ts` with `export interface LifeListEntry { foundOn: string }`, `export type LifeList = Record<string, LifeListEntry>`, plus the four pure functions above (`parseLifeList` validating that each value is an object with a string `foundOn`, dropping anything else), and a `useLifeList()` client hook that reads `localStorage.getItem("tiny-worlds-life-list")` **in an effect** (never during render — same hydration rule as Task 1), writes on change, and syncs across tabs via the `storage` event.
- [ ] **Step 21.3:** `CollectButton` — a pill toggle: unfound = `.btn-ghost` with a `Circle` icon and label "Mark as found"; found = `bg-moss text-white` with `CircleCheck` and "Found {date}". Place it on the detail page under the title block, and as a small corner toggle on PlantCard (stopPropagation so it does not navigate). Renders a neutral placeholder until the hook resolves, so SSG output stays stable.
- [ ] **Step 21.4:** `/my-atlas` page: progress ring or bar `{found}/65`, a grid of found plants sorted by date found, a "still to find" section filtered to what is in season now (this is the killer combination — it tells a student what to go look for this afternoon), and Export/Import buttons that download and read back a JSON file so a student can move their list between devices or hand it in.
- [ ] **Step 21.5:** `LifeListSummary` in the nav: a small `{n}` badge on a "My atlas" link. Verify: mark 3 plants → count updates → reload page → still there → export produces valid JSON → clear storage → import restores. Commit `feat: life list`.

### Task 22: Guided identification

A guided key is what makes a field guide usable by someone who does not already know the answer. Ours uses **only fields that already exist** in `plants.ts` — no new botanical claims are authored, so there is no fabrication risk.

**Files:**
- Create: `src/app/identify/page.tsx`, `src/components/IdentifyWizard.tsx`, `src/lib/identify.ts`
- Test: `src/lib/__tests__/identify.test.ts`

- [ ] **Step 22.1: Write the failing test**

```ts
// src/lib/__tests__/identify.test.ts
import { describe, expect, it } from "vitest";
import { plants } from "@/data/plants";
import { applyAnswers, nextQuestion, IDENTIFY_QUESTIONS } from "@/lib/identify";

describe("identify wizard", () => {
  it("no answers means every plant is still a candidate", () => {
    expect(applyAnswers(plants, {})).toHaveLength(plants.length);
  });

  it("each question strictly narrows or preserves the candidate set", () => {
    for (const question of IDENTIFY_QUESTIONS) {
      for (const option of question.options) {
        const narrowed = applyAnswers(plants, { [question.key]: option.value });
        expect(narrowed.length).toBeLessThanOrEqual(plants.length);
      }
    }
  });

  it("stops asking once candidates are few or questions run out", () => {
    const answers = Object.fromEntries(
      IDENTIFY_QUESTIONS.map((q) => [q.key, q.options[0].value])
    );
    expect(nextQuestion(plants, answers)).toBeNull();
  });

  it("picks the question that best splits the current candidates", () => {
    const question = nextQuestion(plants, {});
    expect(question).not.toBeNull();
    expect(IDENTIFY_QUESTIONS.map((q) => q.key)).toContain(question!.key);
  });
});
```

- [ ] **Step 22.2: Implement `src/lib/identify.ts`.** Define `IDENTIFY_QUESTIONS` as an array of `{ key, prompt, options: { value, label, hint? }[], match: (plant, value) => boolean }` covering exactly these existing fields: growth form (`category`), where you are standing (`habitat`), what month it is (derived from `collectionWindows`, prefilled from `useCurrentMonthWeek`), and how common it is (`abundance`). `applyAnswers(plants, answers)` filters by every answered key. `nextQuestion(plants, answers)` returns the unanswered question whose options split the current candidate set most evenly (maximise `1 - Σ(pᵢ²)`, i.e. Gini impurity of the partition), and returns `null` when candidates ≤ 3 or all questions are answered — so the wizard is adaptive rather than a fixed script.
- [ ] **Step 22.3:** `IdentifyWizard` — one question per screen, big tappable option cards (`card card-hover p-5 text-left`), a live "{n} plants still match" counter that animates with the same `useAnimatedNumber` helper from Task 10.5 (extract it into `src/lib/useAnimatedNumber.ts` during this task and update the RadiusExplorer import), a back button, and a "Start over" reset. When `nextQuestion` returns null, show the remaining candidates as PlantCards. Prefill the month answer from `useCurrentMonthWeek` and let the user override it.
- [ ] **Step 22.4:** Verify: from a cold start, four answers reduce 65 to a handful; the counter animates; back/reset work; the month prefill matches today. `npm test` → PASS. Commit `feat: guided identification wizard`.

### Task 23: Live field conditions + campus ground truth

Two small, verified, no-key additions that make the guide feel connected to the actual place.

**Files:**
- Create: `src/components/FieldConditions.tsx`, `src/data/campusSoil.json`
- Modify: `src/app/page.tsx` or `src/app/map/page.tsx` (place the widget once), `src/app/habitats/page.tsx`

- [ ] **Step 23.1: NOAA current conditions (runtime).** `FieldConditions` is `"use client"`, fetches on mount: `https://api.weather.gov/points/42.3075,-71.5235` → read `properties.forecast` → fetch that URL → take `properties.periods[0]`. Render `{temperature}°{temperatureUnit}`, `shortForecast`, and the period `name` in a compact `.card` strip with a `Cloud`/`Sun` lucide icon. **Chosen over Open-Meteo deliberately**: both are no-key with `access-control-allow-origin: *`, but NWS data is US-government public domain with no attribution requirement and no non-commercial clause, whereas Open-Meteo's free tier is non-commercial-only and requires a credit line. Render nothing (not an error) if either fetch fails — a weather widget must never break a field guide. Include `User-Agent`-equivalent identification via the `Accept` header and document the NWS policy in a comment.
- [ ] **Step 23.2: Campus soil (baked once).** Query the USDA Soil Data Access REST endpoint once, by hand, and commit the result:

```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"format":"JSON+COLUMNNAME","query":"SELECT TOP 5 mu.mukey, mu.muname, c.compname, c.taxclname, c.drainagecl FROM SDA_Get_Mukey_from_intersection_with_WktWgs84(''point(-71.5235 42.3075)'') AS m INNER JOIN mapunit mu ON mu.mukey=m.mukey INNER JOIN component c ON c.mukey=mu.mukey ORDER BY c.comppct_r DESC"}' \
  https://sdmdataaccess.sc.egov.usda.gov/Tabular/post.rest
```

(Verified working, CORS-enabled, no key; returns `Merrimac fine sandy loam, 3 to 8 percent slopes / Somewhat excessively drained` for the campus point.) Save to `src/data/campusSoil.json` with a `source` and `retrievedAt` field, and surface it on the habitats page as a "Ground truth" card: soil series, taxonomic class, drainage class, credited to USDA NRCS Soil Survey with the retrieval date.
- [ ] **Step 23.3:** Verify the weather widget renders live values and degrades silently when offline (DevTools offline → widget disappears, page intact). Commit `feat: live field conditions and campus soil data`.

### Task 24: Ship

- [ ] **Step 24.1:** Full green gate: `npm test && npm run build && npm run lint`; re-run the Task 12 verification sweep including the new routes `/wall`, `/identify`, `/my-atlas`.
- [ ] **Step 24.2:** `gh auth switch --user ikonkim2027-Korea` (repo owner account — per memory this account is Avery's, but the repo lives there; confirm with Kevin before pushing), push branch, open PR `redesign/atlas-v2 → main` with before/after screenshots.
- [ ] **Step 24.3:** After merge, Vercel auto-deploys; verify https://stmarks-flora.vercel.app shows v2 **and the correct live date** (hard-refresh + normal refresh to confirm the v3 service-worker update path works), and that `/wall`, `/identify`, `/my-atlas` are reachable. Switch gh auth back to KevinJSKim85.

---

## Explicitly rejected features

Recorded so they are not proposed again. Each was tested, not assumed.

| Feature | Why not |
|---|---|
| **Pollen forecast** | Open-Meteo's pollen comes from CAMS Europe. Verified side-by-side: Southborough MA returns `0/24` non-null hours, Berlin returns `24/24`. Every US pollen API (Google, Ambee) requires a server-side key. |
| **Photo-based plant ID** | Pl@ntNet, Plant.id, and iNaturalist CV all returned `401` without a key. A key in client JS on a static site is public. Would require a Vercel Edge Function — a deliberate architecture change, not a slip-in. |
| **SoilGrids (ISRIC) soil chemistry** | Returns `{"mean": null}` at the campus coordinates — a genuine coverage hole, confirmed by offset sampling. USDA SDA is strictly better and works. |
| **POWO / Kew name resolution** | `HTTP 403` behind a Cloudflare challenge; the endpoint is undocumented and reverse-engineered. GBIF covers this. |
| **Wikidata SPARQL** | 60-second query timeout and repeated capacity problems; adds nothing over GBIF + Wikipedia. |
| **USA-NPN phenology** | Returned `504` and a 60-second timeout on the same endpoint across two attempts, and covers only ~1,600 species. iNaturalist gives better coverage and uptime. |
| **Deep zoom (OpenSeadragon-style) on specimens** | Botanic Atlas itself skipped it in favour of a plain lightbox; at one 1600px image per plant, tiling is all cost and no benefit. |
| **World/country map browse** | Botanic Atlas's primary navigation, but it exists to organise 30,000 species across 200 countries. Our 65 plants live inside one 1 km circle — the radius explorer is the correct spatial metaphor at this scale. |

---

## Acceptance criteria

**Correctness**
1. Live site hero shows the real current month/week (not the build date) — verified on production after deploy.
2. `npm test` (≈25 tests: 3 existing + 2 monthWeek + 5 radius + 1 window-invariant + 3 enrichment + 3 images + 3 related + 4 lifeList + 4 identify), `npm run build`, `npm run lint` all pass; every route remains statically prerendered.
3. Nav search navigates client-side (no document reload).
4. Service worker at `-v3` serves the new version after one normal refresh.

**Design**
5. Step 12.3 legacy-vocabulary grep returns zero matches.
6. All routes visually conform to the v2 token system at 1280px and 375px with no console hydration warnings.

**Exploration**
7. `/map` radius explorer: centre locked to St. Mark's; radius adjustable by edge-handle drag (mouse + touch) and slider; species/zone counts animate as zones enter and leave; out-of-radius zones visibly dim; map tiles do not re-render on radius change.
8. Feeling Lucky lands on 10 different in-season plants across 10 clicks, from the nav, the hero, the detail footer, and the `R` key.
9. `/wall` renders all 65 specimens, colour sort visibly groups by hue, lightbox closes on Escape with focus restored.
10. Autocomplete exposes correct combobox ARIA and is fully keyboard-operable.
11. `/identify` narrows 65 to ≤ 5 candidates within four adaptive questions.
12. Life list survives reload, syncs across tabs, and round-trips through export/import.

**Data integrity**
13. Every plant has a committed enrichment record; any GBIF `SYNONYM` carries its accepted name and is surfaced in the UI.
14. Every plant image is local, exists on disk, and displays licence + attribution.
15. Detail pages load with **zero third-party requests**; the only runtime external calls in the whole site are NOAA current conditions and GBIF map tiles, and both fail silently.
16. Offline check passes: with the network disabled, a cached detail page renders **including its image**.

## Risks & mitigations

- **Month/week UI flash (null → value) on load** → skeleton `–` placeholder is styled intentionally; acceptable for a field guide.
- **Client components importing `plants` data grow the JS bundle** → data is already client-imported by BrowseContent today. Gate: first-load JS for `/` stays under 200 kB in the build output; if the wall or identify pages exceed it, split the image metadata out of the plant records.
- **Tailwind v4 token rename breaks stragglers** → Step 3.3 grep worklist + Step 12.3 zero-check are the gates.
- **Next 16 API drift vs training data** → Task 0 doc check before coding (AGENTS.md requirement).
- **Enrichment script partially fails on a future run** → every fetch is individually try/caught, failures keep the previously committed value, and the script exits 0. The committed JSON is the source of truth, not the network.
- **iNaturalist rate limit (published: 100/min, 10,000/day)** → the script is sequential with 1 s sleeps, so a full 65-plant bake is ~260 requests over ~4 minutes. Never wired into `next build`.
- **Third-party licence obligations** → Wikimedia images carry per-file attribution (Task 15.6); iNaturalist and GBIF are credited in the phenology footnote (Task 16.2); NOAA is public domain, which is exactly why it was chosen over Open-Meteo for runtime.
- **Image download bloats the repo** → stored copies capped at 1600px/q82, whole set targeted under 25 MB; check `du -sh public/plants` before committing.
- **Feature scope is large (25 tasks)** → Phases 1–4 are independently shippable. If time runs short, ship after Task 12 and treat Phases 5–6 as a second PR.
- **Wrong GitHub account on push** → explicit `gh auth switch` steps both directions (Task 24).
