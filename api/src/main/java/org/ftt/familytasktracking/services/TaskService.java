package org.ftt.familytasktracking.services;

import lombok.NonNull;
import org.ftt.familytasktracking.dtos.TaskRequestDto;
import org.ftt.familytasktracking.dtos.TaskResponseDto;
import org.ftt.familytasktracking.entities.Task;
import org.ftt.familytasktracking.models.TaskModel;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;
import java.util.UUID;

public interface TaskService {
    /**
     * Creates a new task
     *
     * @param dto {@link TaskRequestDto}
     * @return {@link TaskResponseDto}
     */
    TaskResponseDto createTask(TaskRequestDto dto, Jwt jwt);

    void deleteTaskByIdAndJwt(UUID taskId, Jwt jwt);

    List<TaskModel> getAllTasksByJwt(@NonNull Jwt jwt);

    List<TaskModel> getAllTasksByJwtAndSearchQuery(@NonNull Jwt jwt, @NonNull String query);

    TaskModel getTaskByUuidAndJwt(@NonNull UUID uuid, @NonNull Jwt jwt);

    TaskModel buildModelFromTaskEntity(Task entity);

    TaskModel buildModelFromTaskRequestDto(TaskRequestDto dto);
}
