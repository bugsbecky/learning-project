AIP.registerChapter({
  id: "17",
  summary: "Governance is who changed which prompt, model, and knowledge snapshot. You must be able to roll back.",
  problem: "If prompts live only in code, nobody can answer which version spoke to Maya on Tuesday. You cannot audit. You cannot A/B. You cannot undo a bad edit fast.",
  why: "A company chat is a controlled system. Legal must bless wording. You must reconstruct one answer later.",
  assistant: "HR tone and not legal advice live in a prompt alias named prod. Publishing prod is a privileged act. Each answer log line stores prompt version, model id, knowledge snapshot, and session id. A bad publish rolls back in minutes.",
  walkthrough: [
    "Someone edits the HR instruction.",
    "A new version is created.",
    "Tests run.",
    "Prod alias moves only after approval.",
    "If quality drops, alias points back to the old version.",
    "The audit log shows who published."
  ],
  services: [
    {
      name: "Prompt Management versions and aliases",
      importance: "CORE",
      solves: "Treat prompts like code. Review. Version. Roll back. No website rebuild.",
      how: "The app calls an alias. The alias points at an immutable version. IAM separates read from publish.",
      connects: ["CloudTrail", "IAM", "Guardrails versions", "CI tests"],
      input: "A draft template.",
      output: "An immutable version and a movable alias."
    },
    {
      name: "AWS CloudTrail",
      importance: "CORE",
      solves: "Who changed prompts, guardrails, and IAM. That is not the same as logging the prompt body.",
      how: "Management events show updates. Prompt body logs are a different tool for forensics. Do not mix those two answers.",
      connects: ["IAM", "Config", "CloudWatch"],
      input: "AWS API activity.",
      output: "An audit trail when tone suddenly changes."
    }
  ],
  alternatives: [
    { option: "Prompt Management plus CloudTrail", when: "Standard Bedrock app", pros: "Least governance work that still audits", cons: "People must stop pasting prompts into tickets." },
    { option: "Git only, deploy to change", when: "Tiny team, no Legal loop", pros: "Familiar", cons: "Slow. Weak API-level audit." },
    { option: "File tags as version control", when: "Never as the main prompt store", pros: "Looks tidy", cons: "Common wrong answer." }
  ],
  examAsks: [
    "Many templates plus approval plus audit. Prompt Management plus IAM plus CloudTrail.",
    "CloudTrail is who changed what. Invocation logs are the prompt body.",
    "Know what to roll back. Prompt alias, knowledge sync, or guardrail version."
  ],
  realApp: "Legal rejects version 12 because it dropped not legal advice. Prod alias returns to version 11. Logs show who got version 12 answers. No website deploy.",
  sections: [
    {
      heading: "A model card in plain words",
      paragraphs: [
        "Write what the chat is for. Internal policy Q and A. Write what it is not for. Medical advice. Note known misses like acronyms. For a custom hosted model, a registry plus a card stops an experiment from becoming prod."
      ]
    },
    {
      heading: "Govern knowledge too",
      paragraphs: [
        "Who can drop files in the Legal folder? Who can start a sync? Who can change filter schemas? Those changes are as serious as a prompt change."
      ]
    }
  ]
});
