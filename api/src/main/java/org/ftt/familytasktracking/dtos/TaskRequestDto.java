package org.ftt.familytasktracking.dtos;

import jakarta.validation.constraints.NotEmpty;
import org.ftt.familytasktracking.enums.TaskState;

import java.time.LocalDateTime;

public record TaskRequestDto(
        @NotEmpty
        String name,
        String description,
        Integer points,
        TaskState taskState,
        Boolean scheduled,
        String cronExpression,
        LocalDateTime expirationAt,
        String assigneeUuid
) {
}
