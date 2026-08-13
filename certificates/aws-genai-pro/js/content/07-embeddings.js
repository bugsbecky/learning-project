AIP.registerChapter({
  id: "07",
  summary: "Embeddings turn text into a list of numbers. Similar meaning lands close together. That is how travel pay can match mileage rules without sharing the same words.",
  problem: "Keyword search misses paraphrases. Pure meaning search misses exact codes like SOC2. If you change the embedding model and forget to rebuild, search silently breaks.",
  why: "The exam wants you to pick an embedding model that fits. Making the number list longer is not the first fix for bad search.",
  assistant: "Maya types travel pay. The handbook chunk says mileage and per-diem rules. Those two texts must land near each other as numbers. The embedding model is the shared language. Change the model and you must rebuild.",
  walkthrough: [
    "Each handbook chunk is turned into numbers at index time.",
    "Maya's question is turned into numbers with the same model.",
    "Search finds nearby number lists.",
    "The matching text is what the model will read.",
    "If you switch embedding models, old numbers are in a different space."
  ],
  services: [
    {
      name: "Titan Embeddings and other Bedrock embedders",
      importance: "CORE",
      solves: "A managed way to turn text into numbers. No GPU cluster.",
      how: "The ingest job sends chunk text to the embedding model. The same model must embed Maya's question later. Store which model version you used.",
      connects: ["Knowledge Bases", "OpenSearch", "Aurora pgvector"],
      input: "Chunk text.",
      output: "A number list plus the model id you must keep."
    }
  ],
  alternatives: [
    { option: "Managed Knowledge Base embeddings", when: "Default search-and-answer on Bedrock", pros: "Versioning is handled for you", cons: "Fewer exotic model choices." },
    { option: "Your own embed job", when: "You run your own index", pros: "Control", cons: "You must rebuild when the model changes." },
    { option: "Longer number lists as a quality fix", when: "Almost never first", pros: "Might help a little", cons: "Cost goes up. Exact codes still need keyword search." }
  ],
  examAsks: [
    "Exact codes plus meaning. Use hybrid search. Do not only grow the number list.",
    "A second ranking step can help when neighbors are close but wrong.",
    "Mixed languages need an embedding model that handles those languages."
  ],
  realApp: "At index time each handbook chunk becomes numbers. At question time Maya's text becomes numbers with the same model. Then search plus team filters run.",
  sections: [
    {
      heading: "The trap: mixing two embedding models",
      paragraphs: [
        "If questions use model B and the index still has model A, scores are junk. Treat a model change like a migration. Build a new index. Switch. Then drop the old one."
      ]
    }
  ]
});
