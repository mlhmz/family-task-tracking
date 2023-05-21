package org.ftt.familytasktracking.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Exception Handler for the {@link WebRtException} as a {@link ControllerAdvice}
 */
@ControllerAdvice
public class WebRtExceptionHandler {
    /**
     * Handles the {@link WebRtException} in Controllers by getting the {@link ErrorDetails} from it and
     * putting it into a {@link ResponseEntity}
     *
     * @param ex {@link WebRtException} to handle
     * @return {@link ResponseEntity} filled with the {@link ErrorDetails}
     */
    @ExceptionHandler(WebRtException.class)
    @ResponseBody
    public ResponseEntity<?> handleWebRtExec(WebRtException ex) {
        return new ResponseEntity<>(ex.getErrorDetails(), HttpStatusCode.valueOf(ex.getErrorDetails().httpStatus()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseBody
    public ResponseEntity<?> handleIllegalArgumentException(IllegalArgumentException ex) {
        ErrorDetails errorDetails = new ErrorDetails(HttpStatus.BAD_REQUEST, ex.getMessage());
        return new ResponseEntity<>(errorDetails, HttpStatusCode.valueOf(errorDetails.httpStatus()));
    }

}
