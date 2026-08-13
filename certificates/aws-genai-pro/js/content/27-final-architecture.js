AIP.registerChapter({
  id: "27",
  summary: "The Knowledge Assistant is one path. Login. API. Router. Search. Write. Tools. Safety. Stream. Log. Test. This chapter wires the pieces into one morning.",
  problem: "Passing means walking one question hop by hop. If you cannot walk travel pay and open a ticket, a stacked story will feel like trivia.",
  why: "If a later mock stem adds a private network, a fairness report, or a cost cap, you should know which hop changes.",
  assistant: "It is 9am. Maya opens the internal chat. She signs in. She asks about Falcon security rules. The router picks a model. Search uses her Engineering group. Words stream back with sources. She then asks to open a ticket. That uses an agent and a wait for a lead. HR uploads a new handbook in the background. Legal's prompt change fails a faithfulness gate. Nobody trained a model.",
  walkthrough: [
    "Maya signs in.",
    "The API accepts the live chat.",
    "A router picks the model.",
    "Session memory loads.",
    "Search runs with her group filter.",
    "The prompt template plus CONTEXT go to Bedrock with Guardrails.",
    "Words stream back. Sources show.",
    "A ticket ask uses tools and may wait for a person.",
    "New files ingest in the background.",
    "Logs, tests, and cost controls run beside all of that."
  ],
  services: [
    {
      name: "Interactive Q and A path",
      importance: "CORE",
      solves: "Cited, permissioned answers without training on company data.",
      how: "Sign-in, live API, private worker, search with filters, prompt alias, Guardrails, stream, store turns, emit metrics. A FAQ cache can skip the model.",
      connects: ["Chapters 05, 09 to 10, 14 to 16, 19 to 21"],
      input: "What is our travel pay rule, plus Maya's identity.",
      output: "A streamed answer, handbook section 4.2, and audit fields."
    },
    {
      name: "Action path",
      importance: "CORE",
      solves: "Side effects that search cannot perform.",
      how: "A small classify step sends ticket asks to an agent. Lambda checks fields. High-risk creates wait. No raw SQL tool.",
      connects: ["Chapters 11 to 13, 15"],
      input: "Open a ticket from this internal document.",
      output: "A plan plus a draft ticket id after approval, or a refusal."
    },
    {
      name: "Ingest, test, and operate",
      importance: "CORE",
      solves: "Fresh knowledge, proven quality, and a bill you can live with.",
      how: "File save starts a workflow. CI runs eval gates. Ops watches tokens and throttles. Governance stores versions on every answer.",
      connects: ["Chapters 06, 17 to 23"],
      input: "A new PDF, a prompt change, or an alarm.",
      output: "An updated index, a promoted alias, or a safe degraded chat."
    }
  ],
  alternatives: [
    { option: "This Bedrock-centric design", when: "The exam's company assistant story", pros: "Least extra work that still covers the domains", cons: "Not a hosted custom model. Add SageMaker only if required." },
    { option: "Buy a ready-made assistant product", when: "Buy not build", pros: "Faster", cons: "Wrong if the story demands a custom app you own." },
    { option: "Train on the intranet", when: "Never for this product", pros: "None", cons: "Compliance and staleness." }
  ],
  examAsks: [
    "Walk the hops in order. Login before search. Search before write. Safety on both sides. Stream the output. Ingest in the background.",
    "Which hop changes for private network, fairness, cost cap, or human wait.",
    "Sources come from search metadata. Not from the model's general memory."
  ],
  realApp: "9:02 Engineering asks about Falcon. Filter includes project Falcon. Cited controls. No ticket. 9:05 the same person asks to open a change ticket. Agent path. Approval. 9:06 HR uploads travel-v3.pdf. Ingest. Canary. Cache bust. 9:10 a prompt change fails the gate. 9:15 a throttle alarm opens the breaker. FAQ still served from cache plus keyword search.",
  sections: [
    {
      heading: "You are done when",
      paragraphs: [
        "You can take any chapter's tool and point to where it sits on Maya's path. What it gets. What it gives. What fails if you remove it. Then do the quizzes. Restudy choices, not only product names."
      ]
    }
  ]
});
