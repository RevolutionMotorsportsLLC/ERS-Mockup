# HANDOFF — ERS Mockup design work

**Read this first.** Everything else in this repository answers *"what does ERS do?"*.
This file answers *"what just happened, what is still open, and where do I pick up?"*.

Written to be read by two people at once: **Seth**, who is not a developer and is
transitioning out, and **a future agent or developer** who needs the technical detail.
Plain language first; the specifics are in tables further down.

---

## 1. The short version

The ERS mockup is the specification the development team builds from. It was already
trustworthy — every figure reconciled, every row said where its number came from — but it
presented **32 tables and no pictures at all**. A general manager had to do the arithmetic
in their head to answer the one question this product exists to answer: *are we on plan,
and what is broken?*

Three things were done to fix that, on one branch, in three commits:

1. **The interface was rebuilt** so it looks and behaves like a real product.
2. **A set of charts was added** — ten of them, across all seven tabs.
3. **The layout was reorganised** so what needs attention sits at the top.

**No number changed. No formula changed. No rule about how a figure is sourced changed.**
Every chart is a different way of looking at figures that were already on the page, and the
charts reconcile with those tables exactly.

The work is on a branch and open as a **draft pull request**. It has not been merged, and
merging is not urgent.

---

## 2. Where things stand right now

| | |
|---|---|
| **Pull request** | <https://github.com/RevolutionMotorsportsLLC/ERS-Mockup/pull/1> |
| **State** | Draft — cannot be merged by accident |
| **Branch** | `ui-polish-shared-kit`, 3 commits |
| **Size** | 16 files, +2,430 / −167 lines |
| **Base** | `main`, untouched |
| **Who owns it** | Seth Cooke and Logan (organisation owners) |
| **Approvals needed** | None technically. Open questions in §5 are the real gate |

### To see it running

The pages load their numbers from files at runtime, so they cannot be opened by
double-clicking. Three lines in a terminal:

```bash
git clone https://github.com/docsofdw/ERS-Mockup.git
cd ERS-Mockup && git checkout ui-polish-shared-kit
python3 -m http.server 8420
```

Then open <http://localhost:8420/>. Stop with `Ctrl-C`.

To see the *original* alongside it for comparison, run the same thing on a different port
(`python3 -m http.server 8421`) from the `main` branch instead.

---

## 3. What we worked on, in order

| Step | What was asked | What happened |
|---|---|---|
| 1 | Clone the repository and open it locally | Cloned, served on port 8420 |
| 2 | Make the UI and UX noticeably better, keep it as a spec | Rebuilt the design system in the three shared files |
| 3 | Show the original beside it for comparison | Served the old version on port 8421 |
| 4 | Redesign the charts, sliders and data intake; audit the whole thing | Wrote `DESIGN_AUDIT.md` (552 lines) |
| 5 | Make the best call and take it all the way to the finish line | Built the chart kit and the layout changes; opened the PR |
| 6 | Write a handoff document | This file |
| 7 | Overall UI enhancement — sleeker, more professional, same palette | The refinement pass (§4.4) |

The audit (step 4) is what drove everything after it. Two findings in particular changed
the shape of the work:

- **There were no charts at all.** Every figure was a cell in a grid.
- **There is no history in the data.** Every number has exactly three versions — this
  month so far, last month, last year. That is enough for comparing against a plan, which
  is what a dealer does, and it is not enough for drawing a line over time.

That second finding decided what kind of charts to build. See §5, question 1.

---

## 4. What was built

### 4.1 The interface rebuild (commit `41f74a9`)

The three shared files that every tab uses were rewritten. No page content changed.

- The **sidebar** became real product chrome: a brand lockup, a marker on the current page,
  and the four "where did this number come from" tags listed at the foot. Tabs that are not
  built yet say **Soon** and do nothing, instead of being links that silently bounced you to
  the top of the page.
- The **comparison tabs** (Month to date / vs. last month / vs. last year) became a proper
  segmented control.
- The **numbers at the top of each page** got larger and are set so digits line up in
  columns.
- Every button, dropdown and toggle now has proper hover, press, keyboard-focus and
  disabled states.
- **Print page actually prints**, and produces a clean report — the sidebar, the buttons
  and the developer notes all drop out.
- **A layout bug was fixed**: below 1280 pixels wide, several pages grew a sideways
  scrollbar. Now clean at every size down to a phone.

### 4.2 The chart kit (commit `f1e05ba`)

A new file, `scripts/charts.js`, holds all of it. No outside software was added — the
charts are drawn directly, using the same colours and type as the rest of the interface.

| Tab | Chart | The question it answers |
|---|---|---|
| Store Overview | Exception strip | What is going wrong right now? |
| Store Overview | Sales share vs. gross share | Where does the profit actually come from? |
| Bike Sales | Pace bullets | Are we on plan? |
| Bike Sales | Conversion funnel | Is the sales floor converting? |
| Bike Sales | Ranked bars | Where does F&I money come from? |
| Parts Sales | Pace bullets | Are we on plan? |
| Parts Sales | Obsolescence share | Is inventory aging? |
| Service | Pace bullets | Are we on plan? |
| Motorclothes | Pace bullets | Are we on plan? |
| Scorecards | Cross-store matrix | Which store needs help? |
| Financial Statements | Profit waterfall | Where did the money go? |

