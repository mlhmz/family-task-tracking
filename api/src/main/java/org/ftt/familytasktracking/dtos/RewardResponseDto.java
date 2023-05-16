package org.ftt.familytasktracking.dtos;

import java.util.UUID;

public record RewardResponseDto(
        UUID uuid,
        Integer cost,
        String name,
        String description
) {
}
