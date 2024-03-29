package org.ftt.familytasktracking.dtos;

import java.time.LocalDateTime;
import java.util.UUID;

public record RewardResponseDto(
        UUID uuid,
        Integer cost,
        String name,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        LocalDateTime redeemedAt,
        UUID redeemedBy,
        Boolean redeemed,
        String description
) {
}
