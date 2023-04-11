package org.ftt.familytasktracking.controller;

import io.micrometer.common.util.StringUtils;
import org.ftt.familytasktracking.dtos.TaskResponseDto;
import org.ftt.familytasktracking.models.TaskModel;
import org.ftt.familytasktracking.services.TaskService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tasks")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    public List<TaskResponseDto> getAllTasksByJwtAndQuery(@RequestParam(value = "query") String query,
                                                          @AuthenticationPrincipal Jwt jwt) {
        if (StringUtils.isEmpty(query)) {
            return mapModelCollectionToDtoCollection(this.taskService.getAllTasksByJwt(jwt));
        }

        return mapModelCollectionToDtoCollection(
                this.taskService.getAllTasksByJwtAndSearchQuery(jwt, query)
        );
    }

    private List<TaskResponseDto> mapModelCollectionToDtoCollection(List<TaskModel> models) {
        return models
                .stream()
                .map(TaskModel::toResponseDto)
                .toList();
    }
}