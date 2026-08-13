# AIP-C01 official outline (condensed)

Source of truth for gap checks: AWS Certified Generative AI Developer – Professional (AIP-C01).
Study via chapters **00–27** (Maya and the Company Knowledge Assistant). Do not reorganize as an A to Z AWS catalog.

Importance on this site: **CORE** / **IMPORTANT** / **AWARENESS**. Not every in-scope product is CORE.

## Domain 1 — Foundation Model Integration, Data Management, and Compliance (31%)

- **1.1 Architecture / PoC** — FM integration and deployment designs; PoC on Bedrock; standardized components: Well-Architected Framework and **AWS WA Tool Generative AI Lens**.
- **1.2 Select/configure FMs** — benchmarks, capability, limits; **dynamic model selection without code changes** (Lambda, API Gateway, AppConfig); resilience (Step Functions circuit breakers, **Bedrock Cross-Region Inference**, cross-Region deploy, graceful degradation); customization lifecycle (**SageMaker fine-tuned deploy, LoRA/adapters, Model Registry**, pipelines, rollback, retire/replace) — not train an LLM from scratch.
- **1.3 Data for FM consumption** — **Glue Data Quality**, **Data Wrangler**, Lambda, CloudWatch; multimodal text/image/audio/tabular (Bedrock multimodal, SageMaker Processing, **Transcribe**, **Textract**); JSON/Bedrock API formatting, SageMaker endpoint schemas, conversation format; quality (Bedrock reformat, **Comprehend** entities, Lambda normalize).
- **1.4 Vector stores** — KB hierarchical indexing; OpenSearch Neural plugin; RDS+S3; **DynamoDB** for metadata/embeddings (not 10M k-NN default); S3 metadata (timestamps, authorship, domain tags); OpenSearch sharding, multi-index, hierarchical; DMS/wikis/KBs; incremental updates, change detection, sync, scheduled refresh.
- **1.5 Retrieval** — Bedrock chunking, Lambda fixed-size, hierarchical; **Titan** and Bedrock embed models, Lambda batch embed; OpenSearch vector, Aurora pgvector, KB managed store; **hybrid keyword+vector**, **Bedrock reranker**; query expansion, Lambda decomposition, Step Functions query transform; function calling / **MCP** clients / standardized retrieval APIs.
- **1.6 Prompts / governance** — Prompt Management roles, Guardrails, templates; Step Functions clarification, Comprehend intent, DynamoDB history; parameterized templates/approvals, S3 template repos (usually a distractor vs Prompt Management), CloudTrail, CloudWatch Logs; Lambda/Step Functions/CloudWatch prompt QA/regression; CoT, structured I/O, feedback loops; **Prompt Flows** chains, branching, reusable components, pre/post process.

## Domain 2 — Implementation and Integration (26%)

- **2.1 Agentic AI** — **Strands**, **Agent Squad**, **MCP**, memory/state; Step Functions ReAct/CoT; stopping conditions, Lambda timeouts, IAM bounds, circuit breakers; model ensembles/selection; HITL (Step Functions + API Gateway feedback); Strands API, function defs, Lambda validation; MCP servers on **Lambda (stateless)** vs **ECS (complex)**; **AgentCore** as exam vocabulary.
- **2.2 Model deployment** — Lambda on-demand, Bedrock **provisioned throughput**, SageMaker hybrid; container/GPU/token loading; smaller models, cascading APIs.
- **2.3 Enterprise integration** — APIs/legacy, event-driven, sync; API Gateway, Lambda webhooks, EventBridge; identity federation, RBAC, least privilege FM access; **Outposts / Wavelength** (AWARENESS) hybrid routing; **CodePipeline/CodeBuild**, tests, security scans, rollback, **GenAI gateway** abstraction, observability.
- **2.4 FM APIs** — Bedrock sync, SDKs, **SQS async**, API Gateway validation; **streaming**, WebSockets/SSE, chunked transfer; SDK backoff, APIGW rate limit, fallback, **X-Ray**; static routing, Step Functions content routing, metric routing, APIGW transforms.
- **2.5 App patterns** — APIGW streaming, token limits, retries; **Amplify** UI, OpenAPI, Prompt Flows no-code; CRM Lambda, Step Functions docs, Bedrock Data Automation; **Q Developer**; Strands/Agent Squad/prompt chaining; CloudWatch Logs Insights, X-Ray, Q Developer error patterns.

## Domain 3 — Safety, Security, Governance (20%)

