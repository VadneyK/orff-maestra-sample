import {
  ANSWERS, SUGGESTED_SOURCES, RULES, OPEN_QUESTIONS, emptyRow, rowIssues, duplicateSources, sourceKey,
  convergence, convergenceLine, combineRule, noteChecks, gatherNotes, contextNote,
} from "./core.js";
import { CASES } from "./cases.js";

// State lives in memory only. Nothing is stored or sent anywhere.
const state = { rows: [], note: "", step: 1 };

const $ = (sel) => document.querySelector(sel);
const esc = (s) => s.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

function renderSources() {
  const chosen = new Set(state.rows.map((r) => r.source));
  $("#source-picks").innerHTML = SUGGESTED_SOURCES.map((s) =>
    `<label class="pick"><input type="checkbox" value="${esc(s)}" ${chosen.has(s) ? "checked" : ""}> ${esc(s)}</label>`
  ).join("");
}

// A rule chip: its id, with the rule in plain words on hover and for screen readers.
const chip = (id) => `<span class="rule" title="${esc(`${id}: ${RULES[id]}`)}"><span aria-hidden="true">${id}</span><span class="sr">Rule ${id}, ${esc(RULES[id])}</span></span>`;

// The status cell: the row's open issues (T1 to T5), the T2 merge flag, or "Counted".
function statusHtml(r, dups) {
  const issues = rowIssues(r);
  const dup = r.source.trim() !== "" && dups.includes(sourceKey(r.source));
  return (issues.length || dup
    ? `<ul>${issues.map((x) => `<li>${chip(x.rule)} ${esc(x.text)}</li>`).join("")}${dup ? `<li>${chip("T2")} Counts as one source with another row. Merge them.</li>` : ""}</ul>`
    : r.answer === "Inconclusive"
      ? `<span class="ok">Listed, not counted</span>`
      : `<span class="ok">Counted</span>`) + `<button type="button" class="del" aria-label="Remove row">Remove</button>`;
}

function renderTable() {
  const dups = duplicateSources(state.rows);
  $("#rows").innerHTML = state.rows.map((r, i) => {
    return `<tr data-i="${i}">
      <td data-label="Data source"><textarea class="src" aria-label="Data source" rows="2" placeholder="Data source">${esc(r.source)}</textarea></td>
      <td data-label="Finding"><textarea class="finding" aria-label="Finding" rows="3" placeholder="What the source showed">${esc(r.finding)}</textarea></td>
      <td data-label="Disorder?">
        <div class="seg" role="radiogroup" aria-label="Disorder?">
          ${ANSWERS.map((a) => `<button type="button" class="ans${r.answer === a ? " on" : ""}" data-a="${a}" role="radio" aria-checked="${r.answer === a}">${a}</button>`).join("")}
        </div>
        ${r.answer === "Inconclusive" ? `<textarea class="reason" aria-label="Reason inconclusive" rows="2" placeholder="One-line reason">${esc(r.reason)}</textarea>` : ""}
      </td>
      <td class="status" data-label="Status">${statusHtml(r, dups)}</td>
    </tr>`;
  }).join("");
  renderSummary();
}

function renderSummary() {
  const c = convergence(state.rows);
  $("#line").textContent = convergenceLine(c);
  $("#counts").innerHTML = `
    <div><b>${c.disorder}</b><span>Yes (disorder)</span></div>
    <div><b>${c.difference}</b><span>No (difference)</span></div>
    <div><b>${c.inconclusive}</b><span>Inconclusive, not counted</span></div>
    <div><b>${c.incomplete}</b><span>Rows not finished</span></div>`;
  $("#reasons").innerHTML = c.inconclusiveReasons.map((r) => `<li><b>${esc(r.source)}:</b> ${esc(r.reason)}</li>`).join("");
  const gather = gatherNotes(state.rows);
  $("#gather").innerHTML = gather.map((x) => `<li>${chip(x.rule)} ${esc(x.text)}</li>`).join("");
  $("#gather").hidden = gather.length === 0;
  const ctx = contextNote(c);
  $("#context").innerHTML = ctx ? `${chip("T9")} ${esc(ctx)}` : "";
  $("#context").hidden = !ctx;
  const rule = combineRule(c);
  $("#rule").textContent = rule === null
    ? "Combining rule not wired in yet. The public table does not publish one, so the prototype reports counts and makes no determination (open question Q1)."
    : rule;
  renderChecks();
}

