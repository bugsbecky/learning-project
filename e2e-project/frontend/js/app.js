/**
 * Vanilla JavaScript — no framework.
 *
 * fetch() sends an HTTP request and returns a Promise of the response.
 * We keep every CRUD action in its own function so you can match it
 * to TodoController.java and the SQL in TodoRepository.java.
 */

const API = "/api/todos";

const listEl = document.getElementById("todo-list");
const statusEl = document.getElementById("list-status");
const formEl = document.getElementById("create-form");
const titleInput = document.getElementById("title-input");
const inspectorEmpty = document.getElementById("inspector-empty");
const inspectorBody = document.getElementById("inspector-body");
const requestView = document.getElementById("request-view");
const responseView = document.getElementById("response-view");
const sqlHint = document.getElementById("sql-hint");

const SQL_FOR = {
  GET: "SELECT id, title, done, created_at FROM todos ...",
  POST: "INSERT INTO todos (title) VALUES (?) RETURNING ...",
  PUT: "UPDATE todos SET title = ?, done = ? WHERE id = ?",
  DELETE: "DELETE FROM todos WHERE id = ?",
};

formEl.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = titleInput.value.trim();
  if (!title) {
    return;
  }
  try {
    await createTodo(title);
    titleInput.value = "";
    titleInput.focus();
    await loadTodos({ inspect: false });
  } catch (error) {
    showError(error);
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadTodos({ inspect: true });
  } catch (error) {
    showError(error);
  }
});

/** READ — GET /api/todos */
async function loadTodos({ inspect } = { inspect: true }) {
  const todos = await request("GET", API, undefined, { inspect });
  renderList(todos);
}

/** CREATE — POST /api/todos */
async function createTodo(title) {
  await request("POST", API, { title });
}

/** UPDATE — PUT /api/todos/{id} */
async function updateTodo(todo, changes) {
  await request("PUT", `${API}/${todo.id}`, {
    title: changes.title ?? todo.title,
    done: changes.done ?? todo.done,
  });
}

/** DELETE — DELETE /api/todos/{id} */
async function deleteTodo(id) {
  await request("DELETE", `${API}/${id}`);
}

/**
 * One place that talks to the server, so the inspector can show
 * method, URL, JSON body, status, and response for every action.
 */
async function request(method, url, body, { inspect = true } = {}) {
  const options = {
    method,
    headers: {},
  };

  if (body !== undefined) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (inspect) {
    showInspector(method, url, body, response.status, data);
  }

  if (!response.ok) {
    const message = data && data.error ? data.error : `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}

function showInspector(method, url, body, status, data) {
  inspectorEmpty.hidden = true;
  inspectorBody.hidden = false;
  sqlHint.textContent = SQL_FOR[method] || "";

  const requestLines = [`${method} ${url}`];
  if (body !== undefined) {
    requestLines.push(JSON.stringify(body, null, 2));
  } else {
    requestLines.push("(no JSON body)");
  }
  requestView.textContent = requestLines.join("\n");

  const responsePayload = data === null || data === undefined ? "(empty body)" : JSON.stringify(data, null, 2);
  responseView.textContent = `HTTP ${status}\n${responsePayload}`;
}

function renderList(todos) {
  statusEl.hidden = true;
  listEl.replaceChildren();

  if (!Array.isArray(todos) || todos.length === 0) {
    const empty = document.createElement("li");
    empty.className = "todo-item";
    empty.textContent = "No todos yet. Type a title and click Add.";
    listEl.append(empty);
    return;
  }

  for (const todo of todos) {
    listEl.append(renderItem(todo));
  }
}

function renderItem(todo) {
  const li = document.createElement("li");
  li.className = "todo-item" + (todo.done ? " done" : "");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = Boolean(todo.done);
  checkbox.title = "Mark done or not done";
  checkbox.addEventListener("change", async () => {
    try {
      await updateTodo(todo, { done: checkbox.checked });
      await loadTodos({ inspect: false });
    } catch (error) {
      showError(error);
    }
  });

  const textWrap = document.createElement("div");
  const title = document.createElement("p");
  title.className = "todo-title";
  title.textContent = todo.title;

  const meta = document.createElement("p");
  meta.className = "todo-meta";
  meta.textContent = `id ${todo.id}` + (todo.createdAt ? ` · ${formatTime(todo.createdAt)}` : "");

  textWrap.append(title, meta);

  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "delete-btn";
  remove.textContent = "Delete";
  remove.addEventListener("click", async () => {
    try {
      await deleteTodo(todo.id);
      await loadTodos({ inspect: false });
    } catch (error) {
      showError(error);
    }
  });

  li.append(checkbox, textWrap, remove);
  return li;
}

function formatTime(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return date.toLocaleString();
}

function showError(error) {
  statusEl.hidden = false;
  statusEl.textContent = error.message || String(error);
}

window.addEventListener("unhandledrejection", (event) => {
  showError(event.reason);
});
