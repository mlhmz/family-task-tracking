package org.ftt.familytasktracking.exceptions;

import org.springframework.http.HttpStatus;

public class WebRtExec extends RuntimeException {
    private final ErrorDetails errorDetails;

    public WebRtExec(HttpStatus status, String message) {
        this.errorDetails = new ErrorDetails(status, message);
    }

    public ErrorDetails getErrorDetails() {
        return errorDetails;
    }
}

