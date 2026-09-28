package com.learning.todo;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

/**
 * Turns Java exceptions into JSON the browser can show.
 * Without this, a missing todo would become a stack trace HTML page.
 *
 * <p>{@code @RestControllerAdvice} = run this for errors thrown from any controller.
 */
@RestControllerAdvice
public class ErrorHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<Map<String, String>> handleApi(ApiException ex) {
        return ResponseEntity
                .status(ex.httpStatus())
                .body(Map.of("error", ex.getMessage()));
    }
}
