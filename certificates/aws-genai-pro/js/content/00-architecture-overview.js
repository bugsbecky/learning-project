AIP.registerChapter({
  id: "00",
  summary: "This course follows one company chat. An employee asks a question. The chat finds private files. Then it writes an answer. Each later chapter adds one piece of that path.",
  problem: "If you only memorize AWS names, exam stories feel random. One question can mix search, tickets, safety, and cost. Without a simple picture, every answer looks possible.",
  why: "You need one picture of a real question moving through the app. Then each AWS tool has a clear job. You can say what it gets and what it gives back.",
  assistant: "Maya works at a company. She opens an internal chat called the Knowledge Assistant. She types: What is our travel pay rule? The chat must answer from the HR handbook. It must name the page it used. It must not show files Maya cannot see. It must not send the handbook to train a public model.",
  walkthrough: [
    "Maya logs in so the app knows who she is.",
    "The app receives her question.",
    "The app finds matching bits of the handbook.",
    "A language model writes an answer from those bits.",
    "Safety checks hide secrets and block unsafe topics.",
    "Maya sees the answer with a link to the handbook.",
    "The company records tokens, time, and cost."
  ],
  services: [
    {
      name: "The whole path, not one product",
      importance: "CORE",
      solves: "Gives every later chapter a home. Bedrock, search, login, and logs stop competing for attention.",
      how: "Maya's question enters the app. The app checks who she is. It may search company files. It may call a small tool. Then it writes a safe answer and records what happened.",
      connects: ["Every later chapter"],
      input: "Maya's question and her identity.",
      output: "A grounded answer, sources, optional ticket, and logs."
    },
    {
      name: "A small Bedrock test, then a review",
      importance: "CORE",
      solves: "Prove the chat can answer from a few PDFs first. Then check gaps before you add tickets or extra models.",
      how: "Start with a small HR folder and a few labeled questions. Use Bedrock to retrieve and answer. Then review privacy, cost, and logging. Do not jump to training a new model on the intranet.",
      connects: ["Bedrock", "Knowledge Bases", "Guardrails", "CloudWatch"],
      input: "A handful of handbook PDFs and about 20 test questions.",
      output: "A working search-and-answer path you can improve."
    }
  ],
  alternatives: [
    { option: "Memorize products A to Z", when: "Never for this exam", pros: "Feels complete", cons: "You miss how search, tickets, and login work together" },
    { option: "Study only Bedrock names", when: "You only want API names", pros: "Fast", cons: "The exam also asks about Lambda, search, IAM, and logs" },
    { option: "Follow Maya's path (this site)", when: "You want to understand and pass", pros: "Matches exam stories", cons: "You should read in order" }
  ],
  examAsks: [
    "Least extra work versus most control. Managed search versus a search engine you run yourself.",
    "Private network path versus a public internet path to Bedrock.",
    "Show words as they arrive versus making Maya wait for the full answer."
  ],
  realApp: "Maya asks about travel pay. The app knows she is in HR. It finds handbook section 4.2. The model writes a short answer with that source. If she later asks to open a ticket, a different path runs. A new PDF never rides the chat path. It is loaded in the background.",
  sections: [
    {
      heading: "What the exam is",
      paragraphs: [
        "The exam is a set of work stories. You pick the design that fits the limits. Passing is one overall score of 750. You do not need to win every topic group."
      ],
      bullets: [
        "About 31% is models, data, and search.",
        "About 26% is building the app, tools, and shipping.",
        "About 20% is safety, security, and rules.",
        "About 12% is cost, speed, and watching the system.",
        "About 11% is testing and fixing."
      ]
    },
    {
      heading: "What this exam is not",
      paragraphs: [
        "You are not training a giant new model from scratch. If an option says collect a huge labeled set and train a new language model for a policy FAQ, it is usually wrong."
      ]
    },
    {
      heading: "How later chapters stack",
      paragraphs: [
        "Chapters 01 to 04 explain the model, how you pick one, Bedrock, and prompts. Chapter 05 is how the app talks to the model. Chapters 06 to 10 turn files into searchable knowledge. Chapters 11 to 14 add tools and memory. Chapters 15 to 17 keep the chat safe. Chapters 18 to 23 test, watch, pay for, and ship the system. Chapters 24 to 27 help you choose under exam pressure."
      ]
    }
  ]
});
