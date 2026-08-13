AIP.registerChapter({
  id: "21",
  summary: "Cost is tokens times price times retries. Use a small model for easy asks. Keep prompts short. Batch overnight work.",
  problem: "One call that stuffs 40 chunks, full history, and a huge instruction on a frontier model will dominate the bill. Timeouts that retry the same call double it.",
  why: "The exam wants routing, cache, smaller context, and batch versus live chat. Not buy a savings plan and hope.",
  assistant: "A cheap step first asks: is this a travel FAQ, a legal summary, or a ticket? FAQ uses a small model and cache. Legal uses a stronger model with only the best 5 chunks. Nightly summaries of new PDFs run as a batch job. Maya is not waiting on those.",
  walkthrough: [
    "Classify the ask with a small model or simple rules.",
    "Easy FAQ uses a cheap model and cache.",
    "Hard summaries use a stronger model with few chunks.",
    "Old chat turns are summarized so history stays short.",
    "Overnight jobs use batch pricing.",
    "A budget alarm can flip everyone to economy mode."
  ],
  services: [
    {
      name: "Tiered models",
      importance: "CORE",
      solves: "Pay for a strong model only when the question needs it.",
      how: "The same router from chapter 02 can also cut cost. A budget alarm can force the cheap model for a while.",
      connects: ["AppConfig", "CloudWatch", "circuit breaker"],
      input: "Question type plus current spend.",
      output: "A model that matches the job."
    },
    {
      name: "Shorter prompts plus cache",
      importance: "CORE",
      solves: "Input tokens are most of RAG cost.",
      how: "Keep 5 good chunks, not 40. Cache the static instruction. Prefer short quotes plus sources over whole pages.",
      connects: ["Knowledge Bases", "Prompt Management", "session summary"],
      input: "A naive huge prompt.",
      output: "A trimmed prompt with the same grounded answer."
    },
    {
      name: "Bedrock batch inference",
      importance: "IMPORTANT",
      solves: "Offline writing at batch prices.",
      how: "Submit a file of prompts. Get a file of answers. Use for eval sets and nightly digests. Not for Maya waiting in chat.",
      connects: ["S3", "Step Functions", "schedules"],
      input: "A file of prompts.",
      output: "A file of completions at a lower unit price."
    }
  ],
  alternatives: [
    { option: "Tiers plus cache plus short context plus batch", when: "Default production", pros: "Cuts the real cost drivers", cons: "Needs tests so quality does not fall." },
    { option: "Reserved capacity to save money", when: "Only if it stays busy", pros: "Can beat on-demand at high load", cons: "Idle reserved capacity costs more." },
    { option: "Tune storage classes only", when: "Those bills are real but not the GenAI stem", pros: "Good hygiene", cons: "Wrong when the expensive line is Bedrock tokens." }
  ],
  examAsks: [
    "Easy FAQ to a smaller model. Do not hard-code a frontier model for classify.",
    "Cache and fewer chunks before you buy more reserved capacity.",
    "Batch for overnight work. Stream for live chat."
  ],
  realApp: "Most spend was 20 overlapping handbook chunks. Dropping to 5 ranked chunks and caching a long instruction halved input tokens. Nightly digest moved to batch. Economy mode still answered travel FAQ from cache.",
  sections: [
    {
      heading: "Cost bugs that look like quality work",
      paragraphs: [
        "Retrying a full write on refresh without a replay key. An agent calling search 15 times. Ranking 200 chunks with an expensive model on every FAQ. Stop conditions save money too."
      ]
    }
  ]
});
