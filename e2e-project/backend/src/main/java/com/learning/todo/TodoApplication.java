package com.learning.todo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * This is the entry point. {@code main} starts an HTTP server (port 8080)
 * and connects to PostgreSQL using the settings in application.properties.
 *
 * <p>{@code @SpringBootApplication} tells Spring: scan this package for
 * controllers and repositories, then wire them together.
 */
@SpringBootApplication
public class TodoApplication {

    public static void main(String[] args) {
        SpringApplication.run(TodoApplication.class, args);
    }
}
