package org.ftt.familytasktracking.controller;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/hello")
public class HelloController {
    @Operation(summary = "Returns hello world!")
    @GetMapping("/world")
    public String getWorld() {
        return "Hello world!";
    }
}
