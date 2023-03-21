package org.ftt.familytasktracking.dtos;

import java.time.LocalDateTime;

public record TaskResponseDto(
    String uuid,
    String name,
    String description,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    LocalDateTime expirationAt,
    LocalDateTime doneAt,
    boolean done,
    String assigneeUuid
) {}