**The pace bullet is the one that matters most.** Before, answering "are we on plan?"
meant comparing three columns of figures in your head across seven department rows. Now it
is one glance: a bar for the month so far, a marker for where we should be, a tick for last
year. Green and red appear *only* when the gap is big enough to mean something.

Two smaller changes cost nothing and help a lot:

- **The source tags are now clickable.** Click `statement` or `derived` in any table and
  only those rows light up. This turns the existing "where did this number come from"
  convention into a tool you can actually audit with.
- **The orange developer notes are hidden by default.** There are 33 of them and they were
  competing with the data. They are one click away in the header.

### 4.3 Two data problems found

These are real bugs in the sample data, found while building. **They were not silently
fixed** — the mockup handles them honestly and they are recorded in `OPEN_QUESTIONS.md`.

1. **"Missed opportunities" arrives as `−14`.** A count of things that happened cannot be
   negative, so the page would have shown "−14 missed". It now shows `14` with a small flag
   (`⚑`) that explains on hover that the source value is wrong. Nobody is guessing what the
   sign should mean.
2. **A style name arrives as the word `None`**, which printed as text instead of the dash
   the rules require. Now shows `—`.

### 4.4 The refinement pass

A UI-polish pass asked for after the handoff was written: make it look sleeker and more
professional without touching the brand. The locked palette, the typefaces and every
convention in §6 are unchanged — this is craft around them.

- **Flat instead of gradient.** The rail, the KPI ribbon, the progress fill and the note
  boxes all used subtle gradients; every one is now a flat surface separated by a hairline,
  with shadow only on hover. The derived greys went cool-neutral. The brand orange, the
  paper and the ink ramp are the documented spec values, untouched.
- **The sidebar got icons** — one small line icon per tab, drawn inline, no library — and
  the brand mark is now a tiny pace bullet, the product's own hero chart.
- **Four rendering bugs fixed on the way**, all visible in the earlier screenshots:
  the share-bar percentages rendered backwards (a CSS anchor rule was overriding the SVG
  attribute), the waterfall printed `$−1,125,753` instead of `−$1,125,753`, two departments
  in the share chart shared the same black, and the cross-store matrix wrote its values on
  top of its bars. The page header's day-count also overlapped itself on some tabs.
- **Verified again end to end:** all seven tabs load with no console errors, nothing
  overflows at 1440 / 1280 / 1180 / 820 / 560, and the print stylesheet still produces a
  clean report.

---

## 5. What we deliberately did **not** do, and why

This is the important section. Each item below is a thing that was considered and left
unbuilt, and each one is tied to a numbered question in `OPEN_QUESTIONS.md` that has to be
answered first. **These are not oversights — they are blocked.**

| What was left out | Why | Blocked on |
|---|---|---|
| **A "what if" slider** — e.g. "we are 14 units behind; what does closing them do to gross?" | The mockup's rules say ERS *displays* figures and only calculates ratios, projections and comparisons. A what-if is none of those — it is guessing at a future that has not happened. Building it either breaks the rule or needs a new, clearly-marked category of number that can never be mistaken for a real one. | **Q1** — is speculative calculation allowed at all? |
| **Trend lines, sparklines, history charts, forecast curves** | The data has three points per figure (this month, last month, last year) and no day-by-day history. You cannot draw a line through three unrelated points. Adding these needs a new data feed from Talon. | **Q5** — is a per-store day-by-day feed coming? |
| **Colouring the cross-store matrix green and red** | Every figure there is judged against other stores, not against a target — and the rules say cross-store ranking is Phase 2 and must not appear until enough stores consent. Colouring by peer is ranking in disguise. The bars are therefore neutral grey; your own store is picked out in the accent colour. Below four contributing stores the chart refuses to draw and shows an explanation instead. | **Q4** + Phase 2 consent gating |
| **Picking which metrics appear on the cross-store matrix** | The nine shown are a guess. If the wrong nine are chosen, the colour of the whole page is meaningless. | **Q4** — which metrics actually get discussed? |
| **A combined "current inventory" bucket on Parts Sales** | The data reports "over 6 months" and "over 12 months" but does not say whether the second is included in the first. The two readings give different totals, so neither is calculated — each threshold is shown against the whole, exactly as stated. | **Q3** — is 12-month nested inside 6-month? |
| **Making the colour thresholds adjustable per store** | Not clear whether one global setting is intended or seven. | **Q6** — do thresholds vary by store? |
| **Automatic alerts** (email or text at 07:00 listing what broke) | Whether the dashboard is the alert or the drill-down changes where effort goes next. | **Q8** — are exceptions pushed or pulled? |
| **Resolving the "missed opportunities" sign** | See §4.3. Fixing the sign would mean inventing what it means. | **Q2** |
| **Deciding whether `Pensacola` is a real store** | It appears in one place and nowhere else. | **Q7** |
| **CRM, Riding Academy, Maintenance tabs** | Never started. Out of scope for this work. | — |

