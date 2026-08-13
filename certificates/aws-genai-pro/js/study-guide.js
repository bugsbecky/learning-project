window.AIP = window.AIP || {};

(function () {
  var requestPath = [
    { id: "user", label: "User" },
    { id: "frontend", label: "App" },
    { id: "auth", label: "Cognito" },
    { id: "api", label: "API Gateway" },
    { id: "compute", label: "Lambda" },
    { id: "prompt", label: "Prompt" },
    { id: "fm", label: "Amazon Bedrock" },
    { id: "rag", label: "Knowledge Base", arrow: "↔" },
    { id: "safety", label: "Guardrails" },
    { id: "response", label: "Answer" },
    { id: "obs", label: "CloudWatch" }
  ];

  var knowledgePath = [
    { id: "source", label: "Source files" },
    { id: "storage", label: "Amazon S3" },
    { id: "ingest", label: "Ingestion" },
    { id: "embed", label: "Chunk & embed" },
    { id: "rag", label: "Knowledge Base" },
    { id: "fm", label: "Amazon Bedrock", arrow: "↔" },
    { id: "safety", label: "Guardrails" },
    { id: "response", label: "Answer" }
  ];

  var agentPath = [
    { id: "user", label: "User" },
    { id: "api", label: "API Gateway" },
    { id: "compute", label: "Lambda" },
    { id: "fm", label: "Amazon Bedrock" },
    { id: "agents", label: "Agents & tools", arrow: "↔" },
    { id: "tool", label: "Tool Lambda" },
    { id: "system", label: "Business API" },
    { id: "safety", label: "Guardrails" },
    { id: "response", label: "Answer" }
  ];

  var evaluationPath = [
    { id: "dataset", label: "Test set" },
    { id: "frontend", label: "Application" },
    { id: "fm", label: "Amazon Bedrock" },
    { id: "rag", label: "Knowledge Base", arrow: "↔" },
    { id: "eval", label: "Evaluator" },
    { id: "gate", label: "Quality gate" }
  ];

  var deploymentPath = [
    { id: "source", label: "Git" },
    { id: "pipeline", label: "CI/CD" },
    { id: "eval", label: "Evaluation gate" },
    { id: "deploy", label: "Deployment" },
    { id: "frontend", label: "Application" },
    { id: "fm", label: "Amazon Bedrock" }
  ];

  var costPath = [
    { id: "user", label: "User" },
    { id: "api", label: "API Gateway" },
    { id: "router", label: "Model router" },
    { id: "cache", label: "Cache" },
    { id: "fm", label: "Amazon Bedrock" },
    { id: "response", label: "Answer" },
    { id: "cost", label: "Usage & cost" }
  ];

  AIP.ARCHITECTURE_PATHS = {
    default: requestPath,
    user: requestPath,
    frontend: requestPath,
    auth: requestPath,
    api: requestPath,
    compute: requestPath,
    prompt: requestPath,
    fm: requestPath,
    rag: knowledgePath,
    agents: agentPath,
    safety: requestPath,
    response: requestPath,
    obs: requestPath,
    eval: evaluationPath,
    deploy: deploymentPath,
    cost: costPath
  };

  AIP.TOPIC_SUMMARIES = {
    "00": "The architecture overview maps Maya’s question from sign-in through retrieval, generation, safety, citations, and operations, giving every later component a place.",
    "01": "Foundation models generate text from supplied context; they sit after retrieval because changing company facts belong in files, not model memory.",
    "02": "Model selection balances quality, speed, cost, capability, and region, while a request-time router places each question on the best available model.",
    "03": "Amazon Bedrock is the secured AWS entry point for model calls, connecting application code to models, prompts, guardrails, knowledge, and logging.",
    "04": "A prompt is a versioned instruction template placed before generation to combine rules, user input, retrieved context, and the required answer format.",
    "05": "Application integration securely carries a signed-in question from browser to AWS compute and Bedrock, then streams the generated answer back.",
    "06": "Data ingestion is the background pipeline that parses, cleans, chunks, labels, and indexes company files before retrieval can search them.",
    "07": "Embeddings encode text as meaning-based number vectors, linking document chunks and user questions inside the retrieval stage.",
    "08": "A vector database stores embeddings, source text, and access labels, then returns semantically similar, permission-filtered chunks to retrieval.",
    "09": "Retrieval-augmented generation finds authorized private passages before generation, grounding the model’s answer in current evidence and supplying citations.",
    "10": "Bedrock Knowledge Bases provides managed ingestion and retrieval for RAG, sitting between company data sources, vector storage, and answer generation.",
    "11": "A Bedrock agent lets a model choose and call approved tools, adding controlled actions when retrieval alone cannot complete a user’s task.",
    "12": "Agent tools are narrowly scoped, validated APIs that sit between model plans and real systems, safely performing reads or side effects.",
    "13": "Orchestration assigns known, auditable steps to workflows and uncertain tool choices to agents, coordinating background jobs, approvals, retries, and fallbacks.",
    "14": "Conversation memory stores and summarizes server-side session history, supplying each model call with enough prior context for follow-ups without oversized prompts.",
    "15": "Bedrock Guardrails inspect untrusted input and generated output around model calls, blocking unsafe topics, masking secrets, and testing grounding.",
    "16": "Security combines identity, least-privilege roles, private Bedrock connectivity, encryption, and retrieval filters across every layer handling company data.",
    "17": "Governance versions and audits prompts, guardrails, models, and knowledge changes, surrounding production releases with approvals, traceability, and rollback.",
    "18": "Evaluation scores retrieval, answer faithfulness, safety, and fairness across labeled questions, acting as the quality gate before production.",
    "19": "Observability joins metrics, traces, invocation logs, and version identifiers around live requests to explain latency, cost, tool behavior, and wrong answers.",
    "20": "Performance engineering reduces perceived and actual latency with streaming, efficient retrieval, caching, suitable model capacity, and measurements across the request path.",
    "21": "Cost optimization controls token spending through model routing, shorter prompts, caching, bounded retries, and batch inference outside interactive chat.",
    "22": "Deployment places short application glue on Lambda, long workers in containers, and model inference on Bedrock unless custom weights require SageMaker.",
    "23": "CI/CD pipelines promote code, prompts, guardrails, and knowledge settings only after regression evaluation and required approval.",
    "24": "Troubleshooting maps evidence to failures in prompt size, retrieval, capacity, versions, or ingestion before applying a targeted fix.",
    "25": "Architecture patterns classify each need as RAG, an agent, a model gateway, or background ingestion, keeping the overall design minimal.",
    "26": "The exam decision guide maps requirement words to managed or custom architectures, defaulting to fewer moving parts unless explicit control is required.",
    "27": "The final architecture connects identity, routing, memory, retrieval, generation, tools, safety, streaming, ingestion, testing, and operations into one production assistant."
  };

  AIP.MUST_MEMORIZE = {
    "00": [
      "Authenticate before retrieval; then ground, generate, guard, cite, and observe every request.",
      "Keep interactive question answering separate from asynchronous document ingestion and reindexing.",
      "Prototype RAG on representative documents and questions before adding training, tools, or complex orchestration."
    ],
    "01": [
      "Foundation models predict text; they neither store authoritative company facts nor guarantee truth.",
      "Instructions, retrieved context, history, tool results, and output share one context-window budget.",
      "Bedrock invokes managed models without training base models on customer prompts by default."
    ],
    "02": [
      "Route each request by task complexity, capability, latency, cost, region, and residency constraints.",
      "Externalize model mappings so routing and fallback changes do not require application deployment.",
      "Fine-tuning can shape style or classifiers; retrieval remains the source for frequently changing facts."
    ],
    "03": [
      "Bedrock centralizes model access under IAM, AWS networking, logging, guardrails, and shared governance.",
      "Use a Bedrock VPC endpoint when traffic must remain private; S3 endpoints do not cover model calls.",
      "Version reusable prompts in Prompt Management; invocation logging is distinct from application access logging."
    ],
    "04": [
      "Separate trusted system instructions, retrieved context, user input, and tool results within prompt templates.",
      "Use Prompt Management for governed, versioned templates; use Guardrails for reusable safety enforcement.",
      "Prompt Flows fit writing-centric chains; agents and tools fit external system actions."
    ],
    "05": [
      "Authenticate users before retrieval, while backend IAM roles—not browser credentials—invoke Bedrock.",
      "Stream interactive generations; reserve synchronous waits for short calls and queues for background jobs.",
      "Lambda is stateless, short-lived compute; persist conversation state in a durable database."
    ],
    "06": [
      "Ingestion parses, cleans, chunks, labels, embeds, and indexes documents; it does not train foundation models.",
      "Trigger incremental background processing from source changes so fresh documents become searchable promptly.",
      "Preserve semantic boundaries and access metadata; reject poor extraction before indexing."
    ],
    "07": [
      "Index chunks and queries with the same embedding model and version; changing models requires re-embedding.",
      "Embeddings capture semantic similarity, not authoritative facts, permissions, or exact identifiers.",
      "Combine semantic and keyword retrieval for paraphrases plus exact codes; rerank ambiguous candidates afterward."
    ],
    "08": [
      "Semantic similarity never grants access; apply metadata authorization filters before retrieved text reaches the model.",
      "OpenSearch supports semantic, keyword, and metadata-filtered retrieval; Serverless reduces cluster operations.",
      "Use Aurora pgvector beside modest-scale relational data; use DynamoDB for metadata and sync state, not nearest-neighbor retrieval."
    ],
    "09": [
      "RAG retrieves authorized, current passages at inference time, then generates grounded answers without retraining.",
      "Return citations from retrieval metadata, never model memory; instruct the model to admit insufficient context.",
      "Diagnose retrieval separately: rewrite vague queries, combine keyword and semantic search, rerank candidates, and verify index freshness."
    ],
    "10": [
      "Knowledge Bases manages ingestion, chunking, embeddings, retrieval, and cited generation; applications still enforce authorization filters.",
      "Use Retrieve for passages; use RetrieveAndGenerate when you need a grounded answer with citations.",
      "Prefer hierarchical chunking for clause context; choose custom pipelines only when managed parsing or search cannot fit."
    ],
    "11": [
      "Use agents when the next action is uncertain and requires tools; use RAG for static questions.",
      "Use fixed workflows for known step graphs; agent planning adds latency, cost, and behavioral risk.",
      "Constrain agents with few least-privilege tools, bounded turns, timeouts, traces, and approval for risky writes."
    ],
    "12": [
      "Treat tool schemas as untrusted input contracts; validate and authorize every field in code.",
      "Derive caller identity from authentication, never model arguments; give each tool a narrower IAM role.",
      "Prefer small typed, idempotent tools; use Lambda for short tasks and containers for long-lived or heavy workloads."
    ],
    "13": [
      "Use Step Functions for known, auditable state graphs with retries, parallelism, failures, and human approval waits.",
      "Use EventBridge to decouple asynchronous ingest events from latency-sensitive chat requests and fan out work.",
      "For throttling, back off and open a circuit breaker; degrade to retrieval instead of retrying indefinitely."
    ],
    "14": [
      "Persist encrypted session state with TTLs; key by authenticated user and session, keeping serverless compute stateless.",
      "Summarize older turns and retain recent verbatim turns to control context-window cost without losing continuity.",
      "Memory preserves user-task context, not company truth; retrieve governed facts separately and never retain secrets."
    ],
    "15": [
      "Attach one versioned Guardrail to every input and output path, including agents and grounded generation.",
      "Map failures to controls: content, denied-topic, word, sensitive-information, and grounding filters solve different risks.",
      "Guardrails do not enforce permissions or tool contracts; IAM and code validation bound actions and data access."
    ],
    "16": [
      "Authenticate users with Cognito; applications call Bedrock using server-side IAM roles, never browser credentials.",
      "Private Bedrock access requires Bedrock VPC endpoints; NAT or an S3 endpoint does not satisfy private-only inference.",
      "Semantic relevance never grants access; bind retrieval filters to authenticated groups, then encrypt and redact data."
    ],
    "17": [
      "Store prompts as immutable versions behind movable aliases; approve alias promotion and roll back without application deployment.",
      "Use IAM to separate prompt consumption from publishing; CloudTrail records management changes, not invocation payloads.",
      "Log prompt, model, Guardrail, and knowledge versions per answer so outputs remain reproducible and auditable."
    ],
    "18": [
      "Evaluate RAG separately: retrieval metrics diagnose search, while faithfulness measures whether generation stays supported by retrieved evidence.",
      "Use representative golden sets and thresholded regression gates; exact-string assertions suit structured fields, not free-form answers.",
      "Use Clarify for fairness or toxicity slices; calibrate model judges against a retained human-reviewed holdout."
    ],
    "19": [
      "CloudWatch measures operations; CloudTrail audits API activity; Bedrock invocation logging records model inputs and outputs.",
      "Correlate request IDs across retrieval, model, and tool traces to isolate latency and stale knowledge.",
      "Encrypt and restrict prompt logs; they may contain sensitive user data, retrieved context, and completions."
    ],
    "20": [
      "Streaming improves time-to-first-token, but does not reduce total generation latency or prevent throttling.",
      "Hybrid search combines lexical matching for exact codes with semantic retrieval for paraphrases.",
      "Prompt caching reuses supported stable prefixes; application FAQ caches must include tenant and source-version keys."
    ],
    "21": [
      "Route simple tasks to smaller models; reserve stronger models for complexity requiring better reasoning or quality.",
      "Reduce input cost by retrieving fewer high-quality chunks, summarizing history, and caching stable prompt prefixes.",
      "Use batch inference for asynchronous bulk workloads, not interactive requests needing immediate or streamed responses."
    ],
    "22": [
      "Bedrock minimizes infrastructure for supported models; SageMaker offers deeper hosting control with greater operational responsibility.",
      "Lambda suits event-driven glue and short tools, but each invocation cannot exceed 15 minutes.",
      "Choose containers for long-lived, resource-heavy workers; Fargate reduces infrastructure management compared with self-managed orchestration."
    ],
    "23": [
      "Version code, prompts, guardrails, retrieval configuration, and knowledge changes as independently testable production artifacts.",
      "Gate promotion on fixed evaluations covering grounding, expected sources, authorization personas, and prompt-injection resistance.",
      "Promote immutable prompt versions only after automated regression checks and required human approval."
    ],
    "24": [
      "Raising timeouts does not fix context overflow; trim retrieved chunks or summarize conversation history.",
      "Weak retrieval points to hybrid search, query rewriting, filters, or ingestion status—not generation tuning.",
      "Throttles need backoff or capacity controls; sudden quality shifts require checking prompt, guardrail, and index versions."
    ],
    "25": [
      "Use RAG for grounded answers from changing documents; fine-tuning is not a knowledge-refresh mechanism.",
      "Prompt Flows orchestrate defined generative steps; Step Functions coordinate AWS workflows; agents select tools dynamically.",
      "Separate interactive inference from event-driven ingestion; route all model access through a secured, observable gateway."
    ],
    "26": [
      "Prefer managed Bedrock features unless requirements explicitly demand custom retrieval, hosted weights, or existing infrastructure.",
      "Bedrock serves supported models with minimal operations; SageMaker fits model hosting requiring deeper infrastructure control.",
      "Private inference requires a Bedrock Runtime interface endpoint; an S3 gateway endpoint covers only S3 traffic."
    ],
    "27": [
      "Interactive Q&A combines identity, authorization-filtered retrieval, guarded generation, streaming, metadata-derived citations, session state, and telemetry.",
      "Action requests require constrained tools and approval for high-risk side effects; document search alone cannot execute actions.",
      "Run ingestion, evaluation, version promotion, and operations asynchronously beside chat; never train changing document facts into weights."
    ]
  };
})();
