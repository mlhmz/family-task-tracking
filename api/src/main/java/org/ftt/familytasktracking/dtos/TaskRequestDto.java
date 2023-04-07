package org.ftt.familytasktracking.dtos;

import jakarta.validation.constraints.NotEmpty;

public record TaskRequestDto(
        @NotEmpty
        String name,
        String description,
        boolean done,
        String assigneeUuid
) {
}
