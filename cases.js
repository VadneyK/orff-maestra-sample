// Constructed cases for demos and pilot sessions. Fictional, written to exercise the rules,
// not clinical guidance. Each one leads to a different convergence line, so a reviewer can see
// the page does not lean one way. test/trace.test.mjs checks that each case is complete and
// gives the line in `expect`.

export const CASES = [
  {
    id: "A",
    label: "Case A: difference",
    expect: "difference",
    summary: "Bilingual student whose test norms do not fit; naturalistic sources show typical communication.",
    rows: [
      { source: "Classroom observation", finding: "Follows multi-step directions and takes turns in group work; asks peers to repeat new vocabulary.", answer: "No", reason: "" },
      { source: "Teacher interview", finding: "Participates in class discussion; teacher notes growth since fall in academic vocabulary.", answer: "No", reason: "" },
      { source: "Language sample", finding: "Narrative is organized with clear sequence; dialect features are consistent with the home community.", answer: "No", reason: "" },
      { source: "Parent interview", finding: "Communicates well at home and with cousins in both languages; no concerns at home.", answer: "No", reason: "" },
      { source: "Standardized assessment", finding: "Scores below the norm; the normative sample does not match the student's language history. A testing-the-limits probe with extra examples raised accuracy.", answer: "Inconclusive", reason: "Norms do not fit this student's language background." },
    ],
    note: "4 of 4 interpretable sources support difference; the standardized assessment is inconclusive and not counted because its norms do not fit this student's language background.",
  },
  {
    id: "B",
    label: "Case B: disorder",
    expect: "disorder",
    summary: "Sources agree across settings that communication is limited, beyond what dialect or language history explains.",
    rows: [
      { source: "Classroom observation", finding: "Loses track of multi-step directions even with visual supports; peers often finish the student's sentences.", answer: "Yes", reason: "" },
      { source: "Teacher interview", finding: "Teacher reports the student rarely joins discussion and is hard to follow when retelling a lesson.", answer: "Yes", reason: "" },
      { source: "Language sample", finding: "Retell lacks sequence and key events; errors are not features of the home dialect.", answer: "Yes", reason: "" },
      { source: "Parent interview", finding: "Relatives often ask the student to repeat in the home language; family has had concerns since preschool.", answer: "Yes", reason: "" },
      { source: "Standardized assessment", finding: "Scores below the norm on a measure normed on similar students; errors persisted in a testing-the-limits probe.", answer: "Yes", reason: "" },
    ],
    note: "5 of 5 interpretable sources support disorder; 0 sources inconclusive. The standardized assessment agrees with the classroom observation, teacher interview, language sample and parent interview.",
  },
  {
    id: "C",
    label: "Case C: split (Q2)",
    expect: "split",
    summary: "Home and school sources disagree, so the tie wording the table leaves open (Q2) shows on screen.",
    rows: [
      { source: "Classroom observation", finding: "Follows routines and works well in pairs; quiet in whole-class discussion.", answer: "No", reason: "" },
      { source: "Teacher interview", finding: "Teacher is concerned the student cannot explain reasoning in math or science.", answer: "Yes", reason: "" },
      { source: "Language sample", finding: "Conversational sample is organized; dialect features match the home community.", answer: "No", reason: "" },
      { source: "Parent interview", finding: "Family reports the student struggles to tell stories in either language.", answer: "Yes", reason: "" },
      { source: "Standardized assessment", finding: "Testing stopped early when the student became unwell; no testing-the-limits probe was possible.", answer: "Inconclusive", reason: "Testing was not completed." },
    ],
    note: "2 of 4 interpretable sources support disorder and 2 support difference; the standardized assessment is inconclusive and not counted because testing was not completed.",
  },
];
