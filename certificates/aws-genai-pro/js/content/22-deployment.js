AIP.registerChapter({
  id: "22",
  summary: "Run compute where the job lives. Lambda for glue. Containers for long workers. Bedrock for models. Do not stand up GPUs for a handbook FAQ.",
  problem: "Teams wrap an 80-line Bedrock proxy in a large cluster. Or they put a 2-hour backfill in Lambda. Or they host a model because they used SageMaker in a class.",
  why: "The exam compares extra work. Managed Bedrock inference versus you running GPUs versus short glue versus always-on containers.",
  assistant: "Maya's chat worker is Lambda. Ticket tools are Lambda. A heavy long tool server can be a container. The language model stays on Bedrock. Nobody hosts Claude. If Legal ever demands a tiny classifier the company owns, that one piece can sit on SageMaker.",
  walkthrough: [
    "Chat glue runs on Lambda.",
    "Short tools run on Lambda.",
    "A long or heavy tool can run on a container.",
    "The model runs on Bedrock.",
    "A custom hosted model is the exception, not the default."
  ],
  services: [
    {
      name: "AWS Lambda",
      importance: "CORE",
      solves: "On-demand glue with IAM and no patching.",
      how: "Max run is 15 minutes. Memory also buys CPU. Not for multi-hour backfills. Not for GPUs.",
      connects: ["API Gateway", "Bedrock", "DynamoDB"],
      input: "HTTP, stream, queue, or tool events.",
      output: "Streamed or JSON responses."
    },
    {
      name: "ECS Fargate or EKS when forced",
      importance: "IMPORTANT",
      solves: "Long-lived processes. Heavy tool servers. Bulk embed workers.",
      how: "Prefer Fargate when you want fewer nodes to manage. The container still calls Bedrock for the model.",
      connects: ["queues", "ECR", "IAM task roles"],
      input: "Work from queues or long tool sessions.",
      output: "Finished jobs or tool replies."
    },
    {
      name: "Bedrock versus a SageMaker endpoint",
      importance: "CORE",
      solves: "Where the weights run.",
      how: "Default is Bedrock. On-demand for spikes. Reserved capacity for busy days. SageMaker when you must host weights you own.",
      connects: ["Model Registry", "VPC"],
      input: "An inference payload.",
      output: "Tokens or vectors from AWS-managed models or from your endpoint."
    }
  ],
  alternatives: [
    { option: "Lambda plus Bedrock on-demand", when: "Standard assistant, least extra work", pros: "No GPU cluster", cons: "Timeouts and busy errors at extreme peaks." },
    { option: "Lambda plus reserved Bedrock capacity", when: "Steady interactive traffic", pros: "Capacity", cons: "A commitment." },
    { option: "SageMaker endpoint", when: "You host the model", pros: "Control", cons: "GPU ops. Wrong for just call Claude." }
  ],
  examAsks: [
    "Least extra work to call a model. Bedrock on-demand. Not a GPU fleet.",
    "Lambda 15 minute limit versus containers or workflows for long ingest.",
    "If you bought reserved capacity, call that profile. Do not mix it with the on-demand model id."
  ],
  realApp: "Prod has two Lambdas, optional one container for a heavy ticket SDK, reserved capacity on the default chat model, and on-demand for the judge model in tests. Dev skips reserved capacity. Nobody deployed Kubernetes to wrap a tiny SDK call.",
  sections: [
    {
      heading: "Cold start versus model wait",
      paragraphs: [
        "If first word is slow, split the cause. Worker start versus Bedrock queue versus search. Wrapping the same worker in a container does not fix Bedrock throttles."
      ]
    }
  ]
});
