package org.ftt.familytasktracking.exceptions;

import org.springframework.http.HttpStatus;

/**
 * The WebRtException is a central RuntimeException for Exceptions that should be shown to the user.
 * <p>
 * It will be handled as a controller advice in the {@link WebRtExceptionHandler}.
 */
public class WebRtException extends RuntimeException {
    private final ErrorDetails errorDetails;

    public WebRtException(HttpStatus status, String message) {
        this.errorDetails = new ErrorDetails(status, message);
    }

    public ErrorDetails getErrorDetails() {
        return errorDetails;
    }
}

