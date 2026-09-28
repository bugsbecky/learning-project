package com.learning.todo;

/**
 * JSON body for create and update. Example:
 *
 * <pre>
 *   { "title": "Buy milk", "done": false }
 * </pre>
 *
 * <p>{@code done} is only required for PUT (update). POST (create) ignores it
 * and always starts the todo as not done.
 */
public class TodoRequest {

    private String title;
    private Boolean done;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Boolean getDone() {
        return done;
    }

    public void setDone(Boolean done) {
        this.done = done;
    }
}
