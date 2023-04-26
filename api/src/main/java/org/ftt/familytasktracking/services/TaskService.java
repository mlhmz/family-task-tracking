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

    /**
     * Gets all Tasks of a household by its jwt
     *
     * @param jwt {@link Jwt} of the household
     * @return {@link List} of {@link TaskModel}
     */
    List<TaskModel> getAllTasksByJwt(@NonNull Jwt jwt);

    /**
     * Gets all Tasks of a household by its jwt and a search query
     *
     * @param jwt {@link Jwt} of the household
     * @return {@link List} of {@link TaskModel}
     */
    List<TaskModel> getAllTasksByJwtAndSearchQuery(@NonNull Jwt jwt, @NonNull String query);

    /**
     * Gets a certain Task of a household by its uuid and the households jwt
     *
     * @param uuid {@link UUID} of the task
     * @param jwt  {@link Jwt} of the household
     * @return {@link Task} as {@link TaskModel}
     */
    TaskModel getTaskByUuidAndJwt(@NonNull UUID uuid, @NonNull Jwt jwt);

    /**
     * Updates a Task by its uuid, jwt and a updateTask payload
     *
     * @param updateTask Update-Payload as {@link TaskModel}
     * @param uuid       {@link UUID} of the Task to update
     * @param jwt        {@link Jwt} of the Task
     * @param safe       Flag that is executing an update for unprivileged users if toggled
     * @return Updated Task as {@link TaskModel}
     */
    TaskModel updateTaskByUuidAndJwt(@NonNull TaskModel updateTask, @NonNull UUID uuid, @NonNull Jwt jwt, boolean safe);

    /**
     * Deletes a Task by its uuid and jwt
     *
     * @param taskId {@link UUID} of the Task to update
     * @param jwt    {@link Jwt} of the Household
     */
    void deleteTaskByIdAndJwt(UUID taskId, Jwt jwt);

    /**
     * Builds a Model from a Task-Entity and injects the services TaskMapper
     *
     * @param entity {@link Task}-Entity to build from
     * @return Built {@link TaskModel} containing the task entity
     */
    TaskModel buildModelFromTaskEntity(Task entity);

    /**
     * Builds a Model from a TaskRequestDto and injects the services TaskMapper
     *
     * @param dto {@link TaskRequestDto}-Entity to build from
     * @return Built {@link TaskModel} entity containing the dto payload
     */
    TaskModel buildModelFromTaskRequestDto(TaskRequestDto dto);
}
