import {
  ANSWERS, SUGGESTED_SOURCES, emptyRow, rowIssues, duplicateSources, sourceKey,
  convergence, convergenceLine, combineRule, noteChecks,
} from "./core.js";

// State lives in memory only. Nothing is stored or sent anywhere.
const state = { rows: [], note: "", step: 1 };

// A constructed case for the demo. Fictional, written to exercise every rule; not clinical guidance.
const SAMPLE = {
  rows: [
    { source: "Classroom observation", finding: "Follows multi-step directions and takes turns in group work; asks peers to repeat new vocabulary.", answer: "No", reason: "" },
    { source: "Teacher interview", finding: "Participates in class discussion; teacher notes growth since fall in academic vocabulary.", answer: "No", reason: "" },
    { source: "Language sample", finding: "Narrative is organized with clear sequence; dialect features are consistent with the home community.", answer: "No", reason: "" },
    { source: "Parent interview", finding: "Communicates well at home and with cousins in both languages; no concerns at home.", answer: "No", reason: "" },
    { source: "Standardized assessment", finding: "Receptive and expressive scores below the norm; the normative sample does not match the student's language history.", answer: "Inconclusive", reason: "Norms do not fit this student's language background." },
  ],
  note: "4 of 4 interpretable sources support difference; the standardized assessment is inconclusive and not counted because its norms do not fit this student's language background.",
};

const $ = (sel) => document.querySelector(sel);
const esc = (s) => s.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

function renderSources() {
  const chosen = new Set(state.rows.map((r) => r.source));
  $("#source-picks").innerHTML = SUGGESTED_SOURCES.map((s) =>
    `<label class="pick"><input type="checkbox" value="${esc(s)}" ${chosen.has(s) ? "checked" : ""}> ${esc(s)}</label>`
  ).join("");
}

function renderTable() {
  const dups = duplicateSources(state.rows);
  $("#rows").innerHTML = state.rows.map((r, i) => {
    const issues = rowIssues(r);
    const dup = r.source.trim() !== "" && dups.includes(sourceKey(r.source));
    return `<tr data-i="${i}">
      <td><textarea class="src" aria-label="Data source" rows="2" placeholder="Data source">${esc(r.source)}</textarea></td>
      <td><textarea class="finding" aria-label="Finding" rows="3" placeholder="What the source showed">${esc(r.finding)}</textarea></td>
      <td>
        <div class="seg" role="radiogroup" aria-label="Disorder?">
          ${ANSWERS.map((a) => `<button type="button" class="ans${r.answer === a ? " on" : ""}" data-a="${a}" role="radio" aria-checked="${r.answer === a}">${a}</button>`).join("")}
        </div>
        ${r.answer === "Inconclusive" ? `<textarea class="reason" aria-label="Reason inconclusive" rows="2" placeholder="One-line reason">${esc(r.reason)}</textarea>` : ""}
      </td>
      <td class="status">${issues.length || dup
        ? `<ul>${issues.map((x) => `<li><span class="rule">${x.rule}</span> ${esc(x.text)}</li>`).join("")}${dup ? `<li><span class="rule">T2</span> Counts as one source with another row. Merge them.</li>` : ""}</ul>`
        : `<span class="ok">Counted</span>`}
        <button type="button" class="del" aria-label="Remove row">Remove</button></td>
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
  const rule = combineRule(c);
  $("#rule").textContent = rule === null
    ? "Combining rule not wired in yet. The public table does not publish one, so the prototype reports counts and makes no determination (open question Q1)."
    : rule;
  renderChecks();
}

function renderChecks() {
  const checks = noteChecks(state.rows, state.note);
  $("#checks").innerHTML = state.note.trim()
    ? checks.map((k) => `<li class="${k.ok ? "pass" : "miss"}"><span class="rule">${k.rule}</span> ${k.ok ? "Yes" : "Not yet"}: ${esc(k.text)}</li>`).join("")
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
  // Only the status cell and summary change while typing, so focus stays in the field.
  const issues = rowIssues(r);
  tr.querySelector(".status").innerHTML = (issues.length
    ? `<ul>${issues.map((x) => `<li><span class="rule">${x.rule}</span> ${esc(x.text)}</li>`).join("")}</ul>`
    : `<span class="ok">Counted</span>`) + `<button type="button" class="del" aria-label="Remove row">Remove</button>`;
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
$("#sample").addEventListener("click", () => {
  state.rows = SAMPLE.rows.map((r) => ({ ...r }));
  state.note = SAMPLE.note;
  renderAll();
  setStep(2);
});
$("#clear").addEventListener("click", () => { state.rows = []; state.note = ""; renderAll(); setStep(1); });
$("#print").addEventListener("click", () => window.print());

renderAll();
setStep(1);
