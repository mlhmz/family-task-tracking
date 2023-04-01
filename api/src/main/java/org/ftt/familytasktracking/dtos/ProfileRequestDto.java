package org.ftt.familytasktracking.dtos;

import org.ftt.familytasktracking.enums.PermissionType;

import java.util.Objects;

public record ProfileRequestDto(
        String name,
        Integer points,
        PermissionType permissionType
) {
    public ProfileRequestDto(String name, Integer points, PermissionType permissionType) {
        this.name = name;
        this.points = points;
        this.permissionType = Objects.requireNonNullElse(permissionType, PermissionType.MEMBER);
    }
}
