AIP.registerChapter({
  id: "06",
  summary: "Company knowledge starts as files. Ingestion is the pipeline that makes those files searchable. It does not train the model.",
  problem: "PDFs and wikis are not prompt-ready. If you paste a whole dump into the prompt, you hit the size limit. You may also leak the wrong team's files. New policies would never show up.",
  why: "When HR drops a new handbook, Maya should find it soon. That means parse, split, label, and index. Automatically.",
  assistant: "HR uploads travel-v3.pdf to the company file bucket. Until that file is processed, Maya may still see the old rule. The chat will look like it is guessing even when the model is fine.",
  walkthrough: [
    "HR saves a new PDF in the company folder.",
    "That save starts a background job.",
    "The job reads the PDF into text.",
    "The job splits the text into small labeled chunks.",
    "Those chunks are stored for later search.",
    "Maya's next question can find the new rule."
  ],
  services: [
    {
      name: "Amazon S3",
      importance: "CORE",
      solves: "The durable home for PDFs and docs. A new file can start the ingest job.",
      how: "Think of S3 as the filing cabinet. Tags can mark team, date, and how secret the file is. Versioning keeps old copies.",
      connects: ["EventBridge", "Lambda", "Knowledge Bases", "KMS"],
      input: "The file bytes plus labels.",
      output: "A file address the indexer can read."
    },
    {
      name: "Textract, Transcribe, or a quality check",
      importance: "IMPORTANT",
      solves: "Scans, forms, and audio are not plain text yet. Dirty tables should not enter search.",
      how: "A scan becomes text. A meeting recording becomes a transcript. A quality rule can stop a broken spreadsheet before it is indexed.",
      connects: ["S3", "Step Functions", "Knowledge Bases"],
      input: "A raw file or recording.",
      output: "Clean text plus labels, or a stopped job."
    }
  ],
  alternatives: [
    { option: "Bedrock Knowledge Bases ingest", when: "Supported files and you want little extra work", pros: "Split, embed, and sync are built in", cons: "Odd file types may still need a custom step." },
    { option: "Your own workflow", when: "Weird formats or heavy redaction", pros: "Full control", cons: "You own failures." },
    { option: "Rebuild everything every night only", when: "A tiny folder", pros: "Simple", cons: "Fails when updates must be searchable soon." }
  ],
  examAsks: [
    "Update only what changed versus rebuild everything.",
    "Audio or images need a text step first.",
    "A quality fail should stop ingest. Do not index garbage."
  ],
  realApp: "A new object in the HR folder starts the job. Secret numbers are masked. Chunks keep heading boundaries so section 4.2 stays together. Each chunk stores who may see it.",
  sections: [
    {
      heading: "Splitting files is a design choice",
      paragraphs: [
        "Fixed-size cuts are easy. They break tables and numbered rules. Keep a policy clause together. Tiny overlap helps the edges. Huge chunks waste space and confuse search."
      ]
    },
    {
      heading: "This is not training",
      paragraphs: [
        "Ingest writes to your index. It does not teach the base model. If an option says the PDFs will improve the public model, that is the wrong picture."
      ]
    }
  ]
});
