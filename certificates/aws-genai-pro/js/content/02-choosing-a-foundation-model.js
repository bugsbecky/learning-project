AIP.registerChapter({
  id: "02",
  summary: "Picking a model is like picking a route. Quality, speed, cost, language, and region all matter. The app should be able to switch models without a new software release.",
  problem: "If the model name is baked into the code, you cannot change it quickly. Cost rules, region rules, and tests all need a switch you can flip.",
  why: "The exam wants a design that can choose a model at request time. Easy questions can use a small model. Hard summaries can use a stronger one.",
  assistant: "Maya asks a simple travel FAQ. A small model is enough. A legal summary of a long contract needs a stronger model. If Maya is in Germany, the company may require a model in an EU region. Same chat. Different route.",
  walkthrough: [
    "Maya sends one question to the same chat URL.",
    "A small router looks at the question type and her region.",
    "Simple FAQ goes to a cheaper model.",
    "A long legal summary goes to a stronger model.",
    "A config file can change that map without shipping new app code."
  ],
  services: [
    {
      name: "AWS AppConfig plus a small router",
      importance: "CORE",
      solves: "Change routing rules without a new deploy. User type, region, and cost limits can move in minutes.",
      how: "The chat function reads a config. The config says which Bedrock model to call. Maya still hits one stable URL.",
      connects: ["API Gateway", "Bedrock", "CloudWatch"],
      input: "Who is asking, how hard the question looks, and current cost posture.",
      output: "A chosen model id and then the model call."
    },
    {
      name: "Bedrock cross-region inference",
      importance: "IMPORTANT",
      solves: "Keep answering if one region is full.",
      how: "A profile can send the same request to another allowed region. You still review data residency first.",
      connects: ["IAM region rules", "Legal review"],
      input: "The same chat request.",
      output: "An answer from a region that has room."
    }
  ],
  alternatives: [
    { option: "AppConfig plus a router", when: "Production with many rules", pros: "Change rules without a deploy", cons: "You must still check the config." },
    { option: "Model name in env vars", when: "Tiny prototype", pros: "Simple", cons: "Needs a function update to change." },
    { option: "Train a new giant model", when: "Never for a policy FAQ", pros: "None for this job", cons: "Wrong job. This exam is about using models." }
  ],
  examAsks: [
    "Least custom work versus most flexible routing. AppConfig in the request path is the usual flexible answer.",
    "Do not put AWS keys in the browser so the web page can call Bedrock.",
    "A small custom model is for style or a classifier you must own. It is not a replacement for search on facts that change."
  ],
  realApp: "The chat has one URL named ask. The router reads a JSON config. Default is a cheap text model. Legal-summary uses a stronger model. Germany pins to an EU path. Changing the JSON does not need a full pipeline run.",
  sections: [
    {
      heading: "How to score a model for the job",
      paragraphs: [
        "Ignore marketing names. Score the job. Does it handle long files? Does it call tools? Does it see images? Is it in the region you need? What happens if the call is throttled?"
      ]
    },
    {
      heading: "Backup is part of the choice",
      paragraphs: [
        "If the main model is busy, a smaller model or a keyword search result is better than a spinning wheel. Availability is a design choice."
      ]
    },
    {
      heading: "When you must own a tiny custom model",
      paragraphs: [
        "Search still owns facts that change. A small adapter can own tone or a yes-no classifier you must host. Register it. You can roll it back. Do not train a new giant model on the handbook for a FAQ."
      ]
    }
  ]
});