function renderChecks() {
  const checks = noteChecks(state.rows, state.note);
  $("#checks").innerHTML = state.note.trim()
    ? checks.map((k) => `<li class="${k.ok ? "pass" : "miss"}">${chip(k.rule)} ${k.ok ? "Yes" : "Not yet"}: ${esc(k.text)}</li>`).join("")
    : "<li>Write the brief note to see the checks.</li>";
}

function setStep(n) {
  state.step = n;
  document.querySelectorAll("[data-step]").forEach((el) => { el.hidden = +el.dataset.step !== n; });
  document.querySelectorAll(".tab").forEach((t) => t.setAttribute("aria-selected", +t.dataset.go === n));
}

function renderAll() { renderSources(); renderTable(); $("#note").value = state.note; }

// Step 1: picking a source adds or removes its row.
$("#source-picks").addEventListener("change", (e) => {
  const name = e.target.value;
  if (e.target.checked) state.rows.push(emptyRow(name));
  else state.rows = state.rows.filter((r) => r.source !== name);
  renderTable();
});

// Step 2: edits.
$("#rows").addEventListener("input", (e) => {
  const tr = e.target.closest("tr"); if (!tr) return;
  const r = state.rows[+tr.dataset.i];
  if (e.target.classList.contains("src")) r.source = e.target.value;
  if (e.target.classList.contains("finding")) r.finding = e.target.value;
  if (e.target.classList.contains("reason")) r.reason = e.target.value;
  // Only the status cells and summary change while typing, so focus stays in the field.
  // Every row's status is refreshed because a source name edit can add or clear a T2 flag elsewhere.
  const dups = duplicateSources(state.rows);
  document.querySelectorAll("#rows tr").forEach((row) => {
    row.querySelector(".status").innerHTML = statusHtml(state.rows[+row.dataset.i], dups);
  });
  renderSummary();
});
$("#rows").addEventListener("focusout", (e) => {
  if (e.target.classList.contains("src")) { renderSources(); renderTable(); }
});
$("#rows").addEventListener("click", (e) => {
  const tr = e.target.closest("tr"); if (!tr) return;
  const i = +tr.dataset.i;
  if (e.target.dataset.a) {
    state.rows[i].answer = e.target.dataset.a;
    if (e.target.dataset.a !== "Inconclusive") state.rows[i].reason = "";
    renderTable();
  }
  if (e.target.classList.contains("del")) { state.rows.splice(i, 1); renderAll(); }
});
$("#add").addEventListener("click", () => { state.rows.push(emptyRow()); renderTable(); });

// Step 3: the note.
$("#note").addEventListener("input", (e) => { state.note = e.target.value; renderChecks(); });

document.querySelectorAll(".tab").forEach((t) => t.addEventListener("click", () => setStep(+t.dataset.go)));
document.querySelectorAll("[data-next]").forEach((b) => b.addEventListener("click", () => setStep(+b.dataset.next)));
// Constructed cases: one button each, so the page can be shown leaning either way or split.
$("#cases").innerHTML = CASES.map((c) => `<button type="button" data-case="${c.id}" title="${esc(c.summary)}">${esc(c.label)}</button>`).join("");
$("#cases").addEventListener("click", (e) => {
  const c = CASES.find((x) => x.id === e.target.dataset.case); if (!c) return;
  state.rows = c.rows.map((r) => ({ ...r }));
  state.note = c.note;
  $("#case-name").textContent = `${c.label}. ${c.summary} Fictional, for demonstration.`;
  renderAll();
  setStep(2);
});

$("#questions").innerHTML = OPEN_QUESTIONS.map((q) => `<li><b>${q.id}.</b> ${esc(q.text)} <span class="blocks">Blocks: ${esc(q.blocks)}.</span></li>`).join("");
$("#clear").addEventListener("click", () => { state.rows = []; state.note = ""; $("#case-name").textContent = ""; renderAll(); setStep(1); });
$("#print").addEventListener("click", () => window.print());

renderAll();
setStep(1);
