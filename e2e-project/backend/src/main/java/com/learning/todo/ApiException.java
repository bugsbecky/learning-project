package com.learning.todo;

/**
 * A problem we want to send back as JSON instead of a stack-trace page.
 * {@code httpStatus} is the HTTP code: 400 = bad input, 404 = missing todo.
 */
public class ApiException extends RuntimeException {

    private final int httpStatus;

    public ApiException(int httpStatus, String message) {
        super(message);
        this.httpStatus = httpStatus;
    }

    public int httpStatus() {
        return httpStatus;
    }
}
