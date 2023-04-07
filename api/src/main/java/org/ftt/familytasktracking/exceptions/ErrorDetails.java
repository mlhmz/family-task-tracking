package org.ftt.familytasktracking.exceptions;

import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

public record ErrorDetails(
        int httpStatus,
        String message,
        LocalDateTime timestamp
) {
    public ErrorDetails(HttpStatus httpStatus, String message) {
        this(httpStatus.value(), message, LocalDateTime.now());
    }
}
