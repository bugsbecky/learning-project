AIP.registerChapter({
  id: "25",
  summary: "Most exam items are pattern matching. Search-and-answer. Agent. Model door. Background ingest. Pick the smallest pattern that fits.",
  problem: "If you start from a product list, every option looks possible. If you start from Maya's job, the extras fall away.",
  why: "The exam will mix patterns in one story. Search plus private network plus safety plus streaming.",
  assistant: "Maya's default job is a cited answer from private files. That is RAG. Open a ticket is an agent. All model calls go through one company door. New PDFs enter through a background pipeline. They never ride the chat wait.",
  walkthrough: [
    "Name the job in one line.",
    "If the answer should be in files, use RAG.",
    "If Maya needs a live action, add an agent.",
    "Keep one secured door for every model call.",
    "Keep ingest on events, not on her keystroke.",
    "Do not add extra patterns for completeness."
  ],
  services: [
    {
      name: "RAG pattern",
      importance: "CORE",
      solves: "Cited Q and A over changing private files without training.",
      how: "Ingest. Search with team filters. Prompt with CONTEXT. Write. Cite. Ground. Knowledge Bases is the least-work build.",
      connects: ["S3", "OpenSearch", "Prompt Management", "Guardrails"],
      input: "A question whose answer should be in the files.",
      output: "A cited answer or a refusal."
    },
    {
      name: "Agent pattern",
      importance: "CORE",
      solves: "Tool use when the next step is unknown.",
      how: "Bedrock Agents plus small tools plus optional search. Stop conditions. Do not use an agent for a static FAQ.",
      connects: ["Lambda tools", "approval workflow", "Knowledge Bases"],
      input: "An ask that needs APIs or multi-step work.",
      output: "A final answer plus allowed side effects."
    },
    {
      name: "Model door plus background ingest",
      importance: "CORE",
      solves: "One secured API to many models, and a fresh index.",
      how: "The door does login, routing, safety, and logs. Ingest does file to index. Batch jobs are cousins of ingest. They are not a chat protocol.",
      connects: ["AppConfig", "EventBridge", "CloudWatch"],
      input: "Maya asks, or a file is created.",
      output: "A completion, or an updated index. Not both in one wait."
    }
  ],
  alternatives: [
    { option: "Managed Knowledge Bases RAG", when: "Internal Q and A, least extra work", pros: "Sync and citations", cons: "Odd parsers may still need a small job." },
    { option: "RAG plus agent", when: "Q and A plus tickets", pros: "Covers the action ask", cons: "More failure modes. Add only when needed." },
    { option: "Train on company PDFs", when: "Almost never for facts that change", pros: "Style maybe", cons: "Stale. Compliance. Cost. Usual trap." }
  ],
  examAsks: [
    "Name the pattern first. Then name the managed AWS build.",
    "Least extra work versus most control.",
    "Do not combine every pattern for completeness."
  ],
  realApp: "Travel pay is RAG. Falcon summary is RAG, maybe a stronger model. Open a ticket is agent plus approval. All five share the same door. All files share background ingest.",
  sections: [
    {
      heading: "Writing flow versus workflow versus agent",
      paragraphs: [
        "Prompt Flows are writing steps. Step Functions are known AWS steps, approvals, and ingest. Agents are model-planned tool calls. The exam usually wants the one that matches the bottleneck in the story."
      ]
    }
  ]
});
