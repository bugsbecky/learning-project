package com.learning.todo;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * HTTP endpoints. The browser never talks to SQL directly.
 * It sends an HTTP <em>request</em> here; we call {@link TodoRepository}; we send an HTTP <em>response</em> back.
 *
 * <p>CRUD mapped to HTTP:
 * <ul>
 *   <li>Create → POST</li>
 *   <li>Read → GET</li>
 *   <li>Update → PUT</li>
 *   <li>Delete → DELETE</li>
 * </ul>
 *
 * <p>{@code @RestController} = this class returns JSON, not an HTML page.
 * {@code @RequestMapping} = every path below starts with /api/todos.
 */
@RestController
@RequestMapping("/api/todos")
public class TodoController {

    private final TodoRepository todos;

    public TodoController(TodoRepository todos) {
        this.todos = todos;
    }

    @GetMapping
    public List<Todo> list() {
        return todos.findAll();
    }

    @GetMapping("/{id}")
    public Todo getOne(@PathVariable long id) {
        Todo todo = todos.findById(id);
        if (todo == null) {
            throw new ApiException(404, "Todo " + id + " not found");
        }
        return todo;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Todo create(@RequestBody TodoRequest body) {
        String title = requireTitle(body);
        return todos.insert(title);
    }

    @PutMapping("/{id}")
    public Todo update(@PathVariable long id, @RequestBody TodoRequest body) {
        String title = requireTitle(body);
        if (body.getDone() == null) {
            throw new ApiException(400, "done is required (true or false)");
        }
        Todo updated = todos.update(id, title, body.getDone());
        if (updated == null) {
            throw new ApiException(404, "Todo " + id + " not found");
        }
        return updated;
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable long id) {
        if (!todos.delete(id)) {
            throw new ApiException(404, "Todo " + id + " not found");
        }
    }

    private static String requireTitle(TodoRequest body) {
        if (body == null || body.getTitle() == null || body.getTitle().isBlank()) {
            throw new ApiException(400, "title is required");
        }
        return body.getTitle().trim();
    }
}
