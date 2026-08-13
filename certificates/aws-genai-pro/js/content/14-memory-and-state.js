AIP.registerChapter({
  id: "14",
  summary: "Memory is not keep the whole chat in the prompt. Store turns. Summarize old ones. Expire them. Keep secrets out.",
  problem: "What about contractors? is meaningless without history. Forty turns plus found chunks overflow the size limit. Browser-only history vanishes and cannot be audited.",
  why: "Follow-ups need state. Cost hates giant prompts. Safety hates mixing two people's chats or keeping secrets forever.",
  assistant: "Each Maya conversation has a session id. The server stores recent turns and a short summary. The next model call gets the summary, the last few turns, and new search chunks. The app never stores raw secrets in memory.",
  walkthrough: [
    "Maya asks about travel pay. The answer is stored with a session id.",
    "She asks what about contractors?",
    "The app loads that session.",
    "It knows the topic is still travel pay.",
    "After many turns, old turns become a short summary.",
    "If she reconnects, the session comes from the database, not from RAM."
  ],
  services: [
    {
      name: "Amazon DynamoDB as the session store",
      importance: "CORE",
      solves: "Fast per-session state with a time-to-live and encryption.",
      how: "Key by user and session. Store turns, summary, and team filters. Expire after a set number of days.",
      connects: ["Lambda", "KMS", "Agents"],
      input: "A new turn after each answer.",
      output: "A compact history for the next call."
    },
    {
      name: "A running summary",
      importance: "CORE",
      solves: "Long threads without overflowing the prompt.",
      how: "When the text budget is tight, a cheap model summarizes older turns. Keep the last few turns word for word.",
      connects: ["AppConfig", "Prompt Management", "CloudWatch"],
      input: "Older turns that no longer fit.",
      output: "A short summary for the next prompt."
    }
  ],
  alternatives: [
    { option: "Database plus summary", when: "Custom chat default", pros: "You control what the model sees", cons: "You must watch the text budget." },
    { option: "Agent built-in session", when: "You already use Agents as the chat runtime", pros: "Less glue", cons: "The UI may still need your own store to redraw history." },
    { option: "Send the full transcript every time", when: "A tiny demo", pros: "Simple", cons: "Overflow and cost. Fails real stories." }
  ],
  examAsks: [
    "Session state belongs in a database. Not only in the browser. Not in function env vars.",
    "Summarize old turns when the window fills. Do not first jump to a giant context model.",
    "Agent memory is for this user and this task. Company facts still come from search with rules."
  ],
  realApp: "Travel pay, then what about contractors, uses the same session and the same team filter. After 20 turns, older turns shrink. A new connection resumes from DynamoDB.",
  sections: [
    {
      heading: "What must never live in memory",
      paragraphs: [
        "Keys, tool secrets, another person's turns, and files Maya failed the team check for. Memory can also land in logs. Encrypt the table. Scan summaries with the same safety net."
      ]
    },
    {
      heading: "Compute stays stateless",
      paragraphs: [
        "Lambda should not keep chat in a temp folder. State lives in DynamoDB, search, and workflows. That is why a reconnect can still resume."
      ]
    }
  ]
});
