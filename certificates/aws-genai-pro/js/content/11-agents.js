AIP.registerChapter({
  id: "11",
  summary: "An agent lets the model plan steps and call tools. Use it when search cannot finish the job. Live systems. Multi-step work. Open a ticket.",
  problem: "RAG can quote the security rules for a public API. It cannot open a change ticket or look up who is on call.",
  why: "The exam wants controlled help, not an unbounded loop. Stop conditions, timeouts, and tight permissions matter.",
  assistant: "Maya asks: Open a ticket from this internal document. Search can read the document. Only an agent can call the ticket tool. Each tool uses a narrow AWS role.",
  walkthrough: [
    "A small check decides if Maya wants an answer or an action.",
    "FAQ stays on search-and-answer.",
    "An action goes to an agent.",
    "The agent may search, then call a ticket tool.",
    "A risky write can wait for a human.",
    "The agent must stop after a set number of steps."
  ],
  services: [
    {
      name: "Amazon Bedrock Agents",
      importance: "CORE",
      solves: "A managed loop of think, call a tool, read the result, repeat.",
      how: "You give instructions, a few tools, and optional Knowledge Bases. Traces show why a tool was called. That helps you debug.",
      connects: ["Lambda tools", "Knowledge Bases", "Guardrails", "CloudWatch"],
      input: "Maya's words plus a session id.",
      output: "A final answer, traces, and any side effects."
    }
  ],
  alternatives: [
    { option: "Bedrock Agent plus small tools", when: "A few company APIs and unknown next step", pros: "Managed planning", cons: "You must read traces when it misbehaves." },
    { option: "A fixed workflow", when: "The steps are already known", pros: "Easier to audit", cons: "Less flexible language understanding." },
    { option: "Prompt Flows only", when: "Writing steps with no ticket APIs", pros: "Simple", cons: "Weak for Jira or HR systems." }
  ],
  examAsks: [
    "Agents must not loop forever. Name stop conditions and timeouts.",
    "High-risk writes wait for a person.",
    "Do not use an agent for a static handbook FAQ."
  ],
  realApp: "Default path is RAG. Create ticket goes to the agent. The agent cannot email the whole company because that tool is not attached.",
  sections: [
    {
      heading: "When not to use an agent",
      paragraphs: [
        "Handbook FAQ is RAG. A simple classify call is one model call. Agents add time, cost, and extra risk. Match the tool to the job."
      ]
    },
    {
      heading: "Think then act",
      paragraphs: [
        "The loop is thought, tool, result, repeat. Stop on max turns, idle time, a safety block, or a permission deny. Split into two agents only when their permissions truly conflict."
      ]
    },
    {
      heading: "Names you may see on the exam",
      paragraphs: [
        "MCP is a shared way to expose tools. AgentCore is a managed agent runtime name. Multi-agent means a supervisor plus specialists. Default is still one agent with a few small tools."
      ]
    }
  ]
});
