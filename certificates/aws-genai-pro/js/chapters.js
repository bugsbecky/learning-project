window.AIP = window.AIP || {};

AIP.CHAPTERS = [
  { id: "00", title: "Architecture Overview", group: "foundations", domain: 1, importance: "CORE", stage: "user", badges: ["ARCHITECTURE FUNDAMENTAL", "WA GENAI LENS"] },
  { id: "01", title: "GenAI Foundations", group: "foundations", domain: 1, importance: "CORE", stage: "fm", badges: ["DOMAIN 1", "ARCHITECTURE FUNDAMENTAL"] },
  { id: "02", title: "Choosing a Foundation Model", group: "foundations", domain: 1, importance: "CORE", stage: "fm", badges: ["DOMAIN 1", "COMMON EXAM DECISION"] },
  { id: "03", title: "Amazon Bedrock", group: "foundations", domain: 1, importance: "CORE", stage: "fm", badges: ["DOMAIN 1", "HIGH EXAM IMPORTANCE"] },
  { id: "04", title: "Prompt Engineering", group: "foundations", domain: 1, importance: "CORE", stage: "prompt", badges: ["DOMAIN 1", "HIGH EXAM IMPORTANCE"] },
  { id: "05", title: "Application Integration", group: "path", domain: 2, importance: "CORE", stage: "api", badges: ["DOMAIN 2", "ARCHITECTURE FUNDAMENTAL"] },
  { id: "06", title: "Data Ingestion", group: "knowledge", domain: 1, importance: "CORE", stage: "rag", badges: ["DOMAIN 1"] },
  { id: "07", title: "Embeddings", group: "knowledge", domain: 1, importance: "CORE", stage: "rag", badges: ["DOMAIN 1", "ARCHITECTURE FUNDAMENTAL"] },
  { id: "08", title: "Vector Databases", group: "knowledge", domain: 1, importance: "CORE", stage: "rag", badges: ["DOMAIN 1", "COMMON EXAM DECISION"] },
  { id: "09", title: "RAG", group: "knowledge", domain: 1, importance: "CORE", stage: "rag", badges: ["DOMAIN 1", "HIGH EXAM IMPORTANCE"] },
  { id: "10", title: "Bedrock Knowledge Bases", group: "knowledge", domain: 1, importance: "CORE", stage: "rag", badges: ["DOMAIN 1", "HIGH EXAM IMPORTANCE"] },
  { id: "11", title: "Agents", group: "agents", domain: 2, importance: "CORE", stage: "agents", badges: ["DOMAIN 2", "HIGH EXAM IMPORTANCE"] },
  { id: "12", title: "Agent Tools", group: "agents", domain: 2, importance: "CORE", stage: "agents", badges: ["DOMAIN 2"] },
  { id: "13", title: "Workflow Orchestration", group: "agents", domain: 2, importance: "CORE", stage: "agents", badges: ["DOMAIN 2", "COMMON EXAM DECISION"] },
  { id: "14", title: "Memory and State", group: "agents", domain: 2, importance: "IMPORTANT", stage: "agents", badges: ["DOMAIN 2"] },
  { id: "15", title: "Safety & Guardrails", group: "trust", domain: 3, importance: "CORE", stage: "safety", badges: ["DOMAIN 3", "HIGH EXAM IMPORTANCE"] },
  { id: "16", title: "Security & Privacy", group: "trust", domain: 3, importance: "CORE", stage: "auth", badges: ["DOMAIN 3", "ARCHITECTURE FUNDAMENTAL"] },
  { id: "17", title: "Governance", group: "trust", domain: 3, importance: "CORE", stage: "safety", badges: ["DOMAIN 3"] },
  { id: "18", title: "Evaluation", group: "operate", domain: 5, importance: "CORE", stage: "eval", badges: ["DOMAIN 5", "HIGH EXAM IMPORTANCE"] },
  { id: "19", title: "Observability", group: "operate", domain: 4, importance: "CORE", stage: "obs", badges: ["DOMAIN 4"] },
  { id: "20", title: "Performance", group: "operate", domain: 4, importance: "CORE", stage: "cost", badges: ["DOMAIN 4", "COMMON EXAM DECISION"] },
  { id: "21", title: "Cost Optimization", group: "operate", domain: 4, importance: "CORE", stage: "cost", badges: ["DOMAIN 4", "COMMON EXAM DECISION"] },
  { id: "22", title: "Deployment", group: "operate", domain: 2, importance: "IMPORTANT", stage: "deploy", badges: ["DOMAIN 2"] },
  { id: "23", title: "CI/CD", group: "operate", domain: 2, importance: "IMPORTANT", stage: "deploy", badges: ["DOMAIN 2"] },
  { id: "24", title: "Troubleshooting", group: "exam", domain: 5, importance: "CORE", stage: "obs", badges: ["DOMAIN 5"] },
  { id: "25", title: "Architecture Patterns", group: "exam", domain: 1, importance: "CORE", stage: "user", badges: ["ARCHITECTURE FUNDAMENTAL"] },
  { id: "26", title: "Exam Decision Guide", group: "exam", domain: 1, importance: "CORE", stage: "user", badges: ["COMMON EXAM DECISION", "HIGH EXAM IMPORTANCE"] },
  { id: "27", title: "Final Architecture", group: "exam", domain: 1, importance: "CORE", stage: "user", badges: ["ARCHITECTURE FUNDAMENTAL"] }
];

AIP.GROUPS = [
  { id: "foundations", title: "00–04 Foundations" },
  { id: "path", title: "05 Request path" },
  { id: "knowledge", title: "06–10 Knowledge layer" },
  { id: "agents", title: "11–14 Agents" },
  { id: "trust", title: "15–17 Trust" },
  { id: "operate", title: "18–23 Operate" },
  { id: "exam", title: "24–27 Exam close" }
];

AIP.chaptersInGroup = function (groupId) {
  return AIP.CHAPTERS.filter(function (c) { return c.group === groupId; });
};
