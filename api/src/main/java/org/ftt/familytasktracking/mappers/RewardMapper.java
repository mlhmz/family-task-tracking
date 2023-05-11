package org.ftt.familytasktracking.mappers;

import org.ftt.familytasktracking.dtos.RewardRequestDto;
import org.ftt.familytasktracking.dtos.RewardResponseDto;
import org.ftt.familytasktracking.entities.Reward;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

/**
 * Mapper for the {@link Reward} and {@link RewardResponseDto} Object
 */
@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface RewardMapper {

    RewardResponseDto mapRewardToRewardDto(Reward reward);

    Reward mapRewardDtoToReward(RewardRequestDto rewardRequestDto);

    void updateReward(Reward updateReward, @MappingTarget Reward targetReward);
}
