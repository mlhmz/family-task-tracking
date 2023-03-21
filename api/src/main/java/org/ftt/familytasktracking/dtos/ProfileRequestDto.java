package org.ftt.familytasktracking.dtos;

import org.ftt.familytasktracking.enums.PermissionType;

public record ProfileRequestDto(
    String name,
    Integer points,
    PermissionType permissionType
) {}
