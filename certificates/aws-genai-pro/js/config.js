window.AIP = window.AIP || {};

AIP.DOMAINS = [
  { id: 1, pct: 31, short: "FM / Data / RAG", name: "Foundation Model Integration, Data Management, and Compliance" },
  { id: 2, pct: 26, short: "Implementation", name: "Implementation and Integration" },
  { id: 3, pct: 20, short: "Safety / Security", name: "AI Safety, Security, and Governance" },
  { id: 4, pct: 12, short: "Operations", name: "Operational Efficiency and Optimization for GenAI Applications" },
  { id: 5, pct: 11, short: "Test / Troubleshoot", name: "Testing, Validation, and Troubleshooting" }
];

AIP.JOURNEY = [
  { id: "user", label: "User" },
  { id: "frontend", label: "App" },
  { id: "auth", label: "Login" },
  { id: "api", label: "API" },
  { id: "compute", label: "Compute" },
  { id: "prompt", label: "Prompt" },
  { id: "fm", label: "Model" },
  { id: "rag", label: "Company data" },
  { id: "agents", label: "Tools" },
  { id: "safety", label: "Safety" },
  { id: "response", label: "Answer" },
  { id: "obs", label: "Watch" },
  { id: "eval", label: "Test" },
  { id: "deploy", label: "Ship" },
  { id: "cost", label: "Cost" }
];

AIP.APP = {
  name: "Company Knowledge Assistant",
  person: "Maya",
  asks: [
    "What is our travel pay rule?",
    "Summarize project Falcon.",
    "What security rules apply to a public API?",
    "Find that part of the HR handbook.",
    "Open a ticket from this internal document."
  ]
};

AIP.STORAGE_KEYS = {
  progress: "aip-c01:v1:progress",
  quiz: "aip-c01:v1:quiz",
  ui: "aip-c01:v1:ui"
};

AIP.PROGRESS_CELLS = 14;

AIP.ROUTES = {
  home: "#/",
  chapter: "#/chapter/",
  quiz: "#/quiz/",
  exam: "#/exam",
  bank: "#/bank",
  stats: "#/stats"
};
