// Traceability: the rule ids and open questions in core.js, the sample cases in app.js,
// and REQUIREMENTS.md must agree, so the document a clinician reads is the one the code follows.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { RULES, OPEN_QUESTIONS } from "../core.js";
import { CASES } from "../cases.js";
import { convergence, rowIssues } from "../core.js";

const req = readFileSync(new URL("../REQUIREMENTS.md", import.meta.url), "utf8");
const core = readFileSync(new URL("../core.js", import.meta.url), "utf8");

test("every rule id in core.js is a row of the Built table in REQUIREMENTS.md", () => {
  for (const id of Object.keys(RULES)) assert.match(req, new RegExp(`^\\| ${id} \\|`, "m"), `${id} missing`);
});

test("every Built row in REQUIREMENTS.md has a rule in core.js", () => {
  const ids = [...req.matchAll(/^\| (T\d+) \|/gm)].map((m) => m[1]);
  assert.deepEqual(ids, Object.keys(RULES));
});

test("every rule id the code can emit is defined", () => {
  const emitted = new Set([...core.matchAll(/rule: "(T\d+)"/g)].map((m) => m[1]));
  for (const id of emitted) assert.ok(RULES[id], `${id} emitted but not defined`);
});

test("the six open questions match REQUIREMENTS.md", () => {
  assert.equal(OPEN_QUESTIONS.length, 6);
  for (const q of OPEN_QUESTIONS) assert.match(req, new RegExp(`\\*\\*${q.id}\\.`), `${q.id} missing`);
});

test("each constructed case is complete and gives the line it promises", () => {
  for (const c of CASES) {
    for (const r of c.rows) assert.deepEqual(rowIssues(r), [], `${c.id}: ${r.source}`);
    const k = convergence(c.rows);
    assert.equal(k.incomplete, 0, c.id);
    assert.equal(k.disorder > k.difference ? "disorder" : k.difference > k.disorder ? "difference" : "split", c.expect, c.id);
  }
});
