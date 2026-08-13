AIP.registerChapter({
  id: "24",
  summary: "Fix by failure mode. Overflow. Search miss. Throttle. Prompt drift. Each has a different first fix. Use a bigger model is usually wrong.",
  problem: "To Maya it all looks like a bad answer or a timeout. The causes are opposite. Overflow needs less text. A miss needs better search. A sudden tone change is often a new prompt version.",
  why: "The exam gives logs and asks for the next action. Map evidence to the layer.",
  assistant: "Maya says the chat is wrong. You do not start by changing the model. You check tokens first. Then search hits. Then throttle metrics. Then which prompt version ran. Travel questions citing v2 after v3 uploaded is ingest lag, not a magic hallucination.",
  walkthrough: [
    "Get the request id.",
    "Check if the prompt was too full.",
    "Check which chunks were found.",
    "Check throttles and errors.",
    "Check prompt, guardrail, and knowledge versions.",
    "Apply one targeted fix."
  ],
  services: [
    {
      name: "Overflow check",
      importance: "CORE",
      solves: "Cut-off rules, lost middle, and silent dropped instructions.",
      how: "Log estimated tokens. If you are near the limit, summarize history, keep fewer chunks, or ask Maya to narrow the question.",
      connects: ["CloudWatch", "session summary", "Knowledge Bases"],
      input: "A failing ask with a huge input count.",
      output: "A trimmed path or an honest too large message."
    },
    {
      name: "Miss versus throttle versus drift",
      importance: "CORE",
      solves: "Three incidents that all look like the assistant is wrong or down.",
      how: "Miss means weak hits. Use hybrid search or rewrite or wait for ingest. Throttle means busy errors. Use backoff, reserved capacity, or a breaker. Drift means something changed at a timestamp. Check the audit log.",
      connects: ["OpenSearch logs", "CloudTrail", "AppConfig", "sync jobs"],
      input: "User report plus request id.",
      output: "One primary cause and a targeted fix."
    }
  ],
  alternatives: [
    { option: "Evidence first", when: "Always", pros: "Matches exam item style", cons: "Needs the logs from the watch chapter." },
    { option: "Always use a bigger model", when: "Never as default", pros: "Feels active", cons: "Cost. Does not fix misses, busy errors, or drift." },
    { option: "Turn off Guardrails to stop refusals", when: "Never without proving false blocks", pros: "Answers return", cons: "Safety regression." }
  ],
  examAsks: [
    "Acronym miss. Hybrid search or rewrite. Not a longer number list first.",
    "Busy errors. Backoff, reserved capacity, other region, breaker. Not raise memory as the main fix.",
    "Sudden quality change. Version drift. Not non-determinism as the whole answer."
  ],
  realApp: "Incident A is overflow from 30 turns plus 15 chunks. Fix is summary plus 5 chunks. Incident B is SOC2 miss. Fix is hybrid search. Incident C is 9am busy errors. Incident D is a draft prompt that dropped citation rules. Incident E is a disabled ingest rule.",
  sections: [
    {
      heading: "Symptom to first look",
      paragraphs: [
        "Memorize this map."
      ],
      bullets: [
        "Blank spinner. Stream path and timeouts.",
        "Fluent wrong fact. Search hits and grounding.",
        "Right source, old rule. Ingest and file version.",
        "Works in test, fails in prod. IAM, private path, filter, or alias.",
        "Tool storm. Max steps and replay keys.",
        "Secret in the answer. Ingest redaction plus Guardrails."
      ]
    }
  ]
});
