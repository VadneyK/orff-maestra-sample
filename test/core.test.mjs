import { test } from "node:test";
import assert from "node:assert/strict";
import {
  emptyRow, rowIssues, duplicateSources, convergence, convergenceLine, combineRule, noteChecks,
} from "../core.js";

const row = (source, answer, reason = "", finding = "Brief finding.") => ({ source, finding, answer, reason });

test("T4: a row needs Yes, No or Inconclusive", () => {
  assert.ok(rowIssues(row("Teacher interview", "")).some((x) => x.rule === "T4"));
  assert.equal(rowIssues(row("Teacher interview", "No")).length, 0);
});

test("T5: an inconclusive row needs a reason before it is complete", () => {
  assert.ok(rowIssues(row("Language sample", "Inconclusive")).some((x) => x.rule === "T5"));
  assert.equal(rowIssues(row("Language sample", "Inconclusive", "Sample too short.")).length, 0);
});

test("T3: an empty or very long finding is flagged", () => {
  assert.ok(rowIssues(row("Work product", "No", "", "")).some((x) => x.rule === "T3"));
  const long = Array(41).fill("word").join(" ");
  assert.ok(rowIssues(row("Work product", "No", "", long)).some((x) => x.rule === "T3"));
});

test("T2: two standardized tests are one source", () => {
  const rows = [row("Standardized assessment", "Yes"), row("Standardized test: vocabulary", "Yes"), row("Teacher interview", "No")];
  assert.deepEqual(duplicateSources(rows), ["standardized assessment"]);
});

test("T6: only Yes and No are counted; inconclusive rows are listed with reasons", () => {
  const rows = [
    row("Classroom observation", "No"),
    row("Teacher interview", "No"),
    row("Language sample", "Yes"),
    row("Standardized assessment", "Inconclusive", "Norms do not fit."),
    emptyRow("Parent interview"),
  ];
  const c = convergence(rows);
  assert.equal(c.interpretable, 3);
  assert.equal(c.difference, 2);
  assert.equal(c.disorder, 1);
  assert.equal(c.inconclusive, 1);
  assert.equal(c.incomplete, 1);
  assert.equal(convergenceLine(c), "2 of 3 interpretable sources support difference; 1 source inconclusive and not counted.");
});

test("a tie leaves the blank open instead of picking a side", () => {
  const c = convergence([row("A", "Yes"), row("B", "No")]);
  assert.match(convergenceLine(c), /split/);
});

test("the combining rule is a placeholder until the spec author supplies it", () => {
  assert.equal(combineRule(convergence([row("A", "Yes")])), null);
});

test("note checks: count stated, inconclusive source named", () => {
  const rows = [row("Teacher interview", "No"), row("Standardized assessment", "Inconclusive", "Norms do not fit.")];
  const good = noteChecks(rows, "1 of 1 interpretable sources support difference; the standardized assessment is not counted.");
  assert.ok(good.every((k) => k.ok));
  const bad = noteChecks(rows, "Support difference.");
  assert.equal(bad.filter((k) => !k.ok).length, 2);
});

test("T7: a cited score with no other named source is flagged", () => {
  const rows = [row("Standardized assessment", "Yes"), row("Teacher interview", "No")];
  const k = noteChecks(rows, "1 of 2: standard score of 78 on the standardized assessment.").find((x) => x.rule === "T7");
  assert.equal(k.ok, false);
});

test("T2: two complete standardized rows are not counted until merged", () => {
  const rows = [
    row("Standardized assessment", "Yes"),
    row("Standardized test: vocabulary", "Yes"),
    row("Teacher interview", "No"),
  ];
  const c = convergence(rows);
  assert.equal(c.interpretable, 1);
  assert.equal(c.disorder, 0);
  assert.equal(c.incomplete, 2);
});

test("T7: two standardized tests named in the note still count as one source", () => {
  const rows = [row("Standardized assessment", "Yes"), row("Standardized test: vocabulary", "Yes"), row("Teacher interview", "No")];
  const k = noteChecks(rows, "Standard score of 78 on the standardized assessment and the standardized test: vocabulary.").find((x) => x.rule === "T7");
  assert.equal(k.ok, false);
});
