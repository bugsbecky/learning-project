AIP.registerChapter({
  id: "16",
  summary: "Security is who Maya is, the private path to Bedrock, encryption, and hiding files she cannot see. Close meaning is not a pass.",
  problem: "If the website holds Bedrock keys, if calls go over the public internet when they must not, or if everyone can retrieve Legal drafts, you have an incident even when the answer is right.",
  why: "Exam stories stack limits. Private network. Customer-managed keys. Column rules on a lake. Do not train on our data. Team filters on search.",
  assistant: "Maya signs in. Her group is Engineering. The API checks her token. The worker runs in a private network and reaches Bedrock through a private endpoint. Search only returns Falcon files her group may see. HR handbooks stay in HR.",
  walkthrough: [
    "Maya signs in. The app learns her group.",
    "The website never holds Bedrock keys.",
    "The worker calls Bedrock through a private door.",
    "Search filters by her group.",
    "Files at rest use company keys.",
    "Secret scans stop a passport photo before it is indexed."
  ],
  services: [
    {
      name: "Cognito plus IAM",
      importance: "CORE",
      solves: "Humans sign in. The app role calls Bedrock. File rules come from the human, not from a field the model invented.",
      how: "Maya's groups become the search filter. The Bedrock call uses the worker's role. Tool workers get an even narrower role.",
      connects: ["API Gateway", "Knowledge Base filters", "Lake Formation"],
      input: "A sign-in token plus the question.",
      output: "An allowed call with a filter bound to the real user."
    },
    {
      name: "Private endpoints plus encryption keys",
      importance: "CORE",
      solves: "No public internet path to Bedrock when the story forbids it. Encrypted files and indexes.",
      how: "A private endpoint is a door inside AWS. An S3-only door does not reach Bedrock. Use the Bedrock endpoint services.",
      connects: ["Private subnets", "security groups", "CloudTrail"],
      input: "A call from private compute.",
      output: "Inference without a public IP path."
    },
    {
      name: "PII discovery and lake rules",
      importance: "IMPORTANT",
      solves: "Find secrets in buckets. Hide columns in tables. Redact before embed.",
      how: "Scan the knowledge bucket. Redact or skip bad chunks. When the story is a data lake, table and column grants matter too.",
      connects: ["S3", "ingest workflow", "Guardrails"],
      input: "Objects and tables that might become CONTEXT.",
      output: "Only allowed, minimized text reaches search and the prompt."
    }
  ],
  alternatives: [
    { option: "Private path plus IAM plus filters plus keys", when: "Company default", pros: "No public Bedrock path. Rules at retrieve time.", cons: "You must list the right endpoint services." },
    { option: "Public path through NAT", when: "A lab with no private-path rule", pros: "Fewer endpoints", cons: "Fails must not use the public internet stories." },
    { option: "Keys in the website", when: "Never", pros: "Fewer hops", cons: "Keys leak." }
  ],
  examAsks: [
    "Bedrock private endpoints versus NAT versus an S3-only endpoint.",
    "Team filters on Knowledge Bases. Meaning search is not permission.",
    "Find secrets in the bucket. Redact. Use lake grants when the story is columns."
  ],
  realApp: "Engineering sees Falcon design notes. HR sees the handbook. Neither sees payroll files. A Legal prefix uses a separate key and is omitted from the default knowledge base. A passport scan stops ingest.",
  sections: [
    {
      heading: "Bedrock and training data",
      paragraphs: [
        "Bedrock does not use your prompts to train the base models unless you opt into a feature that says otherwise. Keep files in your account. Retrieve at answer time. Do not fine-tune on the whole intranet for a policy FAQ."
      ]
    },
    {
      heading: "Layers around search",
      paragraphs: [
        "Bucket rules stop anonymous reads. IAM stops other apps. Filters stop the wrong team. Guardrails catch leftover secrets. Tool IAM stops extra API calls. Missing a layer is a security miss even if search quality is fine."
      ]
    }
  ]
});
