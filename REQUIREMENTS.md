# Requirements, traced to the spec

How to use this file: every rule the prototype enforces has an id, the line of the spec it comes from, and the test that proves it. When the spec author reads a row and says "that is not what I meant", that row is the misunderstanding, caught before it is built twice.

Source: Multisource Assessment Summary Table, Callwood 2026, callwoodslp.com/table (CC BY 4.0). Rule wording below is paraphrased.

## Built

| Id | Requirement | From the table | Test |
| --- | --- | --- | --- |
| T1 | Each row names one data source. | "Data Source: each type of evidence you gathered." | `rowIssues` |
| T2 | Multiple standardized tests count as one source. Two rows that name standardized tests are flagged to merge. | "Multiple standardized tests count as one source." | `T2: two standardized tests are one source` |
| T3 | Each row has a brief finding. The prototype flags findings over 40 words. | "Keep each entry brief enough that everyone at the meeting can read the full table at a glance." | `T3: an empty or very long finding is flagged` |
| T4 | Disorder? is Yes, No, or Inconclusive, decided per row. | "answer Yes, No, or Inconclusive ... Decide each source on its own before comparing across rows." | `T4` |
| T5 | An inconclusive row needs a one-line reason and is left out of the count. | "Give each inconclusive source a one-line reason and leave it out of the count." | `T5`, `T6` |
| T6 | Convergence counts only Yes and No rows and fills the line "___ of ___ interpretable sources support ___; ___ inconclusive and not counted." | The convergence line and "Count only interpretable sources (Yes or No)". | `T6`, `a tie leaves the blank open` |
| T7 | If the note cites a test score, it also names at least one other source. | Paraphrased from the companion Reasoning Map: one source should not become the conclusion because it produced a number. | `T7` |

## Not built, on purpose

- **No determination.** The table "informs the team's decision; it does not make it." The prototype shows counts and stops. `combineRule` in `core.js` is the one place the TTL-MSM combining rule goes once it is written down for engineering.
- **No coverage wheel.** The Source Complementarity Matrix and Reasoning Map are CC BY-ND. Rebuilding them in software would be an adaptation, so the prototype links to the official matrix. That needs the author's permission first (Q5).
- **No model call for step 3.** Feedback on the full written determination is a later phase. The checks today are plain rules from the table, so they are testable and nothing leaves the browser.

## Open questions for the spec author

These are the places where I would rather ask than guess. Each one blocks a specific line of code.

1. **Q1. The combining rule.** What fixed rule turns the per-source codes into the team's convergence statement? Is it a count threshold, a majority, or something that weighs source types differently?
2. **Q2. Ties.** When Yes and No are equal, what does the line say? The prototype leaves the blank open and writes "split".
3. **Q3. "Support difference".** The column asks Disorder?. Is every No a source that supports difference, or can a No be neutral?
4. **Q4. Same source, two settings.** Do two classroom observations in different settings count as one source or two? T2 only says this for standardized tests.
5. **Q5. Licence.** May the funded prototype implement the matrix's coverage values and the reasoning map, given CC BY-ND on both?
6. **Q6. Educational impact.** The third-column note says a source reads No when a condition does not limit communication in that setting. Should the form ask for the setting on each row so that reasoning is visible?
