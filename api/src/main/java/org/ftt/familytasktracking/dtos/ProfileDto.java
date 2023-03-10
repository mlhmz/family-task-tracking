package org.ftt.familytasktracking.dtos;

import org.ftt.familytasktracking.enums.PermissionType;

import java.time.LocalDateTime;

public record ProfileDto (
    String uuid,
    String name,
    Integer points,
    PermissionType permissionType,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    String householdUuid
) {}
