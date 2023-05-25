package org.ftt.familytasktracking.dtos;

import jakarta.validation.constraints.NotEmpty;
import org.ftt.familytasktracking.enums.TaskState;

public record TaskRequestDto(
        @NotEmpty
        String name,
        String description,
        Integer points,
        TaskState taskState,
        Boolean scheduled,
        String cronExpression,
        Long intervalMillis,
        String assigneeUuid
) {
}