---

## 6. Rules that must not be broken

Carry these forward unchanged. They are why a dealer believes the screen, and they were
true before this work and are still true after it.

1. **Every figure on a page agrees with every other figure on that page.** If a chart shows
   a number, it must equal the table beside it. This was verified for the profit waterfall,
   which reconciles exactly to the statement's own totals.
2. **Every row says where its number came from** — `statement`, `counted`, `entered` or
   `derived`. `derived` is the only category ERS works out for itself, and therefore the
   only one a formula can get wrong.
3. **Never show a zero when there is no value.** A dash (`—`) means "not set" or "not
   available". A zero means "this happened zero times". Those are different claims.
4. **Display, don't calculate, wherever possible.** Only ratios, projections and
   comparisons are worked out by ERS.
5. **Two day-counts, on purpose.** The header uses the accounting period (say 10 of 30).
   The month-end projection uses a six-day trading week (9 of 26) and understates on
   purpose. The column heading says which is which. **Do not reconcile them.**
6. **No projected margin.** Both figures scale by the same factor, so it would always equal
   the month-to-date margin.
7. **Earlier periods are complete months**, not the same days of them.
8. **Colour only where a judgment is possible.** Within ±3 points of pace, or ±$25 on a
   ratio, it stays plain. A page with nothing red is a healthy page.
9. **Cross-store comparison is Phase 2 and consent-gated.** The empty state was built
   before the feature, deliberately.

---

## 7. Where everything lives

| File | What it is |
|---|---|
| `CLAUDE.md` | The full rulebook. Read before implementing anything. |
| `OPEN_QUESTIONS.md` | The nine items needing Logan's answer. Blocks the spec, not the build. |
| `DESIGN_AUDIT.md` | The audit behind all of this, with the reasoning and the layout proposal. |
| `HANDOFF.md` | This file. |
| `README.md` | Entry point for the developers implementing ERS. |
| `scripts/charts.js` | All the charts. Dependency-free. |
| `scripts/nav.js` | Sidebar, the notes toggle, the source filter, Print page. |
| `scripts/format.js` | Number formatting and the dash/flag rules. |
| `styles/tokens.css` | The design system: colours, type, spacing. |
| `styles/app.css` | All shared layout, table and chart styles. |
| `pages/*.html` | One file per tab. |
| `data/*.json` | Every sample figure. This is the seam between front end and back end. |

---

## 8. If you are picking this up as an agent

**Do not re-derive what is already decided.** `CLAUDE.md` carries the decisions and the
reasoning. It is not a suggestion — the development team has a documented history of
copying this mockup exactly, including things that were meant as examples. Anything that
lands on a page becomes a requirement.

**Start here instead:**

1. Read `CLAUDE.md` §"Hard rules" and §"Charts and visuals". Ten minutes.
2. Read `OPEN_QUESTIONS.md`. If you are not Logan, you cannot close those — but you can
   build anything that is not blocked by them.
3. Look at the running site before changing anything visual. The chart kit has one function
   per chart type in `scripts/charts.js`; a new chart should be another function there, not
   a new library.

**Genuinely unblocked next work**, in rough order of value:

- Make the source-tag filter more discoverable — it is powerful and easy to miss.
- Sticky table headers on every long table, not just the deal lists.
- Keyboard arrows on the comparison tabs (they already have the right roles).
- A "Data Status" surface showing how fresh each feed is. The information is already in
  `footer.sweepTime`; nobody can currently see whether the numbers are from this morning.
- Per-store threshold settings, once Q6 is answered.

**Blocked until someone answers a question:** anything in §5 above.

---

## 9. Closing the day — what is left

Everything requested is done and pushed. Nothing is half-built.

| | |
|---|---|
| Work committed | Yes — 3 commits on `ui-polish-shared-kit` |
| Pushed | Yes — to the fork, PR #1 updated |
| PR description current | Yes |
| `main` affected | No |
| Local preview | Still running on ports 8420 (new) and 8421 (original) |
| Loose ends in the code | None known |

**The one thing nobody has done yet is looked at it.** The verification that was run is
real but mechanical: every tab loads with no errors, nothing overflows at any screen size,
the source tags and the totals styling are intact, and the profit waterfall ties back to
the statement exactly. **What was never done is a human looking at the screen.** The charts
are drawn from code and computed styles, not from eyes on the render.

So the very next thing is not an action for an agent. It is sixty seconds for Seth or Logan:

> Open <http://localhost:8420/> and look at Store Overview, Bike Sales, and Financial
> Statements. Say in plain words what reads wrong.

Everything after that is straightforward, and `OPEN_QUESTIONS.md` tells whoever is doing it
exactly which walls they will hit and why those walls are there.
