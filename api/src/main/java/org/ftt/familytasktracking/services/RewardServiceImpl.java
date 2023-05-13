package org.ftt.familytasktracking.services;

import lombok.NonNull;
import org.ftt.familytasktracking.dtos.RewardRequestDto;
import org.ftt.familytasktracking.dtos.RewardResponseDto;
import org.ftt.familytasktracking.entities.Household;
import org.ftt.familytasktracking.entities.Profile;
import org.ftt.familytasktracking.entities.Reward;
import org.ftt.familytasktracking.exceptions.WebRtException;
import org.ftt.familytasktracking.hooks.RewardRedeemedHook;
import org.ftt.familytasktracking.hooks.RewardUpdateHook;
import org.ftt.familytasktracking.mappers.RewardMapper;
import org.ftt.familytasktracking.models.RewardModel;
import org.ftt.familytasktracking.repositories.ProfileRepository;
import org.ftt.familytasktracking.repositories.RewardRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class RewardServiceImpl implements RewardService {
    private final List<RewardUpdateHook> rewardUpdateHooks = new ArrayList<>();
    private final RewardMapper rewardMapper;
    private final RewardRepository rewardRepository;
    private final HouseholdService householdService;
    private final ProfileAuthService profileAuthService;
    private final ProfileRepository profileRepository;

    public RewardServiceImpl(RewardMapper rewardMapper, RewardRepository rewardRepository,
                             HouseholdService householdService, ProfileAuthService profileAuthService,
                             ProfileRepository profileRepository) {
        this.rewardMapper = rewardMapper;
        this.rewardRepository = rewardRepository;
        this.householdService = householdService;
        this.profileAuthService = profileAuthService;
        this.profileRepository = profileRepository;
        addUpdateHooksToArrayList();
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
                                                @NonNull Jwt jwt, UUID sessionId, boolean safe) {
        Reward updateReward = updateRewardModel.toEntity();
        Reward targetReward = this.getRewardByUuidAndJwt(uuid, jwt).toEntity();
        Profile profile = this.profileAuthService.getProfileBySession(sessionId, jwt).toEntity();
        updateTargetReward(updateReward, targetReward, safe);
        executeUpdateHooks(targetReward, profile, safe);
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
        return new RewardModel(dto, rewardMapper);
    }

    private void updateTargetReward(@NonNull Reward updateReward, @NonNull Reward targetReward, boolean safe) {
        if (safe) {
            this.rewardMapper.safeUpdateReward(updateReward, targetReward);
        } else {
            this.rewardMapper.updateReward(updateReward, targetReward);
        }
    }

    private void executeUpdateHooks(Reward targetReward, Profile profile, Boolean safe) {
        for (RewardUpdateHook rewardUpdateHook : rewardUpdateHooks) {
            rewardUpdateHook.executeUpdateHook(targetReward, profile, safe, this.profileRepository);
        }
    }
    private void addUpdateHooksToArrayList() {
        rewardUpdateHooks.add(new RewardRedeemedHook());
    }
}
