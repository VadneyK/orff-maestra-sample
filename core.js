// Pure logic for the summary table. No DOM, so it runs in the browser and under node --test.
//
// Every rule here traces to a line of the public Multisource Assessment Summary Table
// (Callwood 2026, callwoodslp.com/table, CC BY 4.0). Rule ids (T1, T2, ...) match REQUIREMENTS.md.

export const ANSWERS = ["Yes", "No", "Inconclusive"];

// T2: "Multiple standardized tests count as one source."
export const STANDARDIZED = "Standardized assessment";

// Suggested source names. The table leaves Data Source as free text; these are the
// sources its "How to use" notes name, plus the interviews most teams gather.
export const SUGGESTED_SOURCES = [
  "Classroom observation",
  "Teacher interview",
  "Language sample",
  "Parent interview",
  "Student interview",
  "Work product",
  STANDARDIZED,
];

export function emptyRow(source = "") {
  return { source, finding: "", answer: "", reason: "" };
}

// Problems that stop a row from being counted. Each one names the rule it comes from.
export function rowIssues(row) {
  const issues = [];
  if (!row.source.trim()) issues.push({ rule: "T1", text: "Name the data source." });
  if (!row.finding.trim()) issues.push({ rule: "T3", text: "Reduce the source to what it showed." });
  if (row.finding.trim().split(/\s+/).length > 40)
    issues.push({ rule: "T3", text: "Keep the finding brief enough to read at a glance (40 words or fewer here)." });
  if (!ANSWERS.includes(row.answer)) issues.push({ rule: "T4", text: "Answer Yes, No, or Inconclusive." });
  if (row.answer === "Inconclusive" && !row.reason.trim())
    issues.push({ rule: "T5", text: "Give the inconclusive source a one-line reason." });
  return issues;
}

// T2: rows that name the same source (any standardized test counts as the one standardized source).
export function sourceKey(name) {
  const n = name.trim().toLowerCase();
  if (n.startsWith("standardized") || n.includes("standardized test")) return STANDARDIZED.toLowerCase();
  return n;
}

export function duplicateSources(rows) {
  const seen = new Map();
  for (const r of rows) {
    if (!r.source.trim()) continue;
    const k = sourceKey(r.source);
    seen.set(k, (seen.get(k) || 0) + 1);
  }
  return [...seen.entries()].filter(([, n]) => n > 1).map(([k]) => k);
}

// T5, T6: count only interpretable sources (Yes or No); inconclusive ones are listed, not counted.
// Returns the numbers for the convergence line. It does not return a determination:
// the table "informs the team's decision; it does not make it."
// T2: rows that share a source are held out of the count until they are merged, so one
// source cannot be counted twice. The page shows them as "Merge them", not "Counted".
export function convergence(rows) {
  const dups = new Set(duplicateSources(rows));
  const unmerged = (r) => r.source.trim() !== "" && dups.has(sourceKey(r.source));
  const complete = rows.filter((r) => rowIssues(r).length === 0 && !unmerged(r));
  const yes = complete.filter((r) => r.answer === "Yes").length;
  const no = complete.filter((r) => r.answer === "No").length;
  const inconclusive = complete.filter((r) => r.answer === "Inconclusive");
  return {
    interpretable: yes + no,
    disorder: yes,
    difference: no,
    inconclusive: inconclusive.length,
    inconclusiveReasons: inconclusive.map((r) => ({ source: r.source, reason: r.reason })),
    incomplete: rows.length - complete.length,
  };
}

// The sentence the table asks the team to fill in. When the counts tie, the blank stays open:
// how a tie is written is open question Q2 for the spec author.
export function convergenceLine(c) {
  if (c.interpretable === 0) return "No interpretable sources yet.";
  let side = "";
  let n = 0;
  if (c.disorder > c.difference) { side = "disorder"; n = c.disorder; }
  else if (c.difference > c.disorder) { side = "difference"; n = c.difference; }
  const skipped = `${c.inconclusive} source${c.inconclusive === 1 ? "" : "s"} inconclusive and not counted.`;
  if (!side) return `${c.disorder} of ${c.interpretable} interpretable sources support disorder and ${c.difference} support difference (split); ${skipped}`;
  return `${n} of ${c.interpretable} interpretable sources support ${side}; ${skipped}`;
}

// PLACEHOLDER for the TTL-MSM combining rule. The public table does not publish one, so this
// returns null and the UI says so. When the spec author supplies the rule, it goes here,
// with a test per row of her rule table.
export function combineRule(_c) {
  return null;
}

// Step 3 stub: plain checks of the team's brief note against the table itself.
// Deterministic on purpose: no model call, nothing leaves the browser.
export function noteChecks(rows, note) {
  const text = note.toLowerCase();
  const checks = [];
  const c = convergence(rows);
  checks.push({
    rule: "T6",
    ok: /\b\d+\s+of\s+\d+\b/.test(text),
    text: "The note states the convergence count (for example \"3 of 4\").",
  });
  for (const r of rows) {
    if (!r.source.trim() || r.answer !== "Inconclusive") continue;
    checks.push({
      rule: "T5",
      ok: text.includes(r.source.trim().toLowerCase()),
      text: `The note accounts for the inconclusive source: ${r.source.trim()}.`,
    });
  }
  const scoreWords = /(standard score|percentile|scaled score|\bss\b|below average|\bsd\b)/;
  if (scoreWords.test(text) && c.interpretable > 0) {
    // Distinct sources by T2 key, so two standardized tests do not pass as two sources.
    const mentions = new Set(rows.filter((r) => r.source.trim() && text.includes(r.source.trim().toLowerCase())).map((r) => sourceKey(r.source))).size;
    checks.push({
      rule: "T7",
      ok: mentions >= 2,
      text: "A test score is cited; the note also draws on at least one other source by name.",
    });
  }
  return checks;
}
