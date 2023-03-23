package org.ftt.familytasktracking.controller;

import jakarta.validation.Valid;
import org.ftt.familytasktracking.dtos.TaskRequestDto;
import org.ftt.familytasktracking.dtos.TaskResponseDto;
import org.ftt.familytasktracking.services.TaskServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("task")
public class TaskController {

    private final TaskServiceImpl taskService;


    public TaskController(TaskServiceImpl taskService) {
        this.taskService = taskService;
    }

    @RequestMapping(
            method = RequestMethod.POST,
            consumes = "application/json",
            produces = "application/hal+json"
    )
    public ResponseEntity<TaskResponseDto> createTask(@RequestBody @Valid final TaskRequestDto dto,
                                                      @AuthenticationPrincipal Jwt jwt) {
        TaskResponseDto responseDto = taskService.createTask(dto);
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

}
