# ERS Mockup — Project Instructions

Read this at the start of every session. It carries the decisions already made, so they
are not relitigated.

---

## What this project is

A complete, clickable front-end mockup of ERS (Executive Review System), a daily operating
dashboard for Harley-Davidson dealerships built by Revolution Motorsports on Talon data.

The mockup is **the specification**. The development team builds exactly what they are
given — when they were sent a Store Overview mockup they reproduced it pixel for pixel,
including choices that were meant as suggestions. Treat every detail as something that
will ship.

**Seth Cooke** runs this and is transitioning out within months. Everything produced here
must be handoff-ready: assume the reader is **Logan** six months from now, not Seth today.
Seth is not a developer. Explain technical terms in plain language on first use.

---

## Hard rules

1. **Every figure on a page must reconcile with every other figure on that page.** The
   deal list totals equal the KPI table, which equals the ribbon. F&I total back end
   equals the deal list's back-end column. If a number moves and a tie breaks, one of
   them is wrong. This is not decoration — it is the product's entire trust argument.
2. **Display, don't calculate, wherever possible.** Sales and gross profit are read from
   the Talon income statement so they cannot disagree with the dealer's own month-end
   packet. Only ratios, projections and comparisons are calculated by ERS.
3. **Every row declares its source** with a small tag beside the label:
   - `statement` — read from the Talon income statement
   - `counted` — unit, deal or invoice records; not dollars
   - `entered` — dealer or CRM entered
   - `derived` — ERS arithmetic on the above. **The only band where a formula can be
     wrong**, and the only band needing an equation in the formula specification.
4. **Never show a zero where there is no value.** An em-dash means "no goal set" or "not
   available". A zero means "this happened zero times" — a different and worse claim.
5. **Sample data is never typed into a page.** It lives in `/data` as its own file and the
   page reads from it. This draws the seam between front end and back end for the
   developers.

---

## Time tabs — identical on every KPI/summary table that has them

Three tabs, in this order:

| Tab | Shows |
|---|---|
| **MTD** (default) | Month to date, plus Projected month-end |
| **vs. Last Month** | Month to date, plus the complete prior month and % of that month |
| **vs. Last Year** | Month to date, plus the complete same month last year and % of that month |

- **Month to date is never a tab. Its columns are always on screen.** The tab controls only
  the block to the right of it.
- **That block is one slot, not additive.** On the MTD tab it holds Projected month-end.
  Switching tabs *replaces* that slot with the prior-period figure — it never adds columns
  per segment, so a table's column count stays essentially flat across tabs rather than
  doubling. **One exception, deliberate:** on a table with segment columns (New / Used /
  New + Used, e.g. Bike Sales' KPI table), the comparison tabs add exactly one trailing
  column — the pace judgment for the combined total only. Each segment still just swaps
  Projected for its own prior-period figure; showing that same pace signal separately for
  every segment would put the table right back at the width this layout exists to avoid.
- **No Day column on a KPI/summary table.** Getting accurate day-of data reliably was more
  complexity than the near-term scope of the project can absorb — decided with Logan,
  September 2026. Applies to KPI/summary tables only.
- **Record-level tables are the exception, and keep a Day option.** Where each row is an
  individual dated record — a deal, a repair order, a rep's day — the table may still offer
  a Day / month-to-date **scope** toggle on that same list. The date there is data on the
  row, not a comparison basis on an aggregated metric, so the complexity problem above
  doesn't apply. Bike Sales' Per Deal table, Parts' and Motorclothes' Counter Sales tables,
  and Service's Closed ROs table are this case — leave them as built.
- **Financial Statements carries no time tabs at all — the one table type this section
  doesn't apply to.** A financial statement only exists for a closed month; there is no
  "August as of day 10" to show, and no projection belongs on a document submitted as-is
  to Harley. That tab shows Current (the most recently closed month) and complete Year to
  Date, always, one closed month behind whatever "today" is on every other tab. See
  Status, below.
- **Prior periods are complete months**, not the same days of them. The income statement
  export reports finished periods — there is no "August as of day 10" to read.
- `% of prior = month-to-date ÷ that whole month's figure`, read against the percentage of
  the period elapsed.
- **Ratio rows show a difference, not a percentage** — `+$115`, `−0.3 pts`. A margin at
  100% of last month is flat, not on pace.
- **Colour only where a judgment is possible.** Pace rows: green at +3 points or more, red
  at −3 or worse. Ratio differences: ±$25, ±0.3 pts.

---

## Projected month-end

```
Projected = MTD ÷ open days elapsed × total open days
```

- **MTD tab only.** On a comparison tab the reader is looking backwards and a forecast of
  the current month is clutter between the two periods.
- Applied to **units, sales and gross** only.
- **No projected margin, ever.** Both figures scale by the same factor, so a projected
  margin always equals the month-to-date margin. Ratio rows are recomputed from the
  projected rows above them, not projected directly. Confirmed with Logan as the intended
  method (straight pace, not units and dollars projected independently) — not an
  oversight to fix later.
- **Two day counts, deliberate. Do not reconcile them.**
  - *Display* — the accounting period as the page states it (e.g. 10 of 30). Drives the
    header, the progress bar and the comparison colour.
  - *Projection* — a **six-day trading week**, the Harley norm. September 2026 has 26 open
    days. Understates month-end on purpose.
  - The column heading must state the projection basis (`· 26 open days`) so the two
    counts are not read as an error.
- Long term this should come from a **per-store open-day calendar**; the seven stores will
  not all keep the same week.

---

## Table conventions already settled

- **Every table (or tightly related group of tables) sits in its own bordered, white
  card** — `.card` in `app.css`. This is what makes a page of several tables read as
  distinct reports instead of one long scroll. A table with few columns stretching to
  the full content width leaves a dead gap between its labels and its numbers, so give
  a narrow table's card a `max-width` (roughly 500&ndash;760px depending on column
  count) rather than letting it stretch — see any KPI/summary table on Bike Sales,
  Parts Sales, Motorclothes or Service for the pattern. A wide table (Per Deal, Counter
  Sales, Closed ROs) needs no `max-width`; its own column count already fills the card.
  Two tables that are cause-and-effect of each other (Bike Sales' F&amp;I Deal Charges
  and the Counts table built from it) share one card rather than each getting their own.
