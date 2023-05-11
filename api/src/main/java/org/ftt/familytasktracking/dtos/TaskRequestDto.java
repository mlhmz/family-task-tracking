package org.ftt.familytasktracking.dtos;

import jakarta.validation.constraints.NotEmpty;
import org.ftt.familytasktracking.enums.TaskState;
import org.ftt.familytasktracking.tasks.scheduler.SchedulerMode;

public record TaskRequestDto(
        @NotEmpty
        String name,
        String description,
        Integer points,
        TaskState taskState,
        SchedulerMode schedulerMode,
        String cronExpression,
        Long intervalMillis,
        String assigneeUuid
) {
}
