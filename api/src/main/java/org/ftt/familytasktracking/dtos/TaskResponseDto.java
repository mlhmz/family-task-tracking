package org.ftt.familytasktracking.dtos;

import org.ftt.familytasktracking.enums.TaskState;

import java.time.LocalDateTime;

public record TaskResponseDto(
        String uuid,
        String name,
        String description,
        Integer points,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        LocalDateTime expirationAt,
        LocalDateTime doneAt,
        Boolean scheduled,
        String cronExpression,
        LocalDateTime nextTaskCreationAt,
        TaskState taskState,
        String assigneeUuid
) {
}
