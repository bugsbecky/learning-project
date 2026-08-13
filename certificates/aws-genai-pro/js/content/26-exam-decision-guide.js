AIP.registerChapter({
  id: "26",
  summary: "Under time pressure, default to least extra work on Bedrock-managed features. Switch to most control only when the story forces it.",
  problem: "Two answers are often both valid AWS. The scored one matches the limit words. Least extra work. Lowest wait. Most secure. Most control.",
  why: "If you miss the limit verb, you pick the homemade option you would enjoy building.",
  assistant: "If Maya's story does not mention custom weights, exotic parsers, or a Kubernetes standard, pick Knowledge Bases, Prompt Management, Guardrails, Bedrock, Lambda, OpenSearch Serverless, private endpoints, routing config, and eval gates. Add a workflow for known pipelines. Add an agent only for tools. Add SageMaker only for a hosted model.",
  walkthrough: [
    "Read the last sentence first. That is the ask.",
    "Underline least extra work, lowest wait, most secure, or most control.",
    "Drop anything that trains on private data or puts keys in the browser.",
    "Drop polling for live word-by-word chat.",
    "If two remain, pick the one with fewer new moving parts unless control was requested."
  ],
  services: [
    {
      name: "Least extra work (default)",
      importance: "CORE",
      solves: "Most stories that say minimize management or least custom code.",
      how: "Bedrock plus Prompt Management plus Guardrails plus Knowledge Bases plus Lambda plus streaming plus Cognito plus private endpoints plus logs plus AppConfig plus eval jobs.",
      connects: ["Chapters 03, 05, 10, 15, 18, 22"],
      input: "A story without custom-model or custom-search limits.",
      output: "A managed design you can defend in a short paragraph."
    },
    {
      name: "Most control (when forced)",
      importance: "CORE",
      solves: "Custom splitters, hosted weights, or an existing Postgres estate the story names.",
      how: "Your own search pipeline. SageMaker endpoints. Container tool servers. You own scaling and patching.",
      connects: ["Chapters 08, 11, 22"],
      input: "Explicit limits like custom model or custom retrieval.",
      output: "A heavier design those limits actually require."
    }
  ],
  alternatives: [
    { option: "Knowledge Bases", when: "Standard RAG, least extra work", pros: "Managed sync and citations", cons: "Less exotic search." },
    { option: "Your own vector pipeline", when: "Custom retrieval logic", pros: "Control", cons: "You own the pipeline." },
    { option: "Bedrock on-demand", when: "No custom weights", pros: "No GPU", cons: "Catalog and region limits." },
    { option: "SageMaker endpoint", when: "You host the model", pros: "Control", cons: "Ops." },
    { option: "Prompt Management plus Guardrails", when: "Templates plus safety", pros: "Versioned", cons: "Team must use the platform." },
    { option: "Hybrid search", when: "Codes plus paraphrases", pros: "Fixes SOC2-style misses", cons: "Slightly more query work." },
    { option: "Bigger embedding size", when: "Never as the first quality move", pros: "Might help a little", cons: "Exam trap versus hybrid search." },
    { option: "Agent", when: "Unknown tool sequence", pros: "Flexible", cons: "Loops." },
    { option: "Step Functions", when: "Known pipeline or human wait", pros: "Deterministic", cons: "Not open-ended language." }
  ],
  examAsks: [
    "The limit word picks the family. Least extra work versus most control.",
    "Stacked limits still need a Bedrock private endpoint. An S3-only endpoint is not enough.",
    "If two answers both work, fewer moving parts wins unless control is requested."
  ],
  realApp: "FAQ is RAG plus Guardrails plus stream. Ticket is agent plus approval. Ingest is events plus workflow. Routing is AppConfig. Private is PrivateLink. Cost is tiers plus cache plus batch. Custom LoRA is SageMaker beside Bedrock search. Nothing trains on company PDFs.",
  sections: [
    {
      heading: "Frequent traps",
      paragraphs: [
        "These are real AWS products that show up as wrong answers."
      ],
      bullets: [
        "Train a new language model for a policy FAQ.",
        "Keys in the browser.",
        "Grow embedding size instead of hybrid search.",
        "File tags as prompt version control.",
        "S3-only endpoint as private access to Bedrock.",
        "Turn off Guardrails to improve recall.",
        "A graph database for a handbook FAQ."
      ]
    }
  ]
});
