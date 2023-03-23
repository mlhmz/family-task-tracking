package org.ftt.familytasktracking.exceptions;

import org.springframework.http.HttpStatus;

/**
 * The WebRtExec is a central RuntimeException for Exceptions that should be shown to the user.
 * <p>
 * It will be handled as a controller advice in the {@link WebRtExecHandler}.
 */
public class WebRtExec extends RuntimeException {
    private final ErrorDetails errorDetails;

    public WebRtExec(HttpStatus status, String message) {
        this.errorDetails = new ErrorDetails(status, message);
    }

    public ErrorDetails getErrorDetails() {
        return errorDetails;
    }
}

