package org.ftt.familytasktracking.services;

import org.ftt.familytasktracking.dtos.TaskRequestDto;
import org.ftt.familytasktracking.dtos.TaskResponseDto;
import org.springframework.security.oauth2.jwt.Jwt;

public interface TaskService {
    /**
     * Creates a new task
     *
     * @param dto {@link TaskRequestDto}
     * @return {@link TaskResponseDto}
     */
    TaskResponseDto createTask(TaskRequestDto dto, Jwt jwt);
}
