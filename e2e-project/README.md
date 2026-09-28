# Beginner todo app (end-to-end)

A small **todo list** you can run on your machine. No login. No Hibernate.
The point is to *see* three ideas that every web app uses:

1. **HTTP requests** — the browser asks the server to do something
2. **CRUD** — Create, Read, Update, Delete
3. **SQL** — how those actions become rows in PostgreSQL

```text
Browser (HTML/CSS/JS)  --HTTP-->  Java Spring Boot  --SQL-->  PostgreSQL
```

## Start here

You need **Docker Desktop**. Java and Maven run inside Docker, so you do not install them to start the app.

```bash
cd e2e-project
make
```

That **rebuilds and recreates** the app and database containers if they were already running.

When it prints `Ready`, open:

[http://localhost:8080](http://localhost:8080)

| Command | What it does |
|---------|----------------|
| `make` | Start everything (restart if already running) |
| `make stop` | Stop the Java app and PostgreSQL |
| `make logs` | Watch Java + SQL in the terminal |
| `make sql` | Open a PostgreSQL prompt |

The first `make` can take a few minutes while Docker downloads images and compiles the Java app. Later runs are faster.

Todos you already created stay in PostgreSQL across `make` restarts. `make stop` shuts the containers down but does not wipe the table.

## What to do on the page

1. Add a todo — that is **Create** (`POST` + `INSERT`).
2. Tick the checkbox — that is **Update** (`PUT` + `UPDATE`).
3. Delete it — that is **Delete** (`DELETE` + `DELETE`).
4. Refresh the page — that is **Read** (`GET` + `SELECT`).

The right-hand panel shows the last HTTP request and the SQL that action uses.
In another terminal, `make logs` shows the real SQL Spring sent to PostgreSQL.

## Folders

```text
e2e-project/
├── Makefile                 # the one command: make
├── docker-compose.yml       # PostgreSQL + Java app in Docker
├── README.md                # this file
├── docs/
│   ├── HOW-IT-WORKS.md      # one request from click → SQL → JSON
│   └── CODE-TOUR.md         # what each source file is for
├── frontend/                # what the browser runs
│   ├── index.html
│   ├── css/styles.css
│   └── js/app.js
└── backend/                 # what the server runs
    ├── Dockerfile           # how Docker builds and runs the Java app
    ├── pom.xml              # libraries (Web + JDBC, not JPA/Hibernate)
    └── src/main/
        ├── java/com/learning/todo/
        └── resources/
            ├── application.properties
            └── schema.sql   # CREATE TABLE todos
```

## Ports

| Port | What |
|------|------|
| **8080** | App + API (`http://localhost:8080`) |
| **5433** | PostgreSQL on your machine (inside Docker it is still 5432) |

5433 is used so this can run next to other local Postgres apps that already use 5432.

## CRUD, HTTP, and SQL

| CRUD | Button / action | HTTP | SQL |
|------|-----------------|------|-----|
| Create | Add | `POST /api/todos` | `INSERT INTO todos ...` |
| Read | Page load | `GET /api/todos` | `SELECT ... FROM todos` |
| Update | Checkbox | `PUT /api/todos/{id}` | `UPDATE todos SET ...` |
| Delete | Delete | `DELETE /api/todos/{id}` | `DELETE FROM todos ...` |

Try the same Create from a terminal:

```bash
curl -s http://localhost:8080/api/todos
curl -s -X POST http://localhost:8080/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"From curl"}'
```

## Why no Hibernate?

Hibernate (JPA) writes SQL for you. That is useful later, and it hides the part we want to learn.
This app uses **JdbcTemplate**: Java strings that are real `SELECT` / `INSERT` / `UPDATE` / `DELETE`.
Read `TodoRepository.java` next to `schema.sql`.

## Next reading

1. [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) — follow one click through the stack
2. [docs/CODE-TOUR.md](docs/CODE-TOUR.md) — file by file
3. Then change a title check or a column and run `make` again
