AIP.registerChapter({
  id: "20",
  summary: "Speed is time to first word, search quality, and capacity. Stream. Cache. Hybrid search. A bigger model is the last lever.",
  problem: "Maya stares at a blank screen for 40 seconds. Or search misses SOC2 and she rewrites three times. Or 9am throttles hit on-demand calls.",
  why: "The exam patterns are stream versus timeout, reserved capacity versus on-demand, hybrid search versus fatter embeddings, and cache versus random cuts.",
  assistant: "Maya's travel FAQ often repeats. A cache can return yesterday's cited answer in a blink. A new Falcon question misses cache, searches, and streams words as they arrive. Busy mornings use reserved capacity on the default chat model.",
  walkthrough: [
    "Chat streams words so the first line appears fast.",
    "Exact codes use keyword plus meaning search.",
    "The static instruction prefix can be cached.",
    "Repeated FAQs can skip the model if the file version is unchanged.",
    "Steady office hours can reserve capacity."
  ],
  services: [
    {
      name: "Streaming",
      importance: "CORE",
      solves: "Perceived speed. Maya reads while the model writes.",
      how: "Do not wait for the full answer in the worker. Send chunks to the screen. Time to first word is the UX metric.",
      connects: ["WebSocket API", "Amplify streaming", "X-Ray"],
      input: "The same prompt as a non-stream call.",
      output: "Word chunks, then a stop reason."
    },
    {
      name: "Reserved capacity plus hybrid search",
      importance: "CORE",
      solves: "Fewer busy errors, and fewer missed exact codes.",
      how: "Reserve units for the daytime chat model. Keep a fallback. Keyword plus meaning search catches SOC2 and paraphrases.",
      connects: ["Bedrock", "OpenSearch", "circuit breaker"],
      input: "Steady traffic plus queries with codes.",
      output: "Fewer 429s. Fewer I do not know on terms the handbook contains."
    },
    {
      name: "Prompt cache and FAQ cache",
      importance: "IMPORTANT",
      solves: "Repeated instruction prefixes and repeated questions.",
      how: "Cache the stable prefix. For identical FAQs, store the cited answer with team and file version in the key. Never share one team's answer with another team.",
      connects: ["DynamoDB", "Prompt version", "ingest"],
      input: "The prompt prefix or the question.",
      output: "A cheaper call or a cache hit that skips the model."
    }
  ],
  alternatives: [
    { option: "Stream plus hybrid plus cache", when: "Spiky chat, default", pros: "Best feel per dollar for bursts", cons: "Extreme peaks can still throttle." },
    { option: "Add reserved capacity", when: "Predictable office hours and a speed promise", pros: "Reserved room", cons: "You pay if traffic disappears." },
    { option: "Only raise the timeout", when: "Never as the UX fix", pros: "Stops some errors", cons: "Blank spinner. Retries double cost." }
  ],
  examAsks: [
    "Word-by-word UX. Stream. Not a queue poll. Not a timeout bump.",
    "Exact legal or medical codes. Hybrid search. Not bigger vectors first.",
    "Repeated instructions use prompt cache. Repeated questions use a FAQ cache with team and version in the key."
  ],
  realApp: "Travel FAQ hits cache. A novel Falcon question streams a cited summary. Monday 9:15 throttles fade after reserved capacity. Tool schemas sit in the cached prefix so agent turns cost less.",
  sections: [
    {
      heading: "Measure the right wait",
      paragraphs: [
        "Split search time, rank time, write time, and tool time. If search is slow, fix search. If first word is slow, look at cold starts or a model that is too large for FAQ."
      ]
    }
  ]
});
