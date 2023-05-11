package org.ftt.familytasktracking.services;

import lombok.NonNull;
import org.ftt.familytasktracking.dtos.RewardRequestDto;
import org.ftt.familytasktracking.dtos.RewardResponseDto;
import org.ftt.familytasktracking.entities.Household;
import org.ftt.familytasktracking.entities.Reward;
import org.ftt.familytasktracking.exceptions.WebRtException;
import org.ftt.familytasktracking.mappers.RewardMapper;
import org.ftt.familytasktracking.models.RewardModel;
import org.ftt.familytasktracking.repositories.RewardRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class RewardServiceImpl implements RewardService {

    private final RewardMapper rewardMapper;
    private final RewardRepository rewardRepository;
    private final HouseholdService householdService;

    public RewardServiceImpl(RewardMapper rewardMapper, RewardRepository rewardRepository, HouseholdService householdService) {
        this.rewardMapper = rewardMapper;
        this.rewardRepository = rewardRepository;
        this.householdService = householdService;
    }

    @Override
    public RewardResponseDto createReward(RewardRequestDto dto, Jwt jwt) {
        Reward reward = rewardMapper.mapRewardDtoToReward(dto);
        reward.setHousehold(this.householdService.getHouseholdByJwt(jwt));
        return rewardMapper.mapRewardToRewardDto(rewardRepository.save(reward));
    }

    @Override
    public List<RewardModel> getAllRewardsByJwt(Jwt jwt) {
        Household household = this.householdService.getHouseholdByJwt(jwt);
        return this.rewardRepository.findAllByHousehold(household).stream()
                .map(this::buildModelFromRewardEntity)
                .toList();
    }

    @Override
    public RewardModel updateRewardByUuidAndJwt(@NonNull RewardModel updateRewardModel, @NonNull UUID uuid,
                                                @NonNull Jwt jwt, boolean safe) {
        Reward updateReward = updateRewardModel.toEntity();
        Reward targetReward = this.getRewardByUuidAndJwt(uuid, jwt).toEntity();
        updateTargetReward(updateReward, targetReward, safe);
/**
 * TODO: updateReward Hooks einbauen,
 **/
        return buildModelFromRewardEntity(
                this.rewardRepository.save(targetReward)
        );
    }

    @Override
    public void deleteRewardByIdAndJwt(UUID rewardId, Jwt jwt) {
        Household household = this.householdService.getHouseholdByJwt(jwt);
        if (!rewardRepository.existsRewardByUuidAndHousehold(rewardId, household)) {
            throw new WebRtException(HttpStatus.NOT_FOUND, "Reward was not found");
        }
        rewardRepository.deleteRewardByUuidAndHousehold(rewardId, household);
    }

    @Override
    public RewardModel getRewardByUuidAndJwt(@NonNull UUID uuid, @NonNull Jwt jwt) {
        Household household = this.householdService.getHouseholdByJwt(jwt);
        Reward reward = this.rewardRepository.findRewardByHouseholdAndUuid(household, uuid);
        if (reward == null) {
            throw new WebRtException(HttpStatus.NOT_FOUND,
                    String.format("The reward with the uuid '%s' was not found.", uuid));
        }
        return buildModelFromRewardEntity(reward);
    }

    @Override
    public RewardModel buildModelFromRewardEntity(Reward entity) {
        return new RewardModel(entity, rewardMapper);
    }

    @Override
    public RewardModel buildModelFromRewardRequestDto(RewardRequestDto dto) {
        return null;
    }

    private void updateTargetReward(@NonNull Reward updateReward, @NonNull Reward targetReward, boolean safe) {
        if (safe) {
            this.rewardMapper.safeUpdateReward(updateReward, targetReward);
        } else {
            this.rewardMapper.updateReward(updateReward, targetReward);
        }
    }
}
