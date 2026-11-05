# Pilot usability sessions: plan

A plan for the first sessions with practicing school SLPs, written so it can run in the first weeks of a build. Nothing here has been run yet. No students and no student records: every session uses the constructed cases in `cases.js` or new ones written the same way.

## What we want to learn

1. Can an SLP code a case from a written case packet without help, and does the page agree with how they would code it by hand?
2. Do the rule messages (T1 to T9) read as the table's own rules, or as the software second-guessing them?
3. Where do they hesitate? Each hesitation is either a screen to fix or a question for the spec author.

## Who

Five practicing school SLPs per round, recruited through the spec author's network. At least two who already use the paper table and two who have not. Sessions are 30 minutes over video, one facilitator and one note taker.

## Tasks

Each SLP gets a one-page packet for a constructed case (findings in prose, no codes) and the live page.

| # | Task | Done when | What we watch |
| --- | --- | --- | --- |
| 1 | Pick the sources in the packet and code each one. | Every row reads Counted or Listed, not counted. | Time per row; any row they code differently from the case key; whether they read the T3 and T5 messages. |
| 2 | The packet lists two standardized tests. Enter both. | They merge them into one row. | Does the T2 flag tell them what to do without help? |
| 3 | Read the convergence line aloud and say whether it matches their own count. | They say yes or name the difference. | Any mismatch is a bug or a misread rule, logged against its rule id. |
| 4 | Write the brief note as they would for the meeting. | All step 3 checks pass, or they say why one should not. | Whether the checks feel useful or in the way. |
| 5 | Open question round: show Q2 (ties) with Case C and Q6 (setting per row). | The answer is written down. | These answers go to the spec author, not straight into code. |

## Measures

- Rows coded the same as the case key, out of all rows (target: every row, every SLP).
- Unaided completion of tasks 1 to 4.
- Time to a finished table for a five-source case.
- Every hesitation or wrong turn, tagged with the rule id or screen it happened on.

## What happens after a round

- A misread rule message: rewrite the message, keep the rule. Same week.
- A screen that slows an SLP down: change it and recheck with the next SLP.
- A disagreement about what the rule should be: it is not decided in the session. It goes to the spec author as a new open question with the SLP's words attached, and REQUIREMENTS.md changes only after the spec author answers.
- When clinicians and the developer disagree about how a screen should work, the deciding test is the next round: mock both versions cheaply (a click-through is enough), put both in front of two SLPs on the same case, and build the one that reaches the case key with fewer wrong turns.

## Before the first session

- Write two more constructed cases with the spec author, each with a case key (the codes the spec author would give).
- Have each SLP agree to notes and, if they choose, a recording. Recordings are stored outside the prototype and deleted once the round's notes are written.
