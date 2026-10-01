# ERS — Design Audit & Layout Proposal

**Status:** proposal only. Nothing here is implemented. This document exists so the next
agent can improve the information design without re-deriving the whole picture.

**Written after:** a full read of `CLAUDE.md`, all seven built tabs, all seven `/data/*.json`
files, and the shared kit (`styles/`, `scripts/`).

---

## 0. How to read this

Sections 1–3 are **audit** — what's true today, including the one finding that constrains
everything else. Sections 4–7 are **proposal**. Section 8 is the **order to do it in**.
Section 9 is **what must not break** — those are the mockup's trust conventions and they
are non-negotiable. Section 10 is **questions for Logan**, because several of these
proposals cannot be built until they are answered.

Where a proposal needs data that does not exist yet, it says so explicitly. Where it can be
built from data already in `/data`, it says that too. Confusing those two is how a spec
turns into a wishlist.

---

## 1. What this product is, and who reads it

ERS is a **daily operating dashboard** for Harley-Davidson dealerships, built on Talon data
by Revolution Motorsports. Seven stores. One reader that matters most: the **general
manager**, standing up, four minutes before a morning meeting.

That reader has one question:

> **Are we on plan, and what is broken?**

Everything below is judged against that question.

The current mockup answers a different question — *"what are the numbers?"* — and it
answers it extremely well. That is the gap. The numbers are correct, reconciled, and
sourced; they are also presented as 32 tables with no visual hierarchy of urgency.

---

## 2. Audit — what is on screen today

| Surface | Sections | Tables | Dev-note boxes |
|---|---|---|---|
| Store Overview | 2 | 2 | 5 |
| Scorecards | 6 | 6 | 3 |
| Financial Statements | 2 | 8 | 3 |
| Bike Sales | 6 | 6 | 7 |
| Parts Sales | 5 | 4 | 5 |
| Motorclothes | 3 | 2 | 5 |
| Service | 3 | 2 | 5 |
| **Total** | **27** | **32** | **33** |

**Charts, graphs, sparklines, sliders, gauges, any visual data representation: zero.**
Every figure is a cell in a table. A search for `svg|canvas|chart|sparkline|slider|gauge`
across pages, scripts and styles returns nothing but incidental prose matches.

### What the mockup is genuinely good at

These are not problems. A redesign that loses them loses the product.

- **Reconciliation.** Deal list totals equal the KPI table equal the headline ribbon. It is
  the entire trust argument and it currently holds.
- **Provenance on every row.** `statement` / `counted` / `entered` / `derived`. This is a
  better data contract than most production dashboards have. The `derived` band is the
  only one where a formula can be wrong, and the tags say so on screen.
- **Refusal to invent.** An em-dash means "no goal set". A zero means "this happened zero
  times". Those are different claims and the UI keeps them different.
- **The two day-counts are named.** Display basis (10 of 30) and projection basis (9 of 26,
  six-day trading week) are deliberately different and the column heading says so. This is
  subtle and correct.
- **Time tabs do not explode the column count.** The comparison block is one slot that gets
  replaced, not added to. That was a real design decision and it works.

### What is actually wrong

**a) No urgency hierarchy.** On Store Overview, "Total sales $2.4M" and "Repair orders 187"
have identical visual weight. The GM cannot see which number is on fire. Nothing on any
page is red unless a comparison happens to cross a ±3-point threshold.

**b) The reader must do the arithmetic.** To know if the store is on pace, the reader
compares MTD against a projection column against a prior-month percentage, in their head,
across seven department rows. That is the primary job of this product and it is delegated
to the user.

**c) Nothing is an exception; everything is an inventory.** 252 cross-store cells on
Scorecards. 193 rows on Financial Statements. 27 deals on Bike Sales. All shown with equal
completeness. A dashboard should show the eight things that need attention and let the rest
be reachable.

**d) The mockup banner costs prime real estate on every page.** It is important for
handoff and actively harmful for dogfooding the layout. It sits above the header on all
seven tabs.

