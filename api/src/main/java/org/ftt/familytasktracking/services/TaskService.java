package org.ftt.familytasktracking.services;

import org.ftt.familytasktracking.dtos.TaskRequestDto;
import org.ftt.familytasktracking.dtos.TaskResponseDto;

public interface TaskService {
    /**
     * Creates a new task
     *
     * @param dto {@link TaskRequestDto}
     * @return {@link TaskResponseDto}
     */
    TaskResponseDto createTask(TaskRequestDto dto);
}
