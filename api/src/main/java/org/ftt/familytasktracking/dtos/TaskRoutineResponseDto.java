package org.ftt.familytasktracking.dtos;

import org.ftt.familytasktracking.enums.IntervalType;

import java.time.LocalDateTime;

public record TaskRoutineResponseDto(
    String uuid,
    String name,
    String description,
    Integer interval,
    IntervalType intervalType,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    LocalDateTime lastTaskCreationAt,
    Boolean activated
) {}
