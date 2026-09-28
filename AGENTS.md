# Agent instructions (learning-project)

Short orientation for AI agents and humans automating this repo. Full structure and commands: **[README.md](README.md)**.

## What this repo is

Interactive **JavaScript learning** tooling: the main **CodeStep** learner UI (`frontend/`), **beginner-js** drill topics (`beginner-js/` + root `Makefile`), **Codestep product docs** (`docs/codestep/`), separate static viewers for **system-design** (`system-design/`), **data-structures** (`data-structures/`), **java** (`java/`), **AIP-C01 exam prep** (`certificates/aws-genai-pro/`), a beginner **todo e2e app** (`e2e-project/`), and **Code for Cleaning** task rounds (`cleaning-projects/`).

## Cursor configuration

- **Rules:** `.cursor/rules/` — always-on or scoped guidance (e.g. monorepo layout).
- **Skills:** `.cursor/skills/` — optional workflows (e.g. `caveman` for low-token communication when the user invokes it).

Prefer the README’s project table and phase docs over duplicating long structure here.

## Stack summary

| Area | Stack / notes |
|------|----------------|
| `frontend/` | Vite, React, TypeScript, Tailwind; Vitest/ESLint per `frontend/package.json` |
| `beginner-js/` | Bun-driven tests via `Makefile` |
| `system-design/` | Static HTML/CSS/JS |
| `data-structures/` | Static HTML/CSS/JS — CS roadmap with data structures, algorithms, web/infra foundations, and interactive demos |
| `java/` | Static HTML/CSS/JS — Ubuntu-focused Java 21 LTS learning hub with basics, REST/HTTP, UML, Git, and design-pattern tracks |
| `certificates/aws-genai-pro/` | Static HTML/CSS/JS — AIP-C01 example-first exam prep (Maya / Company Knowledge Assistant) with localStorage progress and quizzes |
| `e2e-project/` | HTML/CSS/JS + Spring Boot (JdbcTemplate SQL, no Hibernate) + PostgreSQL beginner todo app; `make` in that folder starts everything |
| `cleaning-projects/` | Code for Cleaning: English task briefs (Java-first, plus small web and Linux tasks) traded for bathroom cleaning. Docs only, including a beginner terminal I/O guide; solutions stay out of git. New round every two weeks from `progress.md`. |

Match existing style and file layout in the subtree you edit; domain logic for CodeStep belongs under `frontend/src/domains/`.
