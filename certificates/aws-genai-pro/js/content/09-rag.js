AIP.registerChapter({
  id: "09",
  summary: "RAG means retrieve then generate. Find private chunks. Put them in the prompt. Write an answer that names them. That is how you get company truth without training.",
  problem: "Models invent policies. Training on documents is slow and still stale tomorrow. Keyword search returns links, not a short cited answer.",
  why: "Most Domain 1 stories are RAG design. Split, embed, hybrid search, optional second rank, rewrite the question, then permissions.",
  assistant: "Maya asks: Find the travel pay rule in the HR handbook. The chat must quote or name the section. It must not invent a generous stipend.",
  walkthrough: [
    "Maya asks about travel pay.",
    "The app may rewrite the question into better search words.",
    "Search finds nearby handbook chunks Maya may see.",
    "Those chunks go into the prompt as CONTEXT.",
    "The model writes an answer only from CONTEXT.",
    "The UI shows the file and section it used."
  ],
  services: [
    {
      name: "Retrieve then generate",
      importance: "CORE",
      solves: "Grounded answers with sources. No training on private files.",
      how: "Find chunks. Keep the best few. Fill the template. Write. Return the file links that came from search, not from the model's memory.",
      connects: ["Embeddings", "Vector store", "Bedrock", "Guardrails"],
      input: "Maya's question plus who she is.",
      output: "Answer plus source links."
    },
    {
      name: "Rewrite, split, or rank again",
      importance: "IMPORTANT",
      solves: "Vague questions and close-but-wrong chunks.",
      how: "A vague that travel thing becomes travel pay per diem. A second ranker can keep the best 5 of 50. Do this before you blame the embedding size.",
      connects: ["Lambda", "Knowledge Bases", "Prompt Management"],
      input: "Raw question plus candidate passages.",
      output: "Better search queries or a shorter shortlist."
    }
  ],
  alternatives: [
    { option: "Classic RAG", when: "Handbook and FAQ questions", pros: "Simple cited answers", cons: "Cannot open a ticket by itself." },
    { option: "RAG plus tools", when: "Maya also needs a live action", pros: "Covers ticket asks", cons: "More ways to fail." },
    { option: "Train instead of RAG", when: "Tone or a classifier, not weekly facts", pros: "Style", cons: "New PDFs will not show up on their own." },
    { option: "Paste the whole corpus", when: "A tiny folder that fits", pros: "No index", cons: "Cost, delay, mixed permissions." }
  ],
  examAsks: [
    "Exact medical or legal terms plus meaning. Hybrid search.",
    "Rewrite a vague question before you change embedding size.",
    "A grounding check is a brake after RAG. It is not RAG itself."
  ],
  realApp: "Question, optional rewrite, hybrid search with team filters, top chunks into the template, answer, handbook.pdf section 4.2 shown as the source.",
  sections: [
    {
      heading: "When RAG looks wrong",
      paragraphs: [
        "Wrong chunk but a confident answer. Missed acronym. Stale index. Prompt too full. Prompt that ignores CONTEXT. Each has a different fix. A bigger model is rarely first."
      ]
    }
  ]
});
