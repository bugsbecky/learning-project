# learning-project

Interactive learning tooling for guided walkthroughs, in-browser practice, static curriculum hubs, and terminal-based projects.

## Project structure

High-level map of the monorepo (stacks: CodeStep UI in **`frontend/`**, Bun-tested drills in **`beginner-js/`**, static Java/CS/system-design viewers, and project docs).

| Path | What it is |
|------|------------|
| [`index.html`](index.html) | Root landing page for the whole learning repo: CodeStep, beginner JS, Java, CS roadmap, system design, AIP-C01, Spring Boot, and projects. |
| [`frontend/`](frontend/README.md) | **CodeStep** — Vite + React + TypeScript + Tailwind learner app (guided examples, playground, worker sandbox). Course logic and highlighting live under [`frontend/src/domains/`](frontend/src/domains/) (each subdomain may have a short `README.md`). |
| [`beginner-js/`](beginner-js/README.md) | **Topic folders** (variables, math, strings, …) with `tasks.js` / `tasks.test.js`; run tests from the repo root with **`make`** — see [`Makefile`](Makefile). |
| [`docs/codestep/`](docs/codestep/overview.md) | Product overview and **implementation phases** [`01.md`](docs/codestep/01.md)–[`04.md`](docs/codestep/04.md). |
| [`system-design/`](system-design/index.html) | Static HTML/CSS/JS **architecture explorer**; open `index.html` in a browser — separate from the React app. |
| [`data-structures/`](data-structures/README.md) | Static HTML/CSS/JS **CS roadmap** with data structures, algorithms, web/infra foundations, DevOps, Git, Docker, and auth basics; open `index.html` in a browser. |
| [`java/`](java/README.md) | Static HTML/CSS/JS **Java learning hub** — Ubuntu-only Java 21 LTS curriculum from setup through methods, objects, arrays, strings, collections, exceptions, I/O, debugging, testing, build tools, Git, REST, UML, JVM memory, design patterns, and practice projects; open [`java/index.html`](java/index.html). |
| [`certificates/aws-genai-pro/`](certificates/aws-genai-pro/README.md) | Static HTML/CSS/JS **AIP-C01** prep. Example-first chapters around one company chat, quizzes, and a mock exam. Open [`certificates/aws-genai-pro/index.html`](certificates/aws-genai-pro/index.html). |
| [`spring-boot-system-design/`](spring-boot-system-design/README.md) | Step-by-step Java, Spring Boot, Docker, monolith, messaging, and microservices backend curriculum. |
| [`e2e-project/`](e2e-project/README.md) | **Beginner todo app** — HTML/CSS/JS + Spring Boot + PostgreSQL with handwritten SQL (no Hibernate). Run with `make` in that folder. |
| [`projects/`](projects/README.md) | **Beginner project curriculum** — four scaffolded learning projects (Weather, Docker, CLI, React) with docs only; you write the code. |
| [`cleaning-projects/`](cleaning-projects/README.md) | **Code for Cleaning** — two-week Java-focused task rounds traded for bathroom cleaning. Rules, a beginner setup guide, and round briefs; solutions stay local. |
| [`AGENTS.md`](AGENTS.md) | Short entry for **AI agents and automation** (stack summary, `.cursor/` layout); full navigation stays in this README. |
| [`Makefile`](Makefile) | Root **`make`** targets wrapping **Bun** tests for `beginner-js/`. |

```
learning-project/
├── index.html                 # Root landing page for all learning tracks
├── landing.css                # Root landing page styles
├── AGENTS.md                 # Agents / automation orientation
├── Makefile                  # beginner-js test shortcuts (Bun)
├── beginner-js/              # Topic drills (tasks + tests)
├── docs/
│   └── codestep/             # CodeStep overview + phased specs (01–04)
├── frontend/                 # CodeStep app (Vite + React + TS + Tailwind)
│   ├── init_example.html     # Legacy static prototype (reference only)
│   ├── src/
│   │   ├── components/       # Shared UI
│   │   ├── domains/          # Course domains + walkthrough logic
│   │   └── workers/          # Sandbox worker(s)
│   ├── README.md
│   └── (other app files; see frontend/README.md)
├── system-design/            # Standalone architecture viewer (index.html)
├── data-structures/          # CS roadmap viewer (index.html)
├── java/                     # Java learning hub (index.html)
├── certificates/aws-genai-pro/ # AIP-C01 GenAI Professional prep (index.html)
├── spring-boot-system-design/# Java/Spring/Docker system-design curriculum
├── e2e-project/              # Beginner todo: HTML/CSS/JS + Spring Boot + Postgres
├── projects/                 # Beginner 4-project curriculum (docs + scaffolding)
├── cleaning-projects/        # Code for Cleaning: 2-week task rounds (docs only)
└── README.md
```

**Cursor:** repo rules and optional skills live under [`.cursor/rules/`](.cursor/rules/) and [`.cursor/skills/`](.cursor/skills/) — summarized in [`AGENTS.md`](AGENTS.md).

## CodeStep app (main UI)

The **CodeStep** learner experience (guided examples + playground) is the Vite + React app under **`frontend/`**.

```bash
cd frontend
bun install
bun run dev
```

Documentation for design and phases lives in [`docs/codestep/overview.md`](docs/codestep/overview.md) (phases [`01.md`](docs/codestep/01.md)–[`04.md`](docs/codestep/04.md)).

Setup, scripts, and implementation notes: [`frontend/README.md`](frontend/README.md).

The file [`frontend/init_example.html`](frontend/init_example.html) is a legacy static prototype kept for reference only; the maintained entry point is the React app above.
