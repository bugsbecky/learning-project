AIP.registerChapter({
  id: "18",
  summary: "Evaluation is how you know the chat got better. You score many questions. You do not assert one exact sentence.",
  problem: "Model answers are not always the same. Shipping a new prompt with no gate is how travel answers invent 800 dollars. If HR uses the chat, fairness and toxicity matter too.",
  why: "Pick the test that matches the bug. Search miss versus invented fact versus toxic tone versus a wrong ticket field.",
  assistant: "Before a prompt goes to prod, the company runs 200 labeled policy questions. Did we fetch the right chunks? Did the answer stick to them? Did we name the section? A person only reviews the disputed tail.",
  walkthrough: [
    "Keep a golden set of real questions.",
    "Include travel pay, a hard miss, and an injection try.",
    "Run the candidate prompt or knowledge snapshot.",
    "Score retrieval, faithfulness, and safety.",
    "Fail the change if scores drop.",
    "Keep a small human set to check the judge."
  ],
  services: [
    {
      name: "Bedrock model and Knowledge Base evaluation",
      importance: "CORE",
      solves: "Managed jobs that score models and RAG with built-in metrics or a judge model.",
      how: "Put a question set in S3. Compare two prompt versions. Results feed the ship gate.",
      connects: ["S3", "Prompt Management", "CodeBuild", "Guardrails"],
      input: "A question set plus job settings.",
      output: "Scores you can threshold."
    },
    {
      name: "SageMaker Clarify",
      importance: "CORE",
      solves: "Fairness and harm slices when the story names those words.",
      how: "Use Clarify when quality might differ by group. Do not use it as the only test for did we fetch the right chunk.",
      connects: ["S3", "model cards"],
      input: "A set with optional group labels.",
      output: "A fairness or toxicity report."
    }
  ],
  alternatives: [
    { option: "Automatic eval plus a judge model", when: "Regression gates", pros: "Repeatable", cons: "The judge can be wrong. Calibrate with people." },
    { option: "Clarify", when: "Fairness is named", pros: "The fairness product the exam names", cons: "Too much if the story is only groundedness." },
    { option: "Exact string tests", when: "Only for strict JSON fields", pros: "Cheap", cons: "Fails for free-text answers. Common wrong answer." }
  ],
  examAsks: [
    "Knowledge Base eval versus model eval versus Clarify. Search quality versus writing quality versus fairness.",
    "Faithfulness drops while retrieval looks fine. Fix the prompt or Guardrails. Not bigger embeddings.",
    "A judge model is valid. Still keep a human holdout."
  ],
  realApp: "The golden set includes travel per-diem, contractor travel, ignore previous instructions, a Spanish question, and create a ticket. Ship fails if faithfulness or recall drop. Results store next to the prompt version.",
  sections: [
    {
      heading: "Pick the metric that matches the bug",
      paragraphs: [
        "Low recall means search, rewrite, split, or a filter that is too tight. Low faithfulness means the prompt or temperature or missing grounding. Agent task fail means the tool schema. The exam is diagnosing."
      ]
    }
  ]
});
