AIP.registerChapter({
  id: "10",
  summary: "Bedrock Knowledge Bases is managed RAG. It can connect a folder, split files, embed, store, search, and answer with sources.",
  problem: "Building parsers, embed jobs, and sync workers is months of work that every company repeats. The exam often asks for the least extra work.",
  why: "If the story does not force a custom parser or a graph, Knowledge Bases is the default for company search-and-answer on AWS.",
  assistant: "The company points Knowledge Bases at the company folder. HR files sit under an HR prefix. When Maya asks, RetrieveAndGenerate returns an answer plus sources. The app still applies Maya's team filter.",
  walkthrough: [
    "Point Knowledge Bases at the S3 folder.",
    "Choose how to split files and which embedding model to use.",
    "Sync when files change.",
    "Maya asks a question.",
    "The API can return passages or a full cited answer.",
    "Your app still passes who Maya is so the wrong team files stay hidden."
  ],
  services: [
    {
      name: "Amazon Bedrock Knowledge Bases",
      importance: "CORE",
      solves: "Managed ingest plus search plus answer against private data.",
      how: "A data source feeds a split-and-embed pipeline into a vector store. Maya's question can retrieve passages or a grounded answer with citations.",
      connects: ["S3", "OpenSearch", "Bedrock models", "IAM"],
      input: "Question plus knowledge base id plus optional filters.",
      output: "Passages, or an answer plus sources."
    }
  ],
  alternatives: [
    { option: "Knowledge Bases", when: "Standard company RAG and least extra work", pros: "Sync, split, citations", cons: "Odd parsers may still need a small custom step." },
    { option: "Your own OpenSearch plus jobs", when: "Search logic Knowledge Bases cannot express", pros: "Maximum control", cons: "You own the pipeline." },
    { option: "Amazon Kendra", when: "Classic enterprise search as a product", pros: "Strong search features", cons: "Often more than you need if Bedrock plus OpenSearch already fits. Know it exists." }
  ],
  examAsks: [
    "RetrieveAndGenerate is grounded RAG. A raw stream call is just the model talking.",
    "Filters for language, date, and document type belong on retrieve.",
    "A long RetrieveAndGenerate call on a short web wait needs streaming, not a queue poll."
  ],
  realApp: "Knowledge base id is corp-assistant. Filter is department in Maya's groups. Citations are links to the intranet viewer. A grounding check rejects answers that drift from the found text.",
  sections: [
    {
      heading: "What Knowledge Bases does not replace",
      paragraphs: [
        "It does not replace login and private networking. It does not replace ticket tools. It does not replace tests. It is the managed middle of search-and-answer."
      ]
    },
    {
      heading: "Keep a clause together",
      paragraphs: [
        "Hierarchical split keeps a parent section with its child chunks. That way reimbursement caps stay with section 4.2. Filters are part of retrieve, not a later hope."
      ]
    }
  ]
});
