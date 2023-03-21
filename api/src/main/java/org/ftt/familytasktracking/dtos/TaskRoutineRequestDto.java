package org.ftt.familytasktracking.dtos;

import org.ftt.familytasktracking.enums.IntervalType;

public record TaskRoutineRequestDto(
    String name,
    String description,
    Integer interval,
    IntervalType intervalType,
    Boolean activated
) {}
