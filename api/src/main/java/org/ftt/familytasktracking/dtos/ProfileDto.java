package org.ftt.familytasktracking.dtos;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ProfileDto {
    private String uuid;

    private String name;

    private int points;

    private String permissionType;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private UUID householdUuid;
}
