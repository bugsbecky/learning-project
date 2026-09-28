# How one click becomes SQL

Read this with the app running (`make`, then [http://localhost:8080](http://localhost:8080)).
Keep `make logs` open in a second terminal.

## The pieces

```text
┌──────────────┐  1. HTTP request     ┌─────────────────┐  2. SQL      ┌────────────┐
│  Browser     │ ───────────────────► │  Spring Boot    │ ───────────► │ PostgreSQL │
│  index.html  │                      │  TodoController │              │  table     │
│  app.js      │ ◄─────────────────── │  TodoRepository │ ◄─────────── │  todos     │
└──────────────┘  4. HTTP response    └─────────────────┘  3. rows     └────────────┘
```

The browser never talks to the database. That is on purpose.
HTTP is the language between programs; SQL is the language inside the database.

## Vocabulary

| Word | Meaning in this app |
|------|---------------------|
| **Request** | A message from the browser: method + URL + optional JSON body |
| **Response** | A message back: status code + optional JSON body |
| **JSON** | Text that looks like `{"title":"Milk"}`. Both sides agree on this shape. |
| **Endpoint** | One URL + method pair, e.g. `POST /api/todos` |
| **CRUD** | The four data operations: Create, Read, Update, Delete |
| **Row** | One todo in the `todos` table |
| **Primary key** | `id` — the unique number for that row |

## Follow Create

You type `Buy milk` and click **Add**.

### 1. Browser — `frontend/js/app.js`

`createTodo` calls `fetch` roughly like this:

```text
POST /api/todos
Content-Type: application/json

{"title":"Buy milk"}
```

That is an HTTP **request**. The right-hand panel on the page shows it.

### 2. Java — `TodoController.create`

Spring sees `POST` + `/api/todos` and runs the `create` method.
`@RequestBody` turns the JSON into a `TodoRequest` object.
If `title` is missing, we throw `ApiException` with status **400**.

### 3. SQL — `TodoRepository.insert`

```sql
INSERT INTO todos (title) VALUES (?) RETURNING id, title, done, created_at
```

`?` is replaced with `Buy milk` (safely, not by gluing strings).
PostgreSQL creates a new row, fills in `id`, `done = false`, `created_at`, and returns that row.

Watch `make logs`: you should see that `INSERT`.

### 4. Response

Java sends **201 Created** and JSON like:

```json
{"id":1,"title":"Buy milk","done":false,"createdAt":"2026-08-30T12:00:00Z"}
```

`app.js` then silently reloads the list with `GET /api/todos` (`SELECT`).

## The other three actions

| You do | Request | Status | SQL |
|--------|---------|--------|-----|
| Open the page | `GET /api/todos` | 200 | `SELECT ... FROM todos ORDER BY id` |
| Tick a box | `PUT /api/todos/1` with `title` + `done` | 200 | `UPDATE todos SET title = ?, done = ? WHERE id = ?` |
| Click Delete | `DELETE /api/todos/1` | 204 (empty body) | `DELETE FROM todos WHERE id = ?` |
| Ask for id 999 | `GET /api/todos/999` | 404 | `SELECT ... WHERE id = 999` (no row) |

**204 No Content** means "it worked, there is nothing to send back."
**404 Not Found** means "that id is not in the table."

## Try SQL yourself

```bash
make sql
```

Then:

```sql
\dt
SELECT * FROM todos;
INSERT INTO todos (title) VALUES ('Typed in psql');
SELECT * FROM todos;
\q
```

Refresh the browser. The row from `psql` appears because both the UI and `psql` share the same table.

## Same origin

The HTML is served by the same Java process as `/api/todos` (`http://localhost:8080`).
So `fetch("/api/todos")` needs no extra CORS setup. That is a later topic.
