package org.ftt.familytasktracking.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.ftt.familytasktracking.dtos.ProfileResponseDto;
import org.ftt.familytasktracking.dtos.TaskRequestDto;
import org.ftt.familytasktracking.dtos.TaskResponseDto;
import org.ftt.familytasktracking.exceptions.ErrorDetails;
import org.ftt.familytasktracking.models.TaskModel;
import org.ftt.familytasktracking.services.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/tasks")
public class TaskAdminController {
    private final TaskService taskService;

    public TaskAdminController(TaskService taskService) {
        this.taskService = taskService;
    }

    @Operation(summary = "Creates a new task")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Created task",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProfileResponseDto.class))}),
            @ApiResponse(responseCode = "400", description = "Invalid JSON submitted",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "401", description = "Request doesn't contain valid bearer token or " +
                    "Session Id is invalid",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "403", description = "The profile that is trying to create this resource is " +
                    "unprivileged",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))})
    }
    )
    @PostMapping
    public ResponseEntity<TaskResponseDto> createTask(@RequestBody @Valid final TaskRequestDto dto,
                                                      @AuthenticationPrincipal Jwt jwt) {
        TaskResponseDto responseDto = taskService.createTask(dto, jwt);
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

    @Operation(summary = "Updates a Task by it's UUID and it's Authorization-Token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Found task and updated it",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProfileResponseDto.class))}),
            @ApiResponse(responseCode = "400", description = "Invalid JSON submitted",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "401", description = "Request doesn't contain valid bearer token or " +
                    "Session Id is invalid",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "403", description = "The profile is unprivileged",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "404", description = "Task to update couldn't be found",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}
            )}
    )
    @PutMapping("/{id}")
    public TaskResponseDto updateTaskByUuidAndJwt(@PathVariable(value = "id") UUID uuid,
                                                  @AuthenticationPrincipal Jwt jwt,
                                                  @RequestBody TaskRequestDto dto) {
        TaskModel model = this.taskService.buildModelFromTaskRequestDto(dto);
        return this.taskService.updateTaskByUuidAndJwt(model, uuid, jwt, false).toResponseDto();
    }

    @Operation(summary = "Deletes a Task by it's UUID and it's Authorization-Token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Found task and deleted it",
                    content = {@Content(mediaType = "application/json")}),
            @ApiResponse(responseCode = "401", description = "Request doesn't contain valid bearer token or " +
                    "Session Id is invalid",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "403", description = "The profile that is trying to delete this resource is " +
                    "unprivileged",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "404", description = "Task to delete couldn't be found",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}
            )}
    )
    @DeleteMapping(value = "/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTaskById(@PathVariable("id") UUID id, @AuthenticationPrincipal Jwt jwt) {
        taskService.deleteTaskByIdAndJwt(id, jwt);
    }
}
