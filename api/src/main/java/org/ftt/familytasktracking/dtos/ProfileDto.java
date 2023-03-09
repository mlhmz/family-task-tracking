package org.ftt.familytasktracking.dtos;

import java.time.LocalDateTime;
import java.util.UUID;

public record ProfileDto (
    String uuid,
    String name,
    Integer points,
    String permissionType,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    UUID householdUuid
) {}
