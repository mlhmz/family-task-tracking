package org.ftt.familytasktracking.controller;

import io.micrometer.common.util.StringUtils;
import org.ftt.familytasktracking.dtos.TaskResponseDto;
import org.ftt.familytasktracking.models.TaskModel;
import org.ftt.familytasktracking.services.TaskService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tasks")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

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

    @GetMapping(value = "/{id}")
    public TaskResponseDto getTaskByUuidAndJwt(@PathVariable(value = "id") UUID uuid,
                                               @AuthenticationPrincipal Jwt jwt) {
        return this.taskService.getTaskByUuidAndJwt(uuid, jwt).toResponseDto();
    }

    private List<TaskResponseDto> mapModelCollectionToDtoCollection(List<TaskModel> models) {
        return models
                .stream()
                .map(TaskModel::toResponseDto)
                .toList();
    }
}