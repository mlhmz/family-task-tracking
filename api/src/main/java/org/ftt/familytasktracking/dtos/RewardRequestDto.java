package org.ftt.familytasktracking.dtos;

public record RewardRequestDto(
        Integer cost,
        String name,
        String description,
        Boolean redeemed
) {
}
