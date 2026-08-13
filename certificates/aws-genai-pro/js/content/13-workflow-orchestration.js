AIP.registerChapter({
  id: "13",
  summary: "Orchestration is the choice between a model that plans and a workflow you already know. Match freedom to risk.",
  problem: "An agent that invents the next step is the wrong boss for parse, redact, embed, index. A rigid machine is the wrong boss for which of 12 APIs does this sentence need.",
  why: "Exam stories hide this choice behind tickets, ingest, or throttling. Known steps want a workflow. Unknown next action wants an agent with tight tools.",
  assistant: "A new handbook is a known pipeline. File lands. Text is extracted. Chunks are stored. Maya's chat stays on search until she asks for a ticket. Then an agent runs. A risky write waits for a person. If Bedrock is busy, the app shows search hits instead of retrying until the bill explodes.",
  walkthrough: [
    "HR uploads a PDF. That is a known pipeline.",
    "A workflow runs extract, clean, split, and index.",
    "Maya's FAQ still uses search-and-answer.",
    "Open a ticket uses an agent.",
    "A dangerous write waits for a lead.",
    "If the model is throttled, show search hits and stop hammering."
  ],
  services: [
    {
      name: "AWS Step Functions",
      importance: "CORE",
      solves: "Known multi-step work you can audit. Retries. Parallel maps. Human wait.",
      how: "Ingest is a state machine. Ticket approval can pause until a person clicks yes. Catch busy-model errors with backoff.",
      connects: ["EventBridge", "Lambda", "Bedrock", "DynamoDB"],
      input: "A typed event like file created or ticket requested.",
      output: "A finished pipeline, a wait for a person, or a controlled failure."
    },
    {
      name: "Amazon EventBridge",
      importance: "CORE",
      solves: "Fan-out from a file event without tying chat to ingest.",
      how: "A new PDF can start ingest and a secret scan at the same time. Maya's question does not wait on that work.",
      connects: ["S3", "Step Functions", "SQS", "Knowledge Bases"],
      input: "An event like object created.",
      output: "The right workflow starts."
    },
    {
      name: "A circuit breaker",
      importance: "IMPORTANT",
      solves: "Stop calling a failing model after repeated errors.",
      how: "Count failures. If the gate is open, skip the model and return search hits. Later, try one probe call.",
      connects: ["Bedrock", "CloudWatch", "AppConfig"],
      input: "Errors from the model or a tool.",
      output: "Call, skip, or probe."
    }
  ],
  alternatives: [
    { option: "Agent", when: "The next tool is unknown", pros: "Flexible for open a ticket from this doc", cons: "Loops and cost. Needs stops." },
    { option: "Step Functions", when: "The graph is known", pros: "Audit, retries, human wait", cons: "Poor at open-ended what should I do next." },
    { option: "Lambda calling Lambda", when: "Two steps in a prototype", pros: "Fast to write", cons: "Easy to lose retries and timeouts." }
  ],
  examAsks: [
    "New PDF must be searchable soon. That is events plus a workflow. Not an agent.",
    "Human wait is a workflow pause. Not a longer timeout. Not ask the model to be careful.",
    "Busy model. Back off and degrade. Do not retry forever from chat."
  ],
  realApp: "travel-v3.pdf starts ingest. Maya's ticket ask drafts fields, then waits for a lead. If Bedrock is down, the UI still shows handbook hits without a written summary.",
  sections: [
    {
      heading: "Do not pull ingest into chat",
      paragraphs: [
        "Chat is request and stream. Ingest is an event. If you load a PDF during Maya's keystroke, you inherit a long job into a short wait."
      ]
    }
  ]
});