**e) Dev notes compete with data.** 33 orange boxes interleaved with tables. There is a
Hide notes toggle; the default state is the noisy one.

**f) Cross-store comparison is the least legible surface and it is the one that most needs
to be visual.** Scorecards is 6 stacked tables of 7 rows × 5–7 columns. Finding "which
store is worst at parts obsolescence" requires reading 7 numbers and ranking them manually.

**g) Two data smells in sample data** (flag for the data team, not a UI issue):
- `bike-sales.json → transactions.missed` is **`-14`**. A count of missed opportunities is
  a positive quantity; a negative count is semantically wrong and will render as "−14
  missed", which reads as "negative missed".
- `bike-sales.json → inventory[0].style` is `"None"` (the string) and `fi.charges[0].den`
  is `null`. The em-dash rule says "never show a zero where there is no value" — these
  need to actually render as em-dashes, and today the string `"None"` will render as text.

---

## 3. The finding that shapes everything: there is no time series

**This is the single most important constraint in this document.**

Every dataset has exactly three comparison points:

```
kpi: { mtd: {...}, lastmonth: {...}, lastyear: {...} }
```

There is no per-day series anywhere. The only dated records are the 27 rows in
`bike-sales.json → deals[]`, and those are a deal log, not a daily aggregate.

**Consequence:** any proposal that draws a *trend line, sparkline, curve, moving average,
forecast band, or historical chart* cannot be built from the current data shape. It
requires a new data feed — `daily[]` or `byDate[]` series per metric — and that is a
back-end change, not a front-end one.

**What the three points DO support, very well:**

| Chart type | Works with 3 points? | Example |
|---|---|---|
| Bullet / goal chart | **Yes, ideal** | Actual vs pace vs prior |
| Bar (grouped or stacked) | **Yes** | New vs Used, this year vs last |
| Waterfall | **Yes** | Sales → Gross → Expenses → Net |
| Funnel | **Yes** | Greets → Sit-downs → Units |
| Heatmap / matrix | **Yes** | 7 stores × 36 metrics |
| Pareto (sorted bar) | **Yes** | F&I charges by value |
| Aging bucket stack | **Yes** | Inventory 0–6 / 6–12 / 12+ months |
| Donut / composition | **Yes** | Parts sales mix |
| Line / trend / sparkline | **No** | Needs a daily feed |
| Forecast curve | **No** | Needs a daily feed |

So the redesign should be **comparison-shaped, not trend-shaped**. That is not a
limitation to apologise for — a dealer runs the month against plan and against last year.
Three points is the right shape for that question. But it must be said clearly so nobody
promises a trend line the data cannot draw.

**If a daily feed is added later**, the natural first chart is a cumulative-actual-vs-pace
line with a projection fan. That is the single most valuable chart in retail operations and
it becomes possible the moment `byDate` exists. Worth building the feed for.

---

## 4. Proposal — charts, and what each one replaces

Ordered by impact. Each entry names the exact data it uses so nothing is invented.

### 4.1 The Pace Bullet — the hero chart

**Replaces:** the entire comparison-tab reading task on every KPI table.

A horizontal bullet per metric: the actual bar, a marker at "on-pace" (MTD ÷ open days
elapsed × total open days), and a tick at the prior period. Colour only where a judgment
is possible — that rule already exists and carries straight over.

```
Total sales   ████████████████░░░░░  $2.41M
              ▲ pace $2.67M   │ last yr $2.20M
```

**Data:** already present in every `kpi.mtd` / `kpi.lastmonth` / `kpi.lastyear` triple,
plus `openDays` and `projectionDays`.
**Why:** it makes the product's primary question answerable in one glance instead of three
columns of arithmetic. This alone is worth the redesign.
**Spec note:** the two day-counts must still be labelled. The bullet uses the *projection*
basis for the pace marker and the *display* basis for the elapsed context. Do not merge
them.

### 4.2 The Conversion Funnel — biggest buried insight

**Replaces:** seven flat numbers in Bike Sales' transactions table.

