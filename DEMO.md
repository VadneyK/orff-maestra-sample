# Two-minute demo

A click path for showing the prototype on a call. Share a browser window at desktop width (1280 px or wider) on https://vadneyk.github.io/orff-maestra-sample/. Times are a guide; the whole path takes about two minutes. Everything runs in the page, so a reload resets it.

The six open questions are on the page itself, at the bottom, so no second tab is needed.

## 0:00 Enter rows

1. On **1. Choose sources**, tick **Classroom observation** and **Teacher interview**. Say: each source becomes its own row; coverage planning stays on the author's official matrix, linked here, because it is CC BY-ND.
2. Click **Case A: difference**. The page jumps to step 2 with five rows from a fictional student whose dialect and language history do not match the test norms.
3. Point at the Status column: four rows read **Counted**, the standardized assessment reads **Listed, not counted**.

## 0:25 The T2 merge flag

1. Click **Add a row**. In the new row's Data source, type `Standardized test: vocabulary`, then click anywhere outside the field.
2. Both standardized rows now show **T2 Counts as one source with another row. Merge them.**
3. Point at the counts: **Rows not finished** is now 2 and the line says "0 sources inconclusive". Say: the table says multiple standardized tests are one source, so until they are merged neither row is counted, and nothing is counted twice.
4. Click **Remove** on the new row. The flag clears and the line goes back.

## 0:55 An inconclusive row left out of the count

1. On the standardized assessment row, point at **Inconclusive** and its reason, "Norms do not fit this student's language background."
2. Point at the tiles: **Inconclusive, not counted** is 1, and the reason is listed under the counts.
3. Select the reason text and delete it. The row now shows **T5 Give the inconclusive source a one-line reason.** and **Rows not finished** goes to 1. Say: an inconclusive call needs a reason before the row is finished.
4. Type a short reason back in (for example `Norms do not fit.`). The row returns to **Listed, not counted**.

## 1:20 The convergence line

1. Read the line aloud: "4 of 4 interpretable sources support difference; 1 source inconclusive and not counted."
2. On **Classroom observation**, click **Yes**. The line changes to "3 of 4 interpretable sources support difference". Click **No** to put it back.
3. Point at the T9 note under the reasons: if the team finds difference, that answers only the educational question and leaves general-education supports such as MTSS open. It comes from the table's note on the third column.
4. Point at the yellow note: the combining rule is not wired in, so the page reports counts and makes no determination. Say: the table informs the team's decision and does not make it; the rule has one marked place in `core.js` and a test waiting for it.
5. Optional, if there is time: click **Next: check the note**. Both checks on the sample note pass (count stated, inconclusive source named). No model call; the checks are plain rules.

## 1:40 The six open questions

Scroll to **Open questions for the spec author** at the bottom of the page and walk the six. Each one names the piece of the build it blocks:

1. **Q1** The combining rule.
2. **Q2** How a tie is written.
3. **Q3** Whether every No supports difference.
4. **Q4** Same source in two settings: one source or two.
5. **Q5** Licence for the matrix and reasoning map (CC BY-ND).
6. **Q6** Asking for the setting on each row.

Say: each one blocks a specific line of code, and I would rather ask than guess. If asked how the list stays honest: `test/trace.test.mjs` fails when the code and REQUIREMENTS.md disagree.

If there is time: go back to step 1 and click **Case B: disorder** (5 of 5 support disorder) and **Case C: split (Q2)** (2 and 2, the tie the table leaves open; its T8 note asks for the testing-the-limits probe that could not be given). It shows the page does not lean one way.

## If something goes wrong

- The page looks stale after a change: hard reload (Cmd+Shift+R).
- Rows got messy: click **Clear**, then **Case A: difference** again.
- No network: run it locally with `python3 -m http.server 8765` in the repo and open http://127.0.0.1:8765.
