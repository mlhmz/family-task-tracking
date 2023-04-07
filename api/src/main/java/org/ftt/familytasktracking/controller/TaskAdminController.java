package org.ftt.familytasktracking.controller;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.ftt.familytasktracking.dtos.TaskRequestDto;
import org.ftt.familytasktracking.dtos.TaskResponseDto;
import org.ftt.familytasktracking.services.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/tasks")
public class TaskAdminController {
    private final TaskService taskService;
    public TaskAdminController(TaskService taskService) {
        this.taskService = taskService;
    }

    @Operation(summary = "Creates a new task")
    @PostMapping
    public ResponseEntity<TaskResponseDto> createTask(@RequestBody @Valid final TaskRequestDto dto,
                                                      @AuthenticationPrincipal Jwt jwt) {
        TaskResponseDto responseDto = taskService.createTask(dto, jwt);
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

}
