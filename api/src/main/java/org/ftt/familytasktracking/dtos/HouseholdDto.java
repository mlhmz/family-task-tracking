package org.ftt.familytasktracking.dtos;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class HouseholdDto {
    private String uuid;

    private String householdName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
