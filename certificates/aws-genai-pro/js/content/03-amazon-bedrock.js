AIP.registerChapter({
  id: "03",
  summary: "Bedrock is the company door to many models. One login story. One private network story. One logging story. Knowledge Bases, Agents, Guardrails, and prompts also live here.",
  problem: "Teams glue a public model website, a homemade search index, and ad-hoc filters. Audits fail. There is no shared prompt version. There is no shared safety net.",
  why: "A company wants model calls to look like other AWS calls. Same roles. Same private paths. Same logs. Bedrock is that door.",
  assistant: "Maya's question never goes to a public AI website from her browser. The company app calls Bedrock. The app uses an AWS role. Maya never sees secret keys. Prompts are stored as versions, not as random strings in many files.",
  walkthrough: [
    "Maya types her travel question in the company app.",
    "The app uses its AWS role. It does not use Maya's password to call the model.",
    "The call goes to Bedrock through a private door inside AWS when the company requires that.",
    "Bedrock runs the chosen model.",
    "The answer comes back to the app.",
    "Logs record that the call happened."
  ],
  services: [
    {
      name: "Amazon Bedrock Runtime",
      importance: "CORE",
      solves: "Call and stream models with one AWS API.",
      how: "The app sends Maya's messages. Bedrock returns the written answer. You can attach a safety policy on the same call.",
      connects: ["IAM", "Private VPC endpoints", "CloudWatch", "S3 invocation logs"],
      input: "Messages, settings, optional tools, optional knowledge base id.",
      output: "The answer, why it stopped, and token counts."
    },
    {
      name: "Prompt Management and Prompt Flows",
      importance: "CORE",
      solves: "Keep instructions in one place with versions. Legal can approve wording. You can roll back.",
      how: "HR, Legal, and Engineering can share one template with blanks. The app fills the blanks at run time. Flows chain a few prompt steps when the job is mostly writing.",
      connects: ["IAM", "CloudTrail", "Agents"],
      input: "A template plus values like team name and language.",
      output: "A finished prompt ready for the model."
    }
  ],
  alternatives: [
    { option: "Bedrock as the door", when: "Default company assistant", pros: "One IAM, network, and log story", cons: "The model must be on Bedrock in your region." },
    { option: "Call a third-party website from the app", when: "The model is not on Bedrock and legal signed off", pros: "Access a unique model", cons: "Separate login, network, and contract." },
    { option: "Amazon Q Business", when: "You want a ready-made company chat product", pros: "Fast to turn on", cons: "Less custom screens and tools. Awareness, not the default if you are building your own app." }
  ],
  examAsks: [
    "Private VPC endpoints to Bedrock versus a public internet path.",
    "Prompt Management for many templates and an audit trail versus tags on files.",
    "Model invocation logs of the prompt text versus normal app access logs. They are not the same."
  ],
  realApp: "HR wants a calm tone. Engineering wants JSON. Both live as prompt versions. Changing a template does not require a new website build. Guardrails attach at run time.",
  sections: [
    {
      heading: "Bedrock is a platform",
      paragraphs: [
        "Runtime calls, Knowledge Bases, Agents, Guardrails, Prompt Management, and evaluation jobs are all Bedrock in exam language. When a story wants the least extra work for search-and-answer, managed Knowledge Bases usually beat building search from scratch."
      ]
    },
    {
      heading: "The private door",
      paragraphs: [
        "If the app runs in a private network, it cannot reach Bedrock by magic. It needs a private endpoint or a public path. Exam stories that demand private connectivity are testing that you pick the Bedrock endpoint, not only a storage endpoint."
      ]
    }
  ]
});
