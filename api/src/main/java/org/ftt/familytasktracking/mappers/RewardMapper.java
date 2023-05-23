package org.ftt.familytasktracking.mappers;

import org.ftt.familytasktracking.dtos.RewardRequestDto;
import org.ftt.familytasktracking.dtos.RewardResponseDto;
import org.ftt.familytasktracking.entities.Reward;
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

    RewardResponseDto mapRewardToRewardDto(Reward reward);

    Reward mapRewardDtoToReward(RewardRequestDto rewardRequestDto);

    @Mapping(target = "household", ignore = true)
    void updateReward(Reward updateReward, @MappingTarget Reward targetReward);

}