# AIP-C01 · AWS Generative AI Developer Professional

Vanilla HTML/CSS/JS exam prep for **Amazon AWS Certified Generative AI Developer – Professional (AIP-C01)**. Open [`index.html`](index.html) in a browser (works from `file://`). Serve it over `http://` to install it as a **PWA** and study offline.

This is not an A to Z catalog of AWS products. It is one employee named **Maya** using a **Company Knowledge Assistant**. She asks real questions. Each chapter adds one piece of that chat.

## How to use it

1. Follow the sidebar path **00 → 27** in order.
2. Read the real example first. Then the short steps.
3. Mark a chapter done when you can retell the example in your own words.
4. Use **Quiz** on each chapter, then the **full mock exam**.
5. Use **Question list** for an unlimited filtered practice stream. Filter by domain, AWS service, source, or question status, then answer the matching list in order.
6. Use **Full mock exam** to choose Smart practice or a randomized exam mode, then select 10, 20, 50, 80, or a custom question count. The same domain, service, source, and status filters are available before starting.
7. Each mock exam is a separate saved run (up to two runs per browser). A run keeps its own set, position, choices, skips, and results; all-time right/wrong history is shared across every run. Smart practice selects unseen items first; once all items have been seen, it prioritizes recent misses and weak items.

Reset chapter progress and quiz stats from the sidebar footer (separate actions).

## Install as an app (PWA)

Service workers do not run from `file://`. Serve this folder (or the repo root) over HTTP, open the site once so assets can cache, then install:

```bash
# from this folder
python3 -m http.server 8080
# then open http://127.0.0.1:8080/
```

Or from the repo root: `python3 -m http.server 8765` and open `/certificates/aws-genai-pro/index.html`.

- **Chrome / Edge / Android:** sidebar **Install app**, or the browser install icon in the address bar.
- **iPhone / iPad:** Share → **Add to Home Screen**.
- Progress and quiz stats stay in `localStorage` on that device.

The app shell, chapters, and question bank are precached. Google Fonts cache after the first online visit; offline still works with system fonts.

## Exam domains (dashboard on the home page)

| Domain | Weight | Focus |
|--------|--------|--------|
| 1 Foundation Model Integration, Data Management, and Compliance | 31% | FM choice, RAG, vectors, prompts |
| 2 Implementation and Integration | 26% | APIs, agents, tools, workflows, CI/CD |
| 3 AI Safety, Security, and Governance | 20% | Guardrails, IAM/VPC, governance |
| 4 Operational Efficiency and Optimization | 12% | Cost, latency, observability |
| 5 Testing, Validation, and Troubleshooting | 11% | Eval, RAG quality, debug |

## Folder layout

```
certificates/aws-genai-pro/
├── index.html
├── manifest.webmanifest # PWA install metadata
├── sw.js                # offline cache (http/https only)
├── icons/               # app / apple-touch / favicon
├── css/                 # tokens, base, layout, components
├── js/
│   ├── ns.js            # AIP.registerChapter / registerQuestions
│   ├── config.js        # domains, journey stages, storage keys
│   ├── study-guide.js   # architecture paths, one-line summaries, memory checks
│   ├── chapters.js      # sidebar metadata 00–27
│   ├── storage.js       # localStorage progress + quiz stats
│   ├── render.js        # chapter / home HTML
│   ├── quiz.js          # attempt flow
│   ├── app.js           # hash router + sidebar
│   ├── content/         # one file per chapter
│   └── questions/
│       ├── practice.js          # original practice items
│       ├── examtopics-p01.js …  # ExamTopics pages (stubs OK)
│       ├── certsafari-p01.js … p36.js  # CertSafari import (358 items, sorted)
│       └── raw/                 # optional scrape dumps
└── README.md
```

To add a chapter: copy a `js/content/*.js` file, register it, add a row in `js/chapters.js`, and a `<script>` tag in `index.html`.

Chapter fields: `summary`, `assistant` (the real example), `walkthrough` (short steps), `problem`, `why`, `services`, `alternatives`, `examAsks`, `realApp`, `sections`.

Every chapter is rendered through the same scan-friendly topic template: header and exam badges, architecture context, problem/solution, request steps, component cards, decision matrix, exam clues, must-memorize checklist, and footer navigation. Longer `sections` content stays available in the collapsed **Extra context** block instead of interrupting the core study path.

To add mock questions: `AIP.registerQuestions([{ id, chapters, domain, source, stem, choices, correct, why, optionExplanations, badges }])` in a new or existing `js/questions/*.js` file and include the script before `render.js`. Multi-select uses `correct: ["A","D"]`.

## Question bank status

- Practice: 56 items (2 per chapter 00–27).
- ExamTopics: pages 1–3 (`et-1`–`et-30`). Pages 4–12 are empty stubs until pasted.
- CertSafari: **358 items** (`cs-001`–`cs-358`) from [CertSafari AIP-C01](https://www.certsafari.com/aws/gen-ai-developer-professional), sorted by domain → subdomain, with stems, choices, correct letters, subdomain, and per-option explanations kept verbatim. **358 / 360** unique questions imported (99%). Master deduped JSON: `js/questions/raw/certsafari-all.json`. Browse grouped at `#/bank`.

## Storage keys

- `aip-c01:v1:progress`: chapters marked done
- `aip-c01:v1:quiz`: per-question correct/wrong counts
- `aip-c01:v1:ui`: which sidebar groups are expanded
- `aip-c01:v1:exam`: legacy single-run checkpoint (migrated automatically)
- `aip-c01:v1:exam-runs`: up to two resumable mock-exam runs
- `aip-c01:v1:exam-prefs`: last-used mock-exam settings
