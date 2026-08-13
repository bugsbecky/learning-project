AIP.registerChapter({
  id: "05",
  summary: "This chapter is the left side of the path. Browser. Login. API. Compute. A model answer can take a long time. A short web wait will fail.",
  problem: "A hard policy question can take longer than a normal web request. Maya sees a spinner, then an error. Trying the same long call again makes cost worse.",
  why: "The browser must not hold Bedrock keys. The path must show words as they arrive. Login must happen before search, or file rules cannot work.",
  assistant: "Maya opens the company website and signs in. The website calls the company API. The API uses an AWS role to talk to Bedrock. Words appear in the chat as the model writes them. Maya never sees secret keys.",
  walkthrough: [
    "Maya signs in. The app now knows her group, like HR or Engineering.",
    "She types a question.",
    "The website sends the question to the company API.",
    "A small compute job builds the prompt and calls Bedrock.",
    "Words stream back to the screen.",
    "A long overnight file job does not use this same wait."
  ],
  services: [
    {
      name: "Amazon API Gateway",
      importance: "CORE",
      solves: "A stable door for the app. Login checks, limits, and for chat a stream of words.",
      how: "Think of it as the receptionist. Short classify calls can use a normal request. Chat uses a live connection so tokens can flow.",
      connects: ["Lambda", "Cognito", "WAF"],
      input: "A signed-in question plus a session id.",
      output: "Streamed words or a finished JSON body."
    },
    {
      name: "AWS Lambda",
      importance: "CORE",
      solves: "On-demand glue. Fill the prompt. Call Bedrock. Run a small tool.",
      how: "Lambda is a short-lived worker. It starts when Maya asks. It should not hold the only copy of chat history. History lives in a database.",
      connects: ["Bedrock", "DynamoDB", "Secrets Manager"],
      input: "An event from the API or a queue.",
      output: "A response or a job placed on a queue."
    },
    {
      name: "AWS Amplify plus AppSync",
      importance: "IMPORTANT",
      solves: "A managed front end and GraphQL path. A streaming kit can show Bedrock answers with less custom code.",
      how: "Use this when the story already has Amplify and AppSync. Do not make Maya poll a queue every tenth of a second for chat.",
      connects: ["Cognito", "Bedrock Knowledge Bases"],
      input: "A GraphQL call from the website.",
      output: "A streamed assistant payload."
    }
  ],
  alternatives: [
    { option: "Live stream of tokens", when: "Interactive chat that can take many seconds", pros: "Maya reads while the model writes", cons: "You must handle the live connection." },
    { option: "Amplify streaming kit", when: "The story already uses Amplify and Knowledge Bases", pros: "Least custom code in that story", cons: "Tied to that stack." },
    { option: "Only raise the timeout", when: "Never as the main chat fix", pros: "One-line change", cons: "Maya still waits. Retries double cost." },
    { option: "Keys in the browser", when: "Never", pros: "Fewer hops", cons: "Keys leak. No company door." }
  ],
  examAsks: [
    "Show words as they arrive for many users. Use a live stream. Not a timeout bump.",
    "Overnight file work can use a queue. Chat should not.",
    "Amazon Q Developer helps developers read errors. It is not Maya's model on the request path."
  ],
  realApp: "Live Q and A uses a stream. Overnight re-index uses events and a workflow. Ticket create uses a tool. Those are three different wait styles.",
  sections: [
    {
      heading: "Login at this layer",
      paragraphs: [
        "Maya signs in with a user pool or a company identity service. The app role calls Bedrock. File-level rules come later during search. If you skip login here, search cannot hide HR-only files."
      ]
    },
    {
      heading: "Short wait versus long job versus stream",
      paragraphs: [
        "A tiny classify call can wait. Chat should stream. A two-hour file load should be a background job. Do not mix those three."
      ]
    }
  ]
});
