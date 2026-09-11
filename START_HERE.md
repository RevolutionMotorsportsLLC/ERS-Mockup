# Moving the ERS Mockup into Claude Code

Written for someone who has never used it. No coding required at any step — you describe
what you want in plain English and review what comes back.

---

## Step 1 — Install it

Claude Code is the same Claude, working inside a folder on your computer instead of a chat
window. It can read your files, change them, and show you the result.

Easiest route for a non-developer: **install the Claude desktop app and use the Code tab**
inside it. That avoids the terminal entirely. It is also available in the terminal and in
code editors if you ever want those.

Setup details and current requirements: <https://docs.claude.com/en/docs/claude-code/overview>
(it needs Node.js 18 or newer, which the installer will tell you about, and your existing
Claude subscription).

---

## Step 2 — Make the folder

Create a folder somewhere sensible — `Documents/ERS-Mockup` is fine. Put these five files
straight into it:

| File | What it is |
|---|---|
| `CLAUDE.md` | Project instructions. Claude Code reads this automatically at the start of every session — it is the equivalent of the project instructions in the chat interface. |
| `START_HERE.md` | This file. |
| `OPEN_QUESTIONS.md` | The eleven items for Logan. |
| `ERS_BikeSales_Tab_Mockup.html` | The finished Bike Sales tab. |
| `ERS_StoreOverview_Rebuild_Guidance.html` | The Store Overview guidance. |

Also worth dropping in: the Talon chart of accounts photo, the F&I export photo, the
scorecard printouts, and the condensed per-deal spreadsheet. Claude Code can read images
and spreadsheets, and those are the source documents behind half the decisions.

---

## Step 3 — Open the folder in Claude Code

Point it at `Documents/ERS-Mockup`. It will read `CLAUDE.md` on its own. You do not need to
paste anything from the old chat — everything that mattered is in that file.

---

## Step 4 — The first four things to ask for

Work through these in order. Read what comes back after each one before moving on.

**1. Have it orient itself.**

> Read CLAUDE.md, OPEN_QUESTIONS.md and both HTML mockups. Summarise back to me what ERS
> is, what has already been decided, and anything in those files that contradicts
> something else. Do not change any files yet.

The point is the contradiction check. If it finds something, that is a real finding, not a
false start.

**2. Set up version control.**

> Set this folder up as a git repository and make the first commit. Explain in plain
> language what you did and how I would undo a change later.

Git is a history of every version of every file, so nothing is ever lost and any change
can be reversed. Ask it to walk you through pushing this to a repository owned by
Revolution — not a personal account — and confirm you and Logan both hold admin access.

**3. Pull the sample figures out of the pages.**

> Restructure the two mockups so that every sample number lives in files under /data,
> and the pages read from those files. The pages should look identical afterwards.
> Show me the before and after so I can confirm nothing moved.

This is the seam between front end and back end, drawn where you want it rather than where
a developer guesses. The pages will look exactly the same.

**4. Build the shared kit.**

> Pull the shared design tokens, layout and table styles out of the two mockups into
> /styles, and the table rendering into /scripts, so a new tab is assembly rather than
> a rebuild. Both existing pages must render identically afterwards.

After that, a new department tab is a short conversation rather than a session.

---

## Step 5 — How to work with it day to day

- **Ask for one thing at a time, and look at the result.** The same rhythm as this chat.
- **Ask it to show you the page in a browser** after a change. It can start a local
  preview and give you a link.
- **Tell it when something is wrong in plain words.** "The margin column is too close to
  the sales column" is a perfectly good instruction.
- **Ask "why" freely.** If it does something you do not understand, ask it to explain in
  plain language. The answer belongs in `CLAUDE.md` if it is a decision rather than a
  detail.
- **Have it update `CLAUDE.md` whenever a decision is made.** That file is the handoff. If
  a decision only exists in a conversation, it does not survive you.

---

## What to be careful about

- **Scope.** One tab took a full working session at this level of detail. Do not try to
  build all ten surfaces at once. Kit first, then the three department tabs that reuse it.
- **Anything invented is still invented.** The mockups contain placeholder conventions —
  the margin formula on the deal list, the shortened VIN, the abbreviated salesperson
  names, the six-day week. They are flagged in the files. Because the developers build
  exactly what they are given, an unflagged placeholder becomes product.
- **Timing.** Handing a full front-end specification to the developers mid-sprint is a
  scope change. Phase 2 is due September 30 and Fort Walton is October 8, with no slack
  between them. Build it now; decide separately when it lands on their desk.
- **It does not make the numbers right.** Mapping, the formula specification and the
  acceptance test sit outside this project.
