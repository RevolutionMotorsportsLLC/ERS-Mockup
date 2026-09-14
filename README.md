# ERS Mockup

A complete, clickable front-end mockup of ERS (Executive Review System) — the daily
operating dashboard Revolution Motorsports is building for Harley-Davidson dealerships,
on top of Talon data.

**This mockup is the specification.** Every table, column, formula and piece of copy
here is meant to be built as shown. If
something looks wrong or ambiguous, ask before guessing — see "Open questions" below.

## Viewing it

The pages pull their sample numbers from JSON files at runtime, so they need to be
served over `http://`, not opened directly as files — double-clicking `index.html` won't
work, since browsers block that kind of file loading for security.

```bash
git clone https://github.com/RevolutionMotorsportsLLC/ERS-Mockup.git
cd ERS-Mockup
python3 -m http.server 8420
```

Then open `http://localhost:8420/` in a browser. That lands on Store Overview; the
sidebar links to every other page that's been built.

## What's built

| Page | File |
|---|---|
| Store Overview | `pages/store-overview.html` |
| Scorecards | `pages/scorecards.html` |
| Bike Sales | `pages/bike-sales.html` |
| Parts Sales | `pages/parts-sales.html` |
| Motorclothes | `pages/motorclothes.html` |
| Service | `pages/service.html` |

CRM, Riding Academy and Maintenance are still `#` links in the sidebar — not built yet,
not a bug. `CLAUDE.md`'s Status section is the canonical word on what's done and what's
next; this table is just quick orientation.

## Where things live

- `/pages/` — one HTML file per tab
- `/data/*.json` — every sample number on every page. This is the seam between front end
  and back end: build the real pages to read from real data shaped like this, and none of
  the sample figures here need to survive into production.
- `/styles/tokens.css`, `/styles/app.css` — the design system (colors, type, spacing,
  table conventions), shared by every page, defined once
- `/scripts/format.js`, `/scripts/nav.js` — shared number formatting and the site
  navigation, also shared by every page
- `CLAUDE.md` — the full set of design rules and conventions this mockup follows. Read
  this before implementing anything; it explains the *why* behind things like the source
  tags on every row and the two different day-counts used for projections.

## The two things most likely to trip you up

1. **Every row carries a source tag** — `statement`, `counted`, `entered`, or `derived`
   — next to its label. `derived` is the only band ERS itself calculates; everything
   else is a pass-through from Talon or another system. If you're about to write a
   formula for a row that isn't tagged `derived`, stop — that number should come from
   data, not a calculation.

2. **Projected month-end uses a six-day trading week on purpose**, not straight calendar
   days — see the "Projected month-end" note on any page that has one. This is
   deliberately different from what current live ERS does (which just divides by
   calendar days elapsed), and the difference is intentional, not a bug to reconcile
   away.

## Sample data — real vs. fabricated

Some pages' figures are pulled directly from a live export (called out in that page's
own mock banner, and usually in its build notes); the rest are fabricated but built to
reconcile internally — deal-list totals equal KPI tables equal the headline ribbon, and
so on. Check a page's mock banner and build notes before assuming a specific number is
real.

## Open questions

Formulas, data sources and missing reference material the mockup deliberately didn't
guess at are flagged inline, in the orange-bordered developer note boxes on the pages
that need them — usually under a "Not built yet," "Removed for now," or similar heading
in that page's Build Notes section, or named directly where it names Logan as the person
who needs to confirm something. These need an answer before the real formula spec can be
finalized — they're not oversights.

## Who to ask

Seth Cooke (seth@revmotorsports.com) owns this mockup; Logan has admin access to this
repository as well.
