AIP.registerChapter({
  id: "12",
  summary: "Tools are how an agent touches the real world. Treat them like public APIs. Schema. Checks. Timeouts. Least privilege.",
  problem: "A free run SQL tool turns a pasted instruction into a data leak. An unchecked ticket tool can open ten thousand tickets.",
  why: "The blast radius is the tool, not the chat text. Validate in code. Do not trust the model to be careful.",
  assistant: "The company attaches lookupEmployee and createDraftTicket. It does not attach deleteBucket or raw SQL. The ticket tool never trusts a user id the model invented. It uses Maya's real login.",
  walkthrough: [
    "The model asks to create a draft ticket.",
    "The tool checks the fields against a strict list.",
    "The tool overwrites the reporter with Maya's login.",
    "A high-risk ticket waits for a lead.",
    "Errors come back as short messages the model can read. Not stack traces."
  ],
  services: [
    {
      name: "Lambda tools or MCP tool servers",
      importance: "CORE",
      solves: "Real actions with an AWS role the model does not hold itself.",
      how: "A schema lists allowed fields. Lambda checks them. Short stateless tools run on Lambda. Long-lived heavy tools run on containers.",
      connects: ["Bedrock Agents", "IAM", "Secrets Manager", "Step Functions"],
      input: "JSON fields from the model.",
      output: "JSON result or a short error."
    }
  ],
  alternatives: [
    { option: "Lambda for short tools", when: "Create or read a record in under 15 minutes", pros: "Simple ops", cons: "Cold start and timeout." },
    { option: "A container tool server", when: "Long-lived or heavy tools", pros: "More runtime room", cons: "You run a service." },
    { option: "Let the model write SQL against prod", when: "Never without a tight sandbox", pros: "Flexible", cons: "Injection risk. Prefer typed tools." }
  ],
  examAsks: [
    "Field checks live in Lambda. Not only in the prompt.",
    "The tool role is narrower than the chat role.",
    "Watch tool-call loops as a cost and safety signal."
  ],
  realApp: "createDraftTicket requires Maya's identity from login. The model may propose a title. Lambda sets the reporter. Safety still scans the title.",
  sections: [
    {
      heading: "Design small tools",
      paragraphs: [
        "Many small typed tools beat one giant tool. Return short JSON. Make writes safe to retry. For a dangerous write, return needs approval and wait."
      ]
    }
  ]
});
