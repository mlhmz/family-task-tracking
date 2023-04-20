package org.ftt.familytasktracking.controller;

import io.micrometer.common.util.StringUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.ftt.familytasktracking.dtos.ProfileResponseDto;
import org.ftt.familytasktracking.dtos.TaskRequestDto;
import org.ftt.familytasktracking.dtos.TaskResponseDto;
import org.ftt.familytasktracking.exceptions.ErrorDetails;
import org.ftt.familytasktracking.models.TaskModel;
import org.ftt.familytasktracking.services.TaskService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Controller for all unprivileged Task related Operations
 */
@RestController
@RequestMapping("/api/v1/tasks")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @Operation(summary = "Gets all Tasks by the JWT and a optional Search Query")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Found tasks",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProfileResponseDto.class))}),
            @ApiResponse(responseCode = "400", description = "Invalid JSON submitted",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "401", description = "Request doesn't contain valid bearer token or " +
                    "Session ID is not valid",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "404", description = "Task couldn't be found",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}
            )}
    )
    @GetMapping
    public List<TaskResponseDto> getAllTasksByJwt(@RequestParam(value = "query", required = false) String query,
                                                  @AuthenticationPrincipal Jwt jwt) {
        if (StringUtils.isEmpty(query)) {
            return mapModelCollectionToDtoCollection(this.taskService.getAllTasksByJwt(jwt));
        }

        return mapModelCollectionToDtoCollection(
                this.taskService.getAllTasksByJwtAndSearchQuery(jwt, query)
        );
    }

    @Operation(summary = "Gets all Tasks by the JWT and the UUID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Found task",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProfileResponseDto.class))}),
            @ApiResponse(responseCode = "400", description = "Invalid JSON submitted",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "401", description = "Request doesn't contain valid bearer token or " +
                    "Session ID is not valid",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "404", description = "Task couldn't be found",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}
            )}
    )
    @GetMapping(value = "/{id}")
    public TaskResponseDto getTaskByUuidAndJwt(@PathVariable(value = "id") UUID uuid,
                                               @AuthenticationPrincipal Jwt jwt) {
        return this.taskService.getTaskByUuidAndJwt(uuid, jwt).toResponseDto();
    }

    @Operation(summary = "Updates a Task safely" +
            "(Safely means that fields that unprivileged users shouldn't update won't be updated).")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Updated Task",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = TaskResponseDto.class))}),
            @ApiResponse(responseCode = "400", description = "Invalid JSON submitted",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "401", description = "Request doesn't contain valid bearer token or " +
                    "Session ID is not valid",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "404", description = "Task to update couldn't be found from session",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}
            )}
    )
    @PutMapping("/{id}")
    public TaskResponseDto safeUpdateTaskByUuidAndJwt(@PathVariable(value = "id") UUID uuid,
                                                      @AuthenticationPrincipal Jwt jwt,
                                                      @RequestBody TaskRequestDto dto) {
        TaskModel model = this.taskService.buildModelFromTaskRequestDto(dto);
        return this.taskService.updateTaskByUuidAndJwt(model, uuid, jwt, true).toResponseDto();
    }

    private List<TaskResponseDto> mapModelCollectionToDtoCollection(List<TaskModel> models) {
        return models
                .stream()
                .map(TaskModel::toResponseDto)
                .toList();
    }
}