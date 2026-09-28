package com.learning.todo;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.List;

/**
 * The only class that talks to PostgreSQL. Every method is one SQL statement.
 *
 * <p>{@code JdbcTemplate} is a Spring helper: you pass SQL + parameters,
 * it opens a connection, runs the statement, and closes the connection.
 *
 * <p>{@code ?} placeholders are bound to the Java values that follow.
 * Never glue user text into SQL with string concatenation (that is how SQL injection happens).
 *
 * <p>{@code @Repository} means: Spring creates one instance and can hand it
 * to {@link TodoController} through the constructor (dependency injection).
 */
@Repository
public class TodoRepository {

    private final JdbcTemplate jdbc;

    public TodoRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    /** READ all — HTTP GET /api/todos */
    public List<Todo> findAll() {
        return jdbc.query(
                "SELECT id, title, done, created_at FROM todos ORDER BY id",
                this::mapRow
        );
    }

    /** READ one — used by GET /api/todos/{id} and after updates */
    public Todo findById(long id) {
        List<Todo> rows = jdbc.query(
                "SELECT id, title, done, created_at FROM todos WHERE id = ?",
                this::mapRow,
                id
        );
        return rows.isEmpty() ? null : rows.get(0);
    }

    /** CREATE — HTTP POST /api/todos. RETURNING gives us the new row in one round trip. */
    public Todo insert(String title) {
        return jdbc.queryForObject(
                "INSERT INTO todos (title) VALUES (?) RETURNING id, title, done, created_at",
                this::mapRow,
                title
        );
    }

    /**
     * UPDATE — HTTP PUT /api/todos/{id}.
     * {@code jdbc.update} returns how many rows changed. 0 means that id does not exist.
     */
    public Todo update(long id, String title, boolean done) {
        int changed = jdbc.update(
                "UPDATE todos SET title = ?, done = ? WHERE id = ?",
                title,
                done,
                id
        );
        if (changed == 0) {
            return null;
        }
        return findById(id);
    }

    /** DELETE — HTTP DELETE /api/todos/{id}. Returns false when the id was missing. */
    public boolean delete(long id) {
        int changed = jdbc.update("DELETE FROM todos WHERE id = ?", id);
        return changed > 0;
    }

    /**
     * Turns one database row into a Java {@link Todo}.
     * Column names here must match schema.sql.
     */
    private Todo mapRow(ResultSet rs, int rowNum) throws SQLException {
        Todo todo = new Todo();
        todo.setId(rs.getLong("id"));
        todo.setTitle(rs.getString("title"));
        todo.setDone(rs.getBoolean("done"));
        Timestamp created = rs.getTimestamp("created_at");
        if (created != null) {
            todo.setCreatedAt(created.toInstant());
        }
        return todo;
    }
}