```
Greets     174  ████████████████████
Sit-downs   68  ████████              39% of greets
Units sold  28  ███                   41% of sit-downs
                                  16% overall
```

**Data:** `bike-sales.json → transactions.{greets, sitdowns, units}`. Already there.
**Why:** this is the sales floor's entire health in one shape, and today it is three
numbers buried among six. 16% greet-to-unit is a number a GM would act on.
**Also:** `missed` should appear as a callout beside it, not in the funnel — it is a count
of loss, not a stage.

### 4.3 Scorecards Heatmap — fix the least legible surface

**Replaces:** six stacked leaderboard tables.

A 7 (stores) × ~10 (chosen metrics) colour-scaled matrix. Rows are stores, columns are
metrics, cell colour is the metric's judgment colour against plan. Click a column header to
sort. Click a cell to jump to that store's department tab.

**Data:** `scorecards.json → stores[]`, 36 metrics × 7 stores = 252 cells. All present.
**Why:** ranking seven numbers manually is exactly what a visual should replace. This is
the cross-store tab and it currently has no visual at all.
**Design note:** do **not** colour all 36 metrics. Pick the 8–10 a GM acts on (unit sales,
gross, PPM, ESP, parts turns, obsolescence %, service productivity, missed opportunities)
and let the rest live behind a "show all metrics" toggle. Colouring 252 cells is noise.

### 4.4 Income Statement Waterfall

**Replaces:** reading 193 rows to find where profit went.

```
Sales      ████████████████████████  $8.4M
Gross      ████████████              $1.9M
Dept exp   ███████                   −$1.1M
Admin      ████                      −$0.6M
Net        ██                        $0.2M
```

**Data:** `financial-statements.json → incomeStatement.{salesAndGrossProfit,
departmentalExpenses, administrationExpense, summary}`. Already there.
**Why:** Financial Statements is the densest tab (8 tables, 193 rows) and its job is
"where did the money go". A waterfall answers that in one shape. The tables stay below it
as the printable document — they are the spec, the waterfall is the read.

### 4.5 Inventory Aging Stack

**Replaces:** three numbers on Parts Sales.

A single stacked bar: current / 6 months / 12+ months, with the aged share called out.

**Data:** `parts-sales.json → obsolescence.{totalInv, over6mo, over12mo}`. Already there.
**Why:** obsolescence is a cash problem and it currently reads as three unrelated figures.

### 4.6 F&I Pareto

**Replaces:** the F&I Deal Charges table's order.

Horizontal bars, sorted descending, with the cumulative line optional.

**Data:** `bike-sales.json → fi.charges[]` (11 rows, `v` and `u`). Already there.
**Why:** "where does back-end gross actually come from" is a ranking question, and a table
sorted alphabetically hides the ranking. Note `den: null` on Vehicles — that is the base
row and should be visually separated from the product rows above it.

### 4.7 Department Contribution Bars (Store Overview)

**Replaces:** nothing — this is additive.

One horizontal stacked bar showing each department's share of store sales and of store
gross, side by side. Service is 3% of sales and often 30% of gross; that inversion is the
most useful thing on the page and it is currently invisible.

**Data:** `store-overview.json → departments[]` with `s` (sales) and `g` (gross). Present.

### 4.8 Explicitly proposed NOT to build

- **Any line chart or sparkline.** No daily feed. See §3.
- **Pie/donut for anything over four categories.** The parts mix has seven sale types. Use
  a sorted bar.
- **3D, gauges with needles, radial charts.** Decorative. This is an instrument panel, not
  a brochure.
- **A chart for Financial Statements' Balance Sheet.** It is a document submitted as-is to
  Harley. It should look like a statement.

---

## 5. Interactive controls — what earns its place

### 5.1 A scenario slider (the one high-value slider)

> *"We are 14 units behind. What does closing them actually do to gross?"*

A single slider on the department tab: drag unit count, see gross and margin recompute,
with the pace line moving live.

