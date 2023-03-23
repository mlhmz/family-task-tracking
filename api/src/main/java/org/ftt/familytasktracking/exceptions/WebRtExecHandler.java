package org.ftt.familytasktracking.exceptions;

import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

@ControllerAdvice
public class WebRtExecHandler {
    @ExceptionHandler(WebRtExec.class)
    @ResponseBody
    public ResponseEntity<?> handleWebRtExec(WebRtExec ex) {
        return new ResponseEntity<>(ex.getErrorDetails(), HttpStatusCode.valueOf(ex.getErrorDetails().httpStatus()));
    }
}