- **A true grand total gets a double rule and an accent-coloured edge** — the shared
  `.tot` class in `app.css`. This is on top of, not instead of, the plain single-rule
  bold `.totrow` used for a lesser subtotal, so the actual bottom line of a table stays
  visually distinct from a subtotal partway through it. Excluded automatically when
  `.tot` is combined with `.band` (a mini header borrowing `.tot`'s bold weight, not an
  actual total — see Bike Sales' F&amp;I PPV sub-header row).
- **The KPI ribbon and the progress bar are one card, not two strips** — `.headline` and
  `.progress` in `app.css` already render this way; do not split them apart on a new
  page.
- **Segment blocks.** Where a table has segments (New / Used / New + Used), they are
  normally stacked blocks with a band header, not columns — the total block last, dark
  band, bold. **Bike Sales' KPI table is the deliberate exception:** segments are column
  groups instead, so New and Used read on one line — the comparison a sales manager
  actually makes every day — and five rows fit on screen instead of fifteen. See Time
  tabs, above, for how that table keeps its column count sane under the comparison tabs.
  Default to stacked blocks unless a table has the same reason not to.
- **Row order follows the derivation chain.** Units, then dollars, then gross profit, then
  the ratios built from them — so a derived figure sits directly under its own inputs and a
  dealer can check it without leaving the screen.
- **Grouped column headers** where a table has more than one measure per period.
- **Cross-store ranking does not exist on a single-store tab.** Benchmarking is Phase 2,
  consent-gated, and suppressed below three or four contributing stores. Design the empty
  state before the feature.
- **Long lists** get a six-row window that scrolls, with headings and totals pinned, plus a
  Show all toggle. Totals always reflect the filters, never what is on screen. This is for
  a **growing record list** (deals, reps, ROs) — it doesn't apply to a financial statement's
  fixed line count. Financial Statements shows every line, unwindowed, on purpose: the
  point is a document that reads as a complete statement, not a dashboard.

---

## Notes on the page

Two audiences, two documents. Do not mix them.

- **On the page:** only what a developer needs while writing code — formulas, column rules,
  colour thresholds, anything they would otherwise get wrong. Short bullets. The Bike Sales
  mockup runs about 270 words of notes across three boxes; that is the ceiling, not a target.
- **In `OPEN_QUESTIONS.md`:** definitions and data sources that need Logan's answer. These
  block the spec, not the build.
- Every page carries a **Hide notes** toggle so the tables can be read clean.

---

## Design system

Defined once in `/styles/tokens.css` and never redefined per page.

```
--paper #FBFAF8   --ink #17181A    --ink-mid #5A5F66   --ink-low #9BA0A7
--rule  #E4E3DF   --rule-hard #C9C8C3
--accent #D9541F  --accent-soft #FAEDE7
--up #2C6E4C      --down #B23A2B
Display: Barlow Condensed 600/700, uppercase, letterspaced — headings and table headers
Body:    Inter — labels and prose
Mono:    IBM Plex Mono — every number, always
```

Base body text 13px. Table rows 11.5px mono, 4px vertical padding. Keep it compact — an
earlier version was rescaled down 15% because a fifteen-row table would not fit one screen.

---

## File layout

```
/index.html            redirects to the default tab (Store Overview)
/pages/                one file per tab
/styles/tokens.css     the design system above
/styles/app.css        shared layout and table styles
/data/*.json           all sample figures, per store and period
/scripts/nav.js        shared sidebar, generated once per page from one nav list
/scripts/format.js     shared number formatting (money, commas, percentages)
README.md              entry point for developers implementing this
CLAUDE.md              this file
```

Table rendering itself is still per-page, not shared — each tab's KPI/record logic lives
in its own `<script>` block. Extracting a shared renderer waits until enough tabs exist to
show what's actually common, per Hard Rule discipline elsewhere in this file; forcing one
early risked baking in the wrong abstraction. `OPEN_QUESTIONS.md`, referenced under Notes
on the page below, doesn't exist yet — deemed mostly redundant with the questions already
flagged inline on each page, but the file layout leaves room for it if that changes.

---

## Status

**Done, and built:** Store Overview (with Department Detail), Scorecards (cross-store,
month-to-date only), Bike Sales, Parts Sales, Motorclothes, Service. Shared kit (nav,
styles, number formatting) in place across all of them. The Day column is gone from every
KPI/summary table on all of them — Bike Sales' KPI table is also rebuilt to the
segment-column layout described in Time tabs, above. MTD is the default tab everywhere
this applies. Record-level tables (Per Deal, Counter Sales on Parts and Motorclothes,
Closed ROs) are the deliberate exception and keep their Day scope.

**Also done, v1: Financial Statements** — Balance Sheet and Income Statement, full
line-item fidelity, modeled on the workbook Logan uses to turn a Talon chart-of-accounts
export into the statements dealers report to Harley. That workbook was a reference for
correct statement shape only, never a data source or dependency for this tab. No time
tabs — see the exception carved out in Time tabs, above. Sample figures are Emerald
Coast's real August 2026 closed-month statement, and the Balance Sheet balances / the
Income Statement's department rows sum to its own stated total, both confirmed against
the source workbook.

**Also done: a product-polish pass on the shared kit**, September 2026 — `styles/tokens.css`,
`styles/app.css` and `scripts/nav.js` only. No page markup, no sample data, no formula or
column rule changed; the conventions above all still hold and still read the same. What
moved:

- **Tokens** carry a surface ramp (`--paper` / `--card` / `--sunken` / `--sunken-2`), a
  proper ink ramp including `--ink-faint`, three elevation steps, small radii, and a
  motion scale. Colour values in the design block above are unchanged — `--accent` is
  still `#D9541F`, and the judgment colours are still `--up` / `--down`.
- **Controls** share one language: `.btn` (with a `.primary` variant), `select.btn` with
  a drawn caret, `.chip` as a pill. Hover, active, `:focus-visible` (one accent ring,
  everywhere) and disabled states are all defined. `.chip[aria-pressed="true"]` still means
  "this toggle is on."
- **Tables** are unchanged in structure and convention — cards, `.tot` double rule,
  segment bands, `.src` source tags are all exactly as documented above. The source tag is
  now a real pill rather than loose monospace, so it reads as metadata. Numbers use
  `tabular-nums` so columns align optically as well as numerically.
- **The rail** marks unbuilt tabs with a "Soon" badge and makes them inert rather than a
  dead `#` link that bounces the reader to the top of the page. It also carries a small
  **Row sources** legend restating the four source tags from hard rule 3, so the
  vocabulary is on screen wherever a tagged row is.
- **Print.** "Print page" now actually prints, and `@media print` in `app.css` strips the
  rail, the controls and the developer notes, keeps table heads repeating, and stops cards
  breaking across pages — so what comes out is a clean report a dealer can hand over.
- **Reduced motion** is honoured globally; the transitions are polish, never information.

Anything in that pass that a developer would otherwise get wrong belongs in the
conventions above, not in a screenshot — the mockup is still the specification.

**Also done: a visual-consistency pass across every built tab**, September 2026 —
every table (or tightly related group of tables) now sits in its own bordered card,
narrow tables are capped to a sensible width instead of stretching full-bleed with a
dead gap between labels and numbers, the KPI ribbon and progress bar read as one panel
instead of two strips, and a true grand total carries a double rule and an accent edge
wherever `.tot` means an actual total. See Table conventions, above, for the settled
rules this left behind. Started on Financial Statements, then carried through Store
Overview, Scorecards, Bike Sales, Parts Sales, Motorclothes and Service — all seven
built tabs are now visually consistent with each other.

**Next:** per-department income statement detail (Bike Sales, Parts, Service,
Motorclothes) on the Financial Statements tab, once the two whole-dealership pages above
are validated — that detail has to reconcile line-for-line with those departments' own
tabs, so it's staged separately rather than built alongside v1. The garage composite
(consolidating multiple stores under one ownership entity) is explicitly **not** near-term
scope — dropped from consideration for now, September 2026.

**Not started:** CRM, Riding Academy, Maintenance.

**Not this project's job:** the Talon mapping, the formula specification, the acceptance
test. The mockup removes ambiguity about what to build. It does not make the numbers right.

---

## Repository

This mockup is real intellectual property — the formula specification expressed as a
working interface. It lives at `github.com/RevolutionMotorsportsLLC/ERS-Mockup`, a
Revolution-controlled GitHub organization with Seth and Logan as owners. Developers
(starting with Garon) hold **read-only** collaborator access on the repository itself —
this is the specification Seth and Logan control, not something the development team
edits directly.