- **3.1 Input/output safety** — Guardrails (denied topics, word filters, content filters, PII, **grounding**); custom moderation Step Functions/Lambda; output filters, toxicity, text-to-SQL deterministic; KB grounding, confidence, **JSON Schema**; Comprehend pre-filter vs Guardrails vs Lambda post vs APIGW filter; **prompt injection**/jailbreak, sanitization, classifiers, adversarial tests.
- **3.2 Data security/privacy** — **VPC endpoints**, IAM, **Lake Formation**, CloudWatch access; Comprehend/**Macie** PII, Bedrock privacy, Guardrails, S3 lifecycle; masking, anonymization.
- **3.3 Governance** — SageMaker **model cards**, **Glue lineage**, metadata attribution, decision logs; Glue Data Catalog, **CloudTrail**; org policies; misuse/drift/bias monitoring, token redaction, response logging, output policy filters.
- **3.4 Responsible AI** — reasoning displays, confidence, citations, agent tracing; fairness CloudWatch, Prompt Management/Flows A/B, **LLM-as-judge**; Guardrails from policy, model cards, Lambda compliance checks.

## Domain 4 — Ops / optimization (12%)

- **4.1 Cost** — token estimate/track, context prune, response limits, compression; tiered FMs; batching, capacity, PT, autoscaling; **semantic cache**, fingerprinting, edge cache, hashing, **prompt cache**.
- **4.2 Performance** — precompute, latency-optimized models, parallel, **streaming**, benchmarks; index/query preprocess, hybrid scoring; token throughput, batch inference, concurrency; **temperature / top-k / top-p**, A/B; capacity, autoscaling GenAI traffic; API profiling, vector query opt, LLM latency.
- **4.3 Monitoring** — ops metrics, tracing, business dashboards; CloudWatch tokens/prompt effectiveness/hallucination/quality, anomaly, **Bedrock Model Invocation Logs**, cost anomaly; dashboards, forensic audit, user tracking; **tool-call observability**, multi-agent coordination; vector store perf/index/data quality; golden datasets, output diffing, reasoning traces.

## Domain 5 — Test / troubleshoot (11%)

- **5.1 Eval** — relevance, factuality, consistency, fluency; **Bedrock Model Evaluations**, A/B, canary, multi-model, cost-performance; feedback/ratings/annotation; continuous eval, regression, quality gates; RAG eval, LLM-as-judge, human feedback; retrieval relevance/latency; agent task completion, tool use, Bedrock Agent eval; reporting/viz; synthetic workflows, hallucination/semantic drift.
- **5.2 Troubleshoot** — **context-window overflow**, dynamic chunking, truncation; API errors; prompt test/version compare; retrieval relevance, embedding drift, chunking, vector perf; CloudWatch/X-Ray prompt observability, schema validation.

## Techniques (named in the guide)

RAG, vector stores, embeddings, agents/tool use, prompt engineering, Guardrails, hybrid search + rerank, MCP, IaC, CI/CD quality gates, streaming APIs, hybrid/edge (Outposts/Wavelength), evaluation (automatic, human, LLM-as-judge).

## In-scope products — AWARENESS only unless a stem forces them

Short mention, not study-plan center: **Outposts, Wavelength, Connect, Q Business, Rekognition, MSK, AppFlow, Grafana, Service Catalog, Chatbot, Global Accelerator, EBS/EFS, DocumentDB, Neptune** (unless graph retrieval is the point), **SageMaker Neo / Ground Truth / A2I, QuickSight**, **Kinesis / EMR / Athena** as supporting analytics.

## Chapter map (this site)

| Ch | Skills |
|----|--------|
| 00 | 1.1 architecture, WA GenAI Lens, PoC |
| 01 | FM vs training, Bedrock control plane |
| 02 | 1.2 FM selection, AppConfig, Cross-Region Inference, LoRA/registry |
| 03 | Bedrock platform, Prompt Management/Flows overview |
| 04 | 1.6 prompts, Flows, DynamoDB conversation, CoT |
| 05 | 2.3–2.5 API, streaming, Amplify, SQS, X-Ray, Q Developer |
| 06 | 1.3 Glue DQ, Wrangler, Textract, Transcribe, multimodal, Comprehend |
| 07 | 1.5.2 embeddings Titan |
| 08 | 1.4 OpenSearch, Aurora pgvector, DynamoDB metadata, incremental sync |
| 09 | 1.5 RAG, hybrid, reranker, query expansion, MCP retrieve |
| 10 | Knowledge Bases managed RAG |
| 11 | 2.1 agents, memory, ReAct, AgentCore/Strands/Squad |
| 12 | tools, MCP Lambda vs ECS, validation |
| 13 | Step Functions, circuit breakers, HITL, EventBridge |
| 14 | DynamoDB session memory, summarization |
| 15 | 3.1 Guardrails, injection, grounding, JSON schema |
| 16 | 3.2 VPC, IAM, Lake Formation, Macie, KMS, Cognito |
| 17 | 3.3–3.4 CloudTrail, Glue lineage, model cards, responsible AI |
| 18 | 5.1 Clarify, Bedrock eval, LLM-as-judge, RAG/agent eval |
| 19 | 4.3 CloudWatch, invocation logs, tool observability |
| 20 | 4.2 streaming, PT, hybrid retrieval perf, temperature/top-p |
| 21 | 4.1 tokens, tiered models, prompt cache, semantic cache |
| 22 | 2.2 Lambda vs containers vs SageMaker vs Bedrock PT |
| 23 | 2.3.5 CodePipeline/CodeBuild, GenAI gateway, quality gates |
| 24 | 5.2 overflow, retrieval miss, prompt drift, throttling |
| 25 | RAG vs agent vs event-ingest vs hybrid cloud (Outposts AWARENESS) |
| 26 | exam decision cheatsheet |
| 27 | final architecture |
