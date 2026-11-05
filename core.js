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

// One line per rule, in plain words. The page shows it when a rule chip is hovered, and screen readers read it,
// and test/trace.test.mjs checks that every id here is a row in REQUIREMENTS.md.
export const RULES = {
  T1: "Each row names one data source.",
  T2: "Multiple standardized tests count as one source.",
  T3: "Each finding is brief enough to read at a glance.",
  T4: "Disorder? is Yes, No, or Inconclusive, decided per source.",
  T5: "An inconclusive source needs a one-line reason and is left out of the count.",
  T6: "Convergence counts only interpretable sources (Yes or No).",
  T7: "A cited test score stands next to at least one other named source.",
  T8: "Gather naturalistic data first; standardized testing last, closed with a testing-the-limits probe.",
  T9: "If the team finds difference, that answers only the educational question; general-education supports stay open.",
};

// The questions only the spec author can answer. Each one blocks a named piece of the build.
export const OPEN_QUESTIONS = [
  { id: "Q1", text: "What fixed rule turns the per-source codes into the team's convergence statement?", blocks: "combineRule in core.js" },
  { id: "Q2", text: "When Yes and No are equal, what does the convergence line say?", blocks: "the tie wording in convergenceLine" },
  { id: "Q3", text: "Is every No a source that supports difference, or can a No be neutral?", blocks: "the word \"difference\" in the line" },
  { id: "Q4", text: "Do two observations in different settings count as one source or two?", blocks: "sourceKey (T2 covers only standardized tests)" },
  { id: "Q5", text: "May the funded prototype implement the matrix and reasoning map (CC BY-ND)?", blocks: "coverage planning in step 1" },
  { id: "Q6", text: "Should each row record the setting the source captures?", blocks: "a setting field on each row" },
];

// T8: the naturalistic sources the table names to gather before standardized testing.
export const NATURALISTIC = ["Classroom observation", "Teacher interview", "Language sample"];

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

// T8: advice on the order of gathering, from the table's first how-to line. Advisory only:
// it never changes the count, because the table does not make order a condition of counting.
export function gatherNotes(rows) {
  const notes = [];
  const named = rows.filter((r) => r.source.trim());
  const keys = new Set(named.map((r) => sourceKey(r.source)));
  const std = named.filter((r) => sourceKey(r.source) === STANDARDIZED.toLowerCase());
  if (std.length === 0) return notes;
  const missing = NATURALISTIC.filter((n) => !keys.has(n.toLowerCase()));
  if (missing.length)
    notes.push({ rule: "T8", text: `Naturalistic data comes first. Not in the table yet: ${missing.join(", ").toLowerCase()}.` });
  if (!std.some((r) => probeDone(r.finding)))
    notes.push({ rule: "T8", text: "Close standardized testing with a brief testing-the-limits probe, and say what it showed in the finding." });
  return notes;
}

// A finding says a testing-the-limits probe was given. "No probe was possible" or "probe not given"
// does not count: a negation before or right after the word in the same clause means it was not done.
export function probeDone(finding) {
  for (const clause of finding.toLowerCase().split(/[.;]/)) {
    if (!/\b(probe|limits)\b/.test(clause)) continue;
    if (/\b(no|not|without|never|unable|could ?n[o']t)\b[^.;]*\b(probe|limits)\b/.test(clause)) continue;
    if (/\b(probe|limits)\b\s+(was|were)?\s*(not|never)\b/.test(clause)) continue;
    return true;
  }
  return false;
}

// T9: from the table's note on the third column. Shown only when the count leans to difference.
export function contextNote(c) {
  if (c.interpretable === 0 || c.difference <= c.disorder) return null;
  return "If the team finds difference, that answers only the educational question. It does not rule out general-education supports, such as MTSS or dialect-informed instruction.";
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
