AIP.registerChapter({
  id: "19",
  summary: "Watching a GenAI app means traces, prompt logs, token counts, and grounding scores. Access logs alone cannot explain a bad answer.",
  problem: "A timeout, a wrong per-diem, and a huge bill look like three mysteries if you only have error logs. You need to split search time from write time.",
  why: "The exam distinguishes app logs, CloudTrail, and Bedrock prompt logs. Hallucination is observed. It is not one magic metric named Hallucination.",
  assistant: "Maya reports a wrong travel number. You join her request id to the prompt log, the search hits, and the file version. You see the chat still used travel-v2.pdf. The new file had not finished ingest.",
  walkthrough: [
    "Every ask stores a request id.",
    "You record model, prompt version, search time, write time, and tokens.",
    "Prompt logs keep the actual text in a locked bucket.",
    "A trace shows which hop was slow.",
    "Alarms fire on throttles, long waits, and cost spikes."
  ],
  services: [
    {
      name: "Amazon CloudWatch",
      importance: "CORE",
      solves: "Counts and alarms for calls, errors, throttles, and your own token metrics.",
      how: "Watch throttle count, time to first word, and cost per chat. An alarm can flip a cheaper model or open a circuit breaker.",
      connects: ["EventBridge", "X-Ray", "dashboards"],
      input: "Service metrics plus custom token counts.",
      output: "Graphs and alarms that point at throttle, search, or write."
    },
    {
      name: "Bedrock invocation logging",
      importance: "CORE",
      solves: "What was actually sent to the model and what came back.",
      how: "This is forensics. It is not CloudTrail. Lock the bucket. Encrypt it. Do not make it public.",
      connects: ["S3", "KMS", "CloudWatch Logs"],
      input: "Runtime model calls.",
      output: "Prompt and completion records you can join on request id."
    },
    {
      name: "X-Ray and agent traces",
      importance: "IMPORTANT",
      solves: "Where time went, and why a tool was called twice.",
      how: "A map of API to worker to Bedrock. Agent traces show the think-and-act loop. You may learn search is slow, not the model.",
      connects: ["API Gateway", "Lambda", "Agents"],
      input: "A request with tracing on.",
      output: "Per-step timings and tool spans."
    }
  ],
  alternatives: [
    { option: "CloudWatch plus invocation logs plus traces", when: "Production default", pros: "Ops, forensics, and cost", cons: "Prompt logs are sensitive." },
    { option: "CloudTrail only", when: "Who changed IAM or prompts", pros: "Control-plane audit", cons: "Will not show the prompt that caused a bad answer." },
    { option: "Access logs only", when: "HTTP errors at the edge", pros: "Useful", cons: "No tokens. No grounding. No tool traces." }
  ],
  examAsks: [
    "Prompt body logs versus CloudTrail versus app logs. Pick the one that answers the stem.",
    "Token counts and throttle alarms are cost and speed signals.",
    "Hallucination proxies include grounding score, missing sources, and thumbs-down. There is no one DetectHallucination API as the whole design."
  ],
  realApp: "Wrong per-diem traces to an old PDF still in the index. A cost spike traces to a template that suddenly included a huge summary. A morning outage traces to throttles and an open breaker.",
  sections: [
    {
      heading: "What to alarm on first",
      paragraphs: [
        "Throttles. Timeouts. Slow p99. A spike in safety blocks. Cost per thousand asks. Failed knowledge sync. Do not alarm on answer does not equal one golden sentence."
      ]
    }
  ]
});
