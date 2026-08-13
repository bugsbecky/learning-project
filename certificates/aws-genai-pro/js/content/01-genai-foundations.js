AIP.registerChapter({
  id: "01",
  summary: "A foundation model writes the next words from a prompt. It is not a database. For company facts, you must give it the right text at answer time.",
  problem: "A normal app returns saved records. A model can write fluent text that is not in any file. Teams fail when they treat the model as a handbook.",
  why: "You need to know what is special here. The model can guess. You pay per piece of text. There is a size limit. Company files must not become training data unless you opt in.",
  assistant: "Maya asks about project Falcon. The model does not know Falcon by itself. Falcon lives in company files. Either the app finds Falcon text and puts it in the prompt, or the answer is a guess.",
  walkthrough: [
    "Maya asks about project Falcon.",
    "The model only sees what the app sends it.",
    "If the app sends Falcon notes, the model can summarize them.",
    "If the app sends nothing from Falcon, the model may invent a story.",
    "That is why search comes before the answer."
  ],
  services: [
    {
      name: "Amazon Bedrock",
      importance: "CORE",
      solves: "Lets the company call many models through one AWS door. You do not run your own GPU cluster.",
      how: "The app sends Maya's prompt to Bedrock. Bedrock runs the chosen model. You pay for the text in and the text out. The company can log the call with AWS tools.",
      connects: ["IAM login rules", "CloudWatch logs", "Knowledge Bases", "Guardrails"],
      input: "A prompt and settings like length.",
      output: "Written text, optional tool requests, and usage counts."
    },
    {
      name: "Amazon SageMaker (only if you must host a model)",
      importance: "IMPORTANT",
      solves: "Runs a model you own when Bedrock does not have what you need.",
      how: "You host the model on SageMaker. You own more of the running cost and patching. For Maya's handbook chat, this is usually extra work you do not need.",
      connects: ["VPC", "IAM", "Model Registry"],
      input: "A request in the format that model expects.",
      output: "The hosted model's answer."
    }
  ],
  alternatives: [
    { option: "Call a Bedrock model as you go", when: "Normal company assistant", pros: "Little extra work. Many models. Your prompts are not used to train the base model by default.", cons: "You do not own the model weights." },
    { option: "Reserve Bedrock capacity", when: "Steady busy hours and a speed promise", pros: "Reserved room for calls", cons: "You pay even if traffic drops." },
    { option: "Host on SageMaker", when: "You must run weights you own", pros: "More control", cons: "You run the machines." }
  ],
  examAsks: [
    "Does the company need to train a model, or only use one? This exam is mostly about using one.",
    "Will Maya's questions train the provider model? The default Bedrock answer is no.",
    "Low randomness for forms and JSON. Higher randomness only for creative drafts."
  ],
  realApp: "The Knowledge Assistant never trains on HR PDFs. Files stay in company storage. The app finds short snippets. Then it asks the model to answer only from those snippets. That is cheaper and safer.",
  sections: [
    {
      heading: "Words have a budget",
      paragraphs: [
        "A model call has a size limit. Instructions, found files, chat history, and tool results all share that limit. If the handbook text is cut off, Maya can get a wrong answer."
      ],
      bullets: [
        "Text in plus text out is both cost and time.",
        "Streaming shows words as they are written so Maya is not staring at a blank screen.",
        "Answers are not always the same. You test quality with many examples, not one exact sentence."
      ]
    },
    {
      heading: "What the model already knows versus what you give it",
      paragraphs: [
        "The model already knows general language. Company truth lives in your files. Search puts that truth into the prompt. Tools let the model read live systems like a ticket app."
      ]
    }
  ]
});
