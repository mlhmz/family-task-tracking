package org.ftt.familytasktracking.exceptions;

import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Exception Handler for the {@link WebRtExec} as a {@link ControllerAdvice}
 */
@ControllerAdvice
public class WebRtExecHandler {
    /**
     * Handles the {@link WebRtExec} in Controllers by getting the {@link ErrorDetails} from it and
     * putting it into a {@link ResponseEntity}
     *
     * @param ex {@link WebRtExec} to handle
     * @return {@link ResponseEntity} filled with the {@link ErrorDetails}
     */
    @ExceptionHandler(WebRtExec.class)
    @ResponseBody
    public ResponseEntity<?> handleWebRtExec(WebRtExec ex) {
        return new ResponseEntity<>(ex.getErrorDetails(), HttpStatusCode.valueOf(ex.getErrorDetails().httpStatus()));
    }
}
