# Code tour

Read files in this order. Each file has one job.

## Frontend (the browser)

| File | Job |
|------|-----|
| [`frontend/index.html`](../frontend/index.html) | Page structure: the form, the list, the request panel |
| [`frontend/css/styles.css`](../frontend/css/styles.css) | Layout and colors. No behavior. |
| [`frontend/js/app.js`](../frontend/js/app.js) | Behavior: `fetch` for GET / POST / PUT / DELETE |

`app.js` functions to match with Java:

- `loadTodos` → `GET` → `TodoController.list` → `SELECT`
- `createTodo` → `POST` → `TodoController.create` → `INSERT`
- `updateTodo` → `PUT` → `TodoController.update` → `UPDATE`
- `deleteTodo` → `DELETE` → `TodoController.delete` → `DELETE`

## Backend (the server)

| File | Job |
|------|-----|
| [`schema.sql`](../backend/src/main/resources/schema.sql) | Creates the `todos` table |
| [`application.properties`](../backend/src/main/resources/application.properties) | Database URL, user, password; print SQL |
| [`Todo.java`](../backend/src/main/java/com/learning/todo/Todo.java) | One todo in Java (id, title, done, createdAt) |
| [`TodoRequest.java`](../backend/src/main/java/com/learning/todo/TodoRequest.java) | JSON the browser sends for create/update |
| [`TodoRepository.java`](../backend/src/main/java/com/learning/todo/TodoRepository.java) | The SQL. Start here if you want to see CRUD. |
| [`TodoController.java`](../backend/src/main/java/com/learning/todo/TodoController.java) | The HTTP endpoints |
| [`ErrorHandler.java`](../backend/src/main/java/com/learning/todo/ErrorHandler.java) | Turns `ApiException` into `{"error":"..."}` |
| [`ApiException.java`](../backend/src/main/java/com/learning/todo/ApiException.java) | 400 / 404 with a message |
| [`HealthController.java`](../backend/src/main/java/com/learning/todo/HealthController.java) | `GET /api/health` so `make` knows the app is up |
| [`TodoApplication.java`](../backend/src/main/java/com/learning/todo/TodoApplication.java) | `main` — starts the server |
| [`pom.xml`](../backend/pom.xml) | Libraries: `starter-web` + `starter-jdbc` + PostgreSQL. No JPA. |

## Glue

| File | Job |
|------|-----|
| [`docker-compose.yml`](../docker-compose.yml) | Runs PostgreSQL **and** the Java app |
| [`backend/Dockerfile`](../backend/Dockerfile) | Builds the `.jar` and starts it |
| [`Makefile`](../Makefile) | `make` starts (or restarts) everything |

## What we left out on purpose

- **Login / auth** — later; it would hide the CRUD path
- **Hibernate / JPA** — would hide the SQL
- **A service layer** — with four methods, controller → repository is enough
- **A JavaScript framework** — `fetch` is the actual request

When an app grows, people add a service class between controller and repository for rules.
This app has almost no rules beyond "title is required," so that extra class would only add hops.
