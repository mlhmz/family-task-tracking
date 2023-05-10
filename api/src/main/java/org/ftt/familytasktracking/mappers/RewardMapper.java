package org.ftt.familytasktracking.mappers;

import org.ftt.familytasktracking.dtos.RewardRequestDto;
import org.ftt.familytasktracking.dtos.RewardResponseDto;
import org.ftt.familytasktracking.entities.Reward;
import org.mapstruct.Mapper;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.*;

/**
 * Mapper for the {@link Reward} and {@link RewardResponseDto} Object
 */
@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface RewardMapper {
    @Mapping(target = "uuid", source = "reward.uuid")
    RewardResponseDto mapRewardToRewardDto(Reward reward);

    @Mapping(target = "uuid", source = "reward.uuid")
    Reward mapRewardDtoToReward(RewardRequestDto rewardRequestDto);
}