**Why it is worth it:** it is the question a GM actually asks in the meeting, and today the
only way to answer it is mental arithmetic on a printed report.
**But — it creates a new calculation band.** `CLAUDE.md` is firm that only ratios,
projections and comparisons are calculated by ERS. A scenario is none of those; it is
speculation. It must be visually quarantined (dashed border, clearly labelled "Scenario —
not actual") and it must never write back or appear in print output.
**Data needed:** only what exists. Average gross per unit is derivable from `kpi.mtd`.
**Gate:** this needs Logan's sign-off before it is built, because it touches the
"display, don't calculate" rule. See §10.

### 5.2 Threshold chips (replaces static colour rules)

The ±3-point and ±$25 colour thresholds are hard-coded and documented. Make them
**settable per store** via small chips in the section header: `Strict · Standard · Loose`.
A small dealer and a large dealer do not have the same tolerance.

**Why:** turns a documented rule into a product setting instead of a hard-coded constant.
**Data:** no new data; a per-store preferences record.

### 5.3 Filter ranges on record lists

The Per Deal, Counter Sales and Closed ROs lists already have Day/MTD scope toggles and
sortable columns. Add a **gross threshold slider** and a **salesperson filter**.

**Data:** `deals[].be`, `deals[].sp` already exist.
**Why:** the only reason to scroll a deal list is "find me the bad ones". Filtering should
be the default posture.

### 5.4 What should NOT be a slider

- **Date range.** There is a date picker already; a range slider over 30 days is worse
  than a picker in every way.
- **The time tabs.** MTD / vs. Last Month / vs. Last Year is a three-state switch, not a
  continuum. Keep the segmented control.
- **Store selector.** Already a select. Do not make it a carousel.

### 5.5 Small interaction wins (low cost, high feel)

- Sticky table headers on every long table, not just `.tscroll`.
- Row hover shows the row's source tag at higher contrast — reinforces the data contract.
- Keyboard `←` `→` on the comparison tabs (they have `role="tablist"` already).
- "Show all" on every windowed list should also be reachable via keyboard and should
  announce state to screen readers.
- A one-line **empty state** for the unbuilt tabs instead of a dead "Soon" badge —
  "CRM arrives in Phase 2. Ask Logan for timing."

---

## 6. The data intake experience

This is the biggest unaddressed surface in the product, and it is invisible in the mockup.

### 6.1 What "intake" means here

The source tags already define the model. Every figure arrives one of four ways:

| Source | Path in | Who owns it | Failure mode |
|---|---|---|---|
| `statement` | Talon income statement export | Talon / nightly | Export missing or late |
| `counted` | unit, deal, invoice records | Talon | Records incomplete |
| `entered` | dealer or CRM | Store staff | Not entered, entered late |
| `derived` | ERS arithmetic | ERS | Formula wrong |

**The product currently has no surface that shows any of this.** The reader cannot tell
whether the numbers on screen are from this morning or three days stale.

### 6.2 Proposal: a Data Status strip

A compact strip at the foot of the rail (or a fifth admin tab, long term):

```
DATA STATUS                    Emerald Coast · Sep 2026
statement  ·  swept 06:12  ✓
counted    ·  swept 06:12  ✓
entered    ·  2 of 7 stores idle ⚠
derived    ·  recomputed 06:13  ✓
```

**Why:** a dashboard that cannot say "these numbers are 14 hours old" is not trustworthy,
and trust is this product's whole argument. This is cheap to build — the footer already
carries `sweepTime` and `throughDate` in `bike-sales.json → footer`.

### 6.3 Proposal: intake-by-exception

Do not show "all feeds healthy". Show the feeds that are **not**:

- A store whose `entered` data is missing reps' day entries
- A period whose `statement` export has not arrived
- A `derived` figure whose inputs changed since last sweep

A single amber banner: *"Parts Sales is showing August figures — September statement has
not swept."* That is worth more than any chart.

### 6.4 Proposal: make provenance filterable

The source tags are currently display-only. Make them **clickable**: click `statement` and
every statement-sourced row highlights. Click `derived` and every calculated row isolates.

**Why:** turns the existing trust convention into a working audit tool with zero new data.
This is the cheapest high-value interaction in this whole document.

---

## 7. Layout proposal — signal-first

### The problem with the current stack

```
mockbar (always on)      ← handoff noise, prime space
header + controls
KPI ribbon (5 equal tiles)  ← no hierarchy of urgency
progress bar
section:  gutter | [cards of tables]
section:  gutter | [cards of tables]
... 27 sections total
footer
```

Everything has equal weight. The reader scrolls to find the problem.

### Proposed stack

```
┌─ STATUS ─────────────────────────────────────────────┐
│ 3 need attention · Missed opps −14 · Parts obsolescence│  ← exceptions only
├─ HERO ───────────────────────────────────────────────┤
│  Total sales $2.41M    [Pace bullet]                  │  ← asymmetric, one lead
│  Gross $412K · Margin 17.1% · Units 19 · ROs 187      │  ← supporting, smaller
├─ PACE BAND ──────────────────────────────────────────┤
│  ████████████████░░░░░░  82% of pace · 10 of 30 days  │  ← the answer to "are we ok"
├─ READ ───────────────────────────────────────────────┤
│  [Funnel]        [Dept contribution]    [Aging]       │  ← 3 charts, one row
├─ DETAIL ─────────────────────────────────────────────┤
│  ▸ Departments table   ▸ Department detail            │  ← collapsed by default
│  ▸ Build notes (33 boxes — collapsed by default)      │
└──────────────────────────────────────────────────────┘
```

### The five rules that make it simple, clean and impactful

1. **One question per surface.** Bike Sales answers "is the floor converting?". Parts
   Sales answers "is inventory turning?". Service answers "are we billing the hours?".
   Every element on a page either serves that question or goes below the fold.

2. **Exceptions above, inventories below.** The top of the page shows only what needs
   action. Tables stay — they are the spec and the printable document — but they are
   reached, not led with.

3. **Asymmetric KPI weight.** One hero metric per page (the one that owns that page's
   question) at display size; the rest as a supporting row at half scale. Five equal tiles
   is the visual equivalent of raising your voice on every word.

4. **Colour is a judgment, not decoration.** Already a rule. Extend it: if nothing is
   wrong, nothing is coloured. A page with no red and no green is a healthy page, and the
   absence of colour becomes information.

5. **Notes are on tap, not on screen.** Default the 33 dev-note boxes to collapsed. The
   Hide notes toggle becomes Show notes. The spec is still there, still one click away,
   and the default read is clean. This is a one-line change to `nav.js` today.

### Per-page question mapping

| Page | The one question | Hero metric |
|---|---|---|
| Store Overview | Are we on plan for the month? | Total sales vs pace |
| Scorecards | Which store needs help? | Worst-metric-per-store row |
| Financial Statements | Where did the profit go? | Net profit vs prior |
| Bike Sales | Is the floor converting? | Greet → unit conversion |
| Parts Sales | Is inventory turning? | Turns / obsolescence % |
| Motorclothes | Is apparel moving? | Counter sales vs pace |
| Service | Are we billing the hours? | Labour sales vs pace |

---

## 8. Order of work

**Do first — high impact, no new data, low risk**

1. **Collapse dev notes by default.** One line in `nav.js`. Immediately improves every page.
2. **Make source tags clickable filters.** Turns existing trust convention into an audit tool.
3. **Pace bullets on the KPI tables.** The single biggest readability win. Pure front-end.
4. **Scorecards heatmap.** Fixes the worst surface. Pure front-end.
5. **Status strip / data freshness.** Data already in `footer.sweepTime`.

**Do next — needs the scenario band approved**

6. **Conversion funnel + aging stack + F&I Pareto.** Three small charts, all data-ready.
7. **Income statement waterfall.** Front-end only, Financial Statements only.
8. **Threshold chips.** Small settings surface.
9. **Scenario slider.** Only after §10 question 1 is answered.

**Do later — needs back-end**

10. **Daily `byDate` feed**, then the cumulative-actual-vs-pace line. This is the highest
    ceiling chart in the product and it is blocked entirely on data shape.
11. **Data Status tab** as a full surface (intake, freshness, per-store gaps).
12. **Intake-by-exception banners.**

---

## 9. Constraints that must not break

Carry these forward unchanged. They are the mockup's trust argument and the reason a
dealer believes the screen.

1. **Every figure reconciles with every other figure on the page.** Deal list totals equal
   the KPI table equal the ribbon. If a chart is added, its numbers must reconcile with the
   tables it replaces or sits beside.
2. **Every row keeps its source tag.** `statement` / `counted` / `entered` / `derived`.
   Charts derived from these rows must inherit and display provenance too.
3. **Never show a zero where there is no value.** Em-dash for "no goal set". This applies
   to chart axes and tooltips as much as table cells.
4. **Display, don't calculate, wherever possible.** Only ratios, projections and
   comparisons are calculated. Anything that speculates (scenarios) is a new band and must
   be visually quarantined.
5. **The two day-counts stay separate and stay labelled.** Display basis vs projection
   basis (six-day trading week). Any pace visual must state its basis.
6. **No projected margin.** It always equals month-to-date margin.
7. **Prior periods are complete months**, not the same days of them.
8. **Colour only where a judgment is possible.** ±3 points pace, ±$25 / ±0.3 pts ratios.
9. **Cross-store ranking is Phase 2 and consent-gated**, suppressed below three or four
   contributing stores. Design the empty state before the feature. A heatmap that colours
   two stores is not anonymised.
10. **Print output stays a clean document.** Charts must not break the printable statement.

---

## 10. Open questions — resolve before building

These block specific items above. They are not oversights.

1. **Are speculative calculations allowed at all?** The scenario slider (§5.1) violates the
   "display, don't calculate" rule as written. Either the rule gains a fifth band
   (`scenario`, visually quarantined, never printed) or the slider is dropped. **Logan.**
2. **What is `transactions.missed` supposed to be?** It is `-14` in sample data. A count of
   missed opportunities should be positive. Is it a net figure, a delta against a target,
   or an export bug? **Logan / data team.** Blocks the funnel callout in §4.2.
3. **Which 8–10 metrics actually drive the morning meeting?** The heatmap in §4.3 needs the
   short list. Guessing wrong makes the colour meaningless. **Logan.**
4. **Is a per-store open-day calendar coming?** The projection basis is currently a global
   six-day week. Seven stores will not keep the same week. Any pace visual inherits this.
   **Logan.**
5. **What are the colour thresholds per store?** §5.2 assumes they vary. If they are one
   global setting, the chips are unnecessary. **Logan.**
6. **Is `Pensacola` a real eighth store?** It appears in the live preview of Scorecards but
   not in the seven used everywhere else. Confirmed open in `scorecards.html`. **Logan.**
7. **Does the GM want exceptions pushed (email/SMS at 07:00) or pulled (this dashboard)?**
   Determines whether the Status strip (§6.2) is the primary surface or a secondary one.
   **Logan.**
8. **Sample data provenance.** Some figures are real (Financial Statements is Emerald
   Coast's real August 2026 closed month), some are fabricated but reconciled. Any chart
   built on them inherits that. Check the page's own mock banner before treating a number
   as real. **Already documented per page — carry forward.**

---

## 11. Note for whoever builds this

The mockup is **the specification**. The development team has a documented history of
reproducing it pixel for pixel, including things that were meant as suggestions. Anything
in this proposal that lands on a page becomes a requirement.

That is the reason this document separates "what the data supports today" from "what needs
a new feed" so explicitly, and the reason §9 is written as constraints rather than
preferences. If it is on a page, it ships.

Build the charts that the three comparison points already support (§4.1–4.7) before
promising anything that needs a daily feed (§3). The comparison-shaped charts are the
right shape for a dealer running the month against plan — that is not a consolation prize.
