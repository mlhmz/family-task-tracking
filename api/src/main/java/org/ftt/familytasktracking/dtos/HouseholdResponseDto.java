package org.ftt.familytasktracking.dtos;

import java.time.LocalDateTime;

public record HouseholdResponseDto(
    String uuid,
    String householdName,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
