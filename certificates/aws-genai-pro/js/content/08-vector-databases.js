AIP.registerChapter({
  id: "08",
  summary: "A vector database stores those number lists plus labels. Search can then say: close in meaning, and Maya is allowed to see it.",
  problem: "Meaning search over millions of chunks with team and date filters is not a simple table dump. The wrong store either cannot filter or creates too much busywork.",
  why: "This is a big Domain 1 topic. You must pick a store that can filter. Meaning match is not permission.",
  assistant: "Each handbook chunk is a row of numbers plus labels like team=HR and language=en. Maya is in HR. Search must hide Legal drafts even if those drafts are close in meaning.",
  walkthrough: [
    "Chunks land in the store with text, numbers, and labels.",
    "Maya asks a question.",
    "Search finds nearby chunks.",
    "Labels drop chunks her group cannot see.",
    "Only the remaining text goes into the prompt."
  ],
  services: [
    {
      name: "Amazon OpenSearch (including Serverless)",
      importance: "CORE",
      solves: "Meaning search plus keyword search plus filters. Serverless means less cluster babysitting.",
      how: "Store numbers and the original words. Keyword search catches SOC2. Meaning search catches paraphrases. Labels enforce team rules.",
      connects: ["Bedrock Knowledge Bases", "Lambda", "IAM", "S3"],
      input: "Numbers plus text plus labels.",
      output: "Ranked hits with the text to put in the prompt."
    },
    {
      name: "Aurora PostgreSQL with pgvector",
      importance: "IMPORTANT",
      solves: "Keep vectors next to data you already store in Postgres.",
      how: "Use this when the company already runs Aurora and the scale is modest. You own more index care.",
      connects: ["Lambda", "IAM"],
      input: "A row with an embedding and keys.",
      output: "The nearest rows plus joins."
    },
    {
      name: "Amazon DynamoDB",
      importance: "IMPORTANT",
      solves: "Labels, session state, and sync bookmarks. Not the engine for millions of nearest-neighbor searches.",
      how: "Store who owns a file, when it changed, and the last sync token. Pair it with S3 so ingest can skip unchanged files.",
      connects: ["S3", "Lambda", "session table"],
      input: "Per-file or per-chunk labels.",
      output: "Filter keys and change-detection state."
    }
  ],
  alternatives: [
    { option: "OpenSearch Serverless plus Knowledge Bases", when: "Large index, filters, little extra work", pros: "Exam-favored default", cons: "Cost model differs from clusters." },
    { option: "Aurora pgvector", when: "You already live in Postgres and scale is modest", pros: "One database skill set", cons: "More care at very large scale." },
    { option: "A graph database", when: "Who reports to whom questions", pros: "Relationship walks", cons: "Wrong default for a handbook FAQ." },
    { option: "DynamoDB as the main vector engine", when: "Never at millions of chunks", pros: "Fast key lookup", cons: "Not your main meaning search." }
  ],
  examAsks: [
    "Least extra work plus filters plus Bedrock search. OpenSearch Serverless plus Knowledge Bases.",
    "If you need date and team filters, a store that cannot filter on those labels is a trap.",
    "Update one changed file versus rebuild every night."
  ],
  realApp: "The HR index returns chunk text, file link, and page. A second check still confirms Maya's group. Only then does text enter the prompt.",
  sections: [
    {
      heading: "Labels are a security control",
      paragraphs: [
        "Team, secrecy, and date are how you hide the wrong files. Close meaning is not a pass. Always filter before the model sees text."
      ]
    }
  ]
});
