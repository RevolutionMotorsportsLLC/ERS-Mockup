# OPEN QUESTIONS — for Logan

Definitions and data sources that need an answer before the specification can be
finalised. **These block the spec, not the build.** Per `CLAUDE.md`, questions live
here rather than being guessed at on a page.

Each item says what it blocks, so the cost of leaving it open is visible.

---

## 1. Are speculative calculations allowed at all?

**Blocks:** the scenario slider ("we are 14 units behind — what does closing them do to
gross?"), and any future what-if control.

`CLAUDE.md` hard rule 2 says *display, don't calculate, wherever possible* — only ratios,
projections and comparisons are calculated by ERS. A scenario is none of those; it is
speculation about a future that has not happened.

Two ways forward, and someone has to pick one:

- **(a)** Add a fifth source band, `scenario`, visually quarantined (dashed border,
  clearly labelled "Scenario — not actual"), never printed, never written back. The rule
  keeps its force because speculation cannot be mistaken for a figure.
- **(b)** Drop the slider entirely and leave the GM to do it on paper.

Leaving this open is why there is no slider anywhere in the mockup today.

---

## 2. What is `transactions.missed` supposed to be?

**Blocks:** the missed-opportunities callout on Bike Sales, and the "Missed" column of the
cross-store matrix.

In `data/bike-sales.json` it arrives as **`-14`**. A count of missed opportunities is a
positive quantity, so a negative count is semantically wrong and renders as "−14 missed",
which reads as "negative missed".

The row is tagged `entered` with `goal: 0` and `dir: 'zero'`, so the *judgment* is
unambiguous — missed opportunities should trend to zero, and any non-zero number is bad.
Only the sign is in question.

Likely readings, and one of them has to be confirmed:

- It is a count and the sign is an export bug → the figure should be `14`.
- It is a net figure against a target (e.g. 14 worse than a target of 28) → the label
  should say so, and the target should be shown.
- It is a delta against a prior period → it belongs in a comparison column, not in the
  value column.

**What the mockup does in the meantime:** prints the magnitude and marks the row with a
flag (`⚑`) that explains itself on hover. That is a display sanitisation, not a
calculation — no number is being invented, and the source value stays in the tooltip.

See `scripts/format.js` → `counted()`.

---

## 3. Is "Over 12 Months" nested inside "Over 6 Months"?

**Blocks:** a combined obsolescence bucket on Parts Sales.

`parts-sales.json → obsolescence` reports three figures: `totalInv`, `over6mo`, `over12mo`.
It does not state whether `over12mo` is a *subset* of `over6mo` (i.e. "over 6" really means
6–12) or a *separate* bucket (6–12 and 12+).

- If nested: within 6 months = `totalInv - over6mo`.
- If disjoint: within 6 months = `totalInv - over6mo - over12mo`.

Those two answers give different numbers, so the mockup does not calculate either. The
chart shows each threshold against total exactly as stated, and the table is unchanged.

---

## 4. Which metrics actually drive the morning meeting?

**Blocks:** the cross-store matrix on Scorecards is currently nine chosen metrics — units
sold, missed opportunities, back end per unit, PPM %, ESP %, new margin, parts gross
margin, parts obsolescence %, service productivity %. That shortlist is a guess.

Scorecards carries **36 metrics per store** (252 cells across seven stores). The matrix
shows nine. If the nine are the wrong nine, the colour of the page is meaningless.

What would settle it: the eight or ten numbers you actually discuss when the leadership
call happens.

---

## 5. Is a per-store open-day calendar coming?

**Blocks:** the accuracy of every pace visual.

Every projection uses a single **six-day trading week** (September 2026 = 26 open days),
deliberately understating month-end. `CLAUDE.md` already notes that long term this should
come from a per-store calendar, because the seven stores will not keep the same week.

The pace bullets, the progress bar and the projection column all inherit this. If the
calendar arrives, they change together.

---

## 6. Do colour thresholds vary by store?

**Blocks:** threshold chips.

`CLAUDE.md` fixes pace colour at ±3 points and ratio colour at ±$25 / ±0.3 pts. A proposal
exists to make those **settable per store** (Strict / Standard / Loose), on the grounds that
a small dealer and a large dealer do not have the same tolerance.

If there is one global setting, the chips are unnecessary and this can be closed.

---

## 7. Is `Pensacola` a real store?

**Blocks:** nothing structural, but it appears in the live preview of Scorecards and in no
other dataset.

The mockup consistently uses seven stores: Madhouse, Emerald Coast, Haven, Honky Tonk,
M.C.H.D., Moonshine, Music City. An eighth, *Pensacola*, shows up in the live Scorecards
preview. Worth confirming whether that is a real store or stale sample data before it goes
any further. Already flagged on the Scorecards page.

---

## 8. Do exceptions get pushed or pulled?

**Blocks:** whether the "what needs attention" strip is the primary surface or a secondary
one.

The mockup now surfaces exceptions at the top of Store Overview — departments at least 3
points behind (or ahead of) the percentage of the period elapsed. That is a **pull** model:
the GM opens the page and sees what is wrong.

If the answer is **push** (an email or SMS at 07:00 listing what broke overnight), then the
dashboard becomes the drill-down rather than the alert, and the strip matters less. This
shapes where effort goes next.

---

## 9. Sample data provenance — which figures are real?

**Blocks:** trusting any specific number in a demo.

Not a question so much as a standing caution. Some figures are real — Financial Statements
is Emerald Coast's actual August 2026 closed-month statement, reconciled against the source
workbook. Others are fabricated but built to reconcile internally.

**Check a page's own mock banner and build notes before treating a number as real.** Each
page states its own provenance.

---

## Resolved / not blocking

- **Two day-counts (display vs projection).** Deliberate, documented, and correct. Do not
  reconcile them. The column heading states the projection basis so the two are not read as
  an error.
- **No projected margin.** Both figures scale by the same factor, so a projected margin
  always equals month-to-date margin. Confirmed as intended.
- **No Day column on KPI/summary tables.** Decided September 2026. Record-level tables
  (Per Deal, Counter Sales, Closed ROs) keep their Day scope — that is data on the row, not
  a comparison basis.
- **Cross-store ranking.** Phase 2 and consent-gated, suppressed below three or four
  contributing stores. The empty state is built first and already renders when fewer than
  four stores contribute — see `scripts/charts.js` → `heatmap()`. The bars in that chart are
  deliberately **neutral in colour**, because without a per-metric target there is no
  judgment to make and colouring against peers would be ranking.
