package com.learning.todo;

import java.time.Instant;

/**
 * One todo item. The same shape appears in three places:
 *
 * <ol>
 *   <li>a row in the PostgreSQL table {@code todos}</li>
 *   <li>this Java object in memory</li>
 *   <li>JSON sent to and from the browser, e.g. {@code {"id":1,"title":"Milk","done":false}}</li>
 * </ol>
 *
 * <p>Jackson (bundled with Spring Web) turns JSON into this class and back.
 * {@link TodoRepository} copies database columns into the fields.
 */
public class Todo {

    private Long id;
    private String title;
    private boolean done;
    private Instant createdAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public boolean isDone() {
        return done;
    }

    public void setDone(boolean done) {
        this.done = done;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
