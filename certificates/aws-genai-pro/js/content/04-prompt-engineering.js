AIP.registerChapter({
  id: "04",
  summary: "A prompt is the instruction sheet. In a company, it is also a governed document. You version it. You fill blanks. You do not hide it in one person's laptop.",
  problem: "If every function has a slightly different instruction, Legal cannot approve the words. A fix in one place never reaches the others.",
  why: "The model does what the prompt allows. Role, format, and citation rules should be data the app loads. They should not be tribal knowledge.",
  assistant: "Maya asks about travel pay. The instruction always says: answer only from the found text. Name the section. Add this is not legal advice. HR tone can differ from Finance tone. The answer shape stays the same.",
  walkthrough: [
    "A shared template says how to answer.",
    "The app fills blanks like team name and language.",
    "Found handbook text is placed in a CONTEXT block.",
    "The model writes a short answer from that block.",
    "If the block is empty, the template says to admit that."
  ],
  services: [
    {
      name: "Amazon Bedrock Prompt Management",
      importance: "CORE",
      solves: "Reusable templates with versions and access control.",
      how: "Create one travel-answer template. Put blanks for team and locale. Publish a version. The app calls that version. A bad change can roll back.",
      connects: ["Guardrails", "CloudTrail", "IAM"],
      input: "Template plus run-time values, including found snippets.",
      output: "The full prompt sent to the model."
    },
    {
      name: "Amazon Bedrock Prompt Flows",
      importance: "IMPORTANT",
      solves: "A short chain of prompt steps, like classify then draft then check.",
      how: "Use a flow when the work is mostly writing steps. If Maya needs a ticket in Jira, that is an agent plus tools, not a bigger writing flow.",
      connects: ["Prompt Management", "Lambda", "Bedrock runtime"],
      input: "Maya's question plus a flow id.",
      output: "The final written result after the chain."
    }
  ],
  alternatives: [
    { option: "Prompt Management plus Guardrails", when: "Company default", pros: "Versions and safety in one platform", cons: "The team must learn those resources." },
    { option: "Strings in a database plus extra filters", when: "You need a unique step Guardrails cannot do", pros: "Full custom logic", cons: "Easy to forget on a new path. Common extra-work trap." },
    { option: "Prompt Flows", when: "Writing chains with little outside API work", pros: "Less workflow code for prompt-only jobs", cons: "Weak for ticket and HR system calls." }
  ],
  examAsks: [
    "Least upkeep for a shared format plus team tone plus filters. Prompt Management plus Guardrails.",
    "Many templates, regions, and an audit trail. Prompt Management plus CloudTrail. Not tags on files.",
    "A grounding score is a check after search. It is not a replacement for search."
  ],
  realApp: "System line: Answer only from CONTEXT. Name chunk ids. If CONTEXT is not enough, say you do not know. User line: Maya's question plus found chunks. A denied topic still blocks medical advice even if someone pastes symptoms.",
  sections: [
    {
      heading: "Simple prompt moves that matter",
      paragraphs: [
        "You already know fill-in-the-blank text. These extra moves show up on the exam."
      ],
      bullets: [
        "System instructions versus user text versus tool results.",
        "Ask for JSON when the next step is a form or a ticket.",
        "Rewrite a vague question before search, like expanding an acronym.",
        "Thumbs-down should lead to a new prompt version, not a silent edit in code."
      ]
    },
    {
      heading: "Follow-up questions need history",
      paragraphs: [
        "Maya then asks what about contractors? The app must remember the travel topic. Store turns on the server. Do not keep the only copy in the browser."
      ]
    }
  ]
});
