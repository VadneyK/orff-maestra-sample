# Summary Table Prototype

A small working prototype of step 2 of the school SLP assessment workflow described in ORFF Maestra's Technical Product Lead posting: code each evidence source as Yes, No, or Inconclusive for disorder, and combine the codes into the convergence line. I built it as a work sample for that application.

Live demo: https://vadneyk.github.io/orff-maestra-sample/

Short version: I built the step whose rules are public and adaptable, made every rule traceable to a line of the spec, and left the parts that need the spec author's decision as named open questions instead of guessing.

## What it does

1. **Choose sources.** Pick the sources you plan to gather. Each becomes a row. Coverage planning links out to the official Source Complementarity Matrix.
2. **Code each source.** For each row: the source, a brief finding, and Disorder? as Yes, No, or Inconclusive. The page checks each row against the table's rules as you type (one-line reason for inconclusive, brief findings, standardized tests count as one source) and fills in the convergence line: "4 of 4 interpretable sources support difference; 1 source inconclusive and not counted."
3. **Check the note.** Write the team's brief note and see plain checks against the table: is the count stated, is each inconclusive source accounted for, does a cited score stand next to other named sources.

"Load a constructed sample case" fills in a fictional case so the whole flow can be seen in a minute.

Everything runs in the page. Nothing is stored, sent, or logged. There are no student records and no accounts.

## Run it

No build step and no dependencies.

```bash
git clone https://github.com/VadneyK/orff-maestra-sample.git
cd orff-maestra-sample
python3 -m http.server 8765
```

Then open http://127.0.0.1:8765. The page uses ES modules, so it needs a local server rather than opening the file directly.

Tests (Node 20 or later):

```bash
npm test
```

## Files

- `core.js`: all of the rules, as pure functions with no DOM. This is the part a developer would keep.
- `app.js`: the page wiring.
- `index.html`: layout and styles.
- `test/core.test.mjs`: one test per rule.
- `REQUIREMENTS.md`: each rule, the line of the table it comes from, and its test. Plus the open questions for the spec author.
- `DEMO.md`: a two-minute click path through the page.

## What was decided, and why

- **Step 2 first.** It is the core of the method, its rules are fully public, and the table is CC BY 4.0, so it can be adapted with credit. The matrix and the reasoning map are CC BY-ND, so I linked to them rather than rebuilding them.
- **No determination.** The table says it informs the team's decision and does not make it. The prototype stops at counts. The combining rule has one marked place in `core.js` and a test waiting for it.
- **Rules are plain code with ids.** T1 to T7 match `REQUIREMENTS.md`. A clinician can read the table of rules without reading code, and a developer can find the code for any rule by its id.
- **No model call.** Step 3 checks are deterministic. They are cheap, testable, and keep every word on the clinician's device. Whether a model should give feedback on the full written determination is a decision for the pilot, made with the clinicians.
- **Vanilla JavaScript, one page.** For a nine-month build with a lean budget, a static page the pilot SLPs can open from a link is the cheapest thing to change every week. A framework can come when the screens settle.

## What is left

- The combining rule (open question Q1), then a test per row of the author's rule table.
- Coverage planning inside the tool, if the author allows it (Q5).
- Feedback on the clinician's full written determination (step 3 proper).
- Saving and exporting a case. Today it is print to PDF only.
- Usability sessions with practicing school SLPs on constructed cases, and an accessibility pass with a screen reader.

## Credit

Built on the Multisource Assessment Summary Table by Sybrey L. Callwood, M.S., CCC-SLP (2026), https://callwoodslp.com/table, licensed CC BY 4.0. Changes: the table's columns and how-to-use rules are turned into form fields and checks, and the wording is shortened. This is an unofficial prototype and a teaching aid. Eligibility is determined by a group of qualified professionals and the parent (34 C.F.R. § 300.306).

The code in this repository is MIT licensed (see `LICENSE`). The table it is built on keeps its own CC BY 4.0 licence.

Kentaro Vadney · https://github.com/VadneyK · https://www.linkedin.com/in/kentarov
