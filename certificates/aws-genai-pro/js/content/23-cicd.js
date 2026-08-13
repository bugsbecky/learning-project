AIP.registerChapter({
  id: "23",
  summary: "Shipping GenAI means code, prompts, safety policies, and knowledge. A pipeline that only checks syntax will promote a prompt that drops sources.",
  problem: "A merge that only lints will ship a chunker that splits section 4.2 in half. Prompts and knowledge configs are production artifacts.",
  why: "The exam wants quality gates before a prompt alias or knowledge sync hits prod.",
  assistant: "Maya never sees a prompt the day it is typed. The change goes to a test account. A golden question set runs. If faithfulness drops, ship stops. Legal then approves. Prod alias moves. CloudTrail records the publish.",
  walkthrough: [
    "A change includes code, a prompt, or a knowledge setting.",
    "Deploy to test.",
    "Run the golden question set.",
    "Fail if scores drop versus last prod.",
    "A person approves prod wording.",
    "Prod alias or stack moves. After a file sync, a tiny canary search checks the new PDF is found."
  ],
  services: [
    {
      name: "CodePipeline plus CodeBuild",
      importance: "CORE",
      solves: "Repeatable promotions of infrastructure, prompt versions, and eval jobs.",
      how: "Build. Deploy test. Run eval. Approve. Deploy prod. Do not use a laptop script as the release process.",
      connects: ["IAM pipeline roles", "S3 artifacts", "Bedrock eval"],
      input: "A commit that may include prompt files and tests.",
      output: "A promoted alias or stack only if gates pass."
    },
    {
      name: "Regression gates",
      importance: "CORE",
      solves: "Catch quality drops that unit tests cannot see.",
      how: "Fixed questions. Expected sources. HR versus Engineering personas. Injection tries. After ingest, search for a known chunk id from travel-v3.pdf.",
      connects: ["Bedrock evaluation", "Step Functions", "CloudWatch"],
      input: "Candidate prompt or knowledge snapshot.",
      output: "Pass or fail with a scorecard."
    }
  ],
  alternatives: [
    { option: "Pipeline plus eval plus prod approval", when: "Company default", pros: "Matches Legal's need to bless wording", cons: "Eval adds minutes." },
    { option: "Only unit tests", when: "Never enough for chat quality", pros: "Fast green builds", cons: "The testing miss." },
    { option: "SageMaker Pipelines", when: "You already train on SageMaker", pros: "ML lineage", cons: "Not required if you only version Bedrock prompts." }
  ],
  examAsks: [
    "Eval as a pipeline stage before prod. Not we will watch logs after go-live as the only control.",
    "Golden questions must include team personas and injection cases.",
    "The pipeline waits on the eval job. A busy loop on a laptop is not the architecture."
  ],
  realApp: "A PR changes the HR instruction. Staging scores drop because the new text dropped answer only from CONTEXT. Gate fails. After the fix, Legal approves. Prod alias moves.",
  sections: [
    {
      heading: "Git versus Prompt Management",
      paragraphs: [
        "Git holds infrastructure, tool code, and review copies. Prompt Management holds the live versions the app calls. The pipeline is the bridge. Editing prod in the console without a pipeline is tomorrow's mystery."
      ]
    }
  ]
});
