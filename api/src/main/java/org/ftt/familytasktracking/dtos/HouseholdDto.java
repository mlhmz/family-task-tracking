package org.ftt.familytasktracking.dtos;

import lombok.Data;

import java.time.LocalDateTime;

public record HouseholdDto (
    String uuid,
    String householdName,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
