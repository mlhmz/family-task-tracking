package org.ftt.familytasktracking.dtos;

import org.ftt.familytasktracking.enums.TaskState;

import java.time.LocalDateTime;

public record TaskResponseDto(
    String uuid,
    String name,
    String description,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    LocalDateTime expirationAt,
    LocalDateTime doneAt,
    TaskState taskState,
    String assigneeUuid
) {}
