package org.ftt.familytasktracking.dtos;

import java.time.LocalDateTime;

public record TaskRoutineDto (
    String uuid,
    String name,
    String description,
    String interval,
    String intervalType,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    LocalDateTime lastTaskCreationAt,
    Boolean activated,
    String householdUuid
) {}
