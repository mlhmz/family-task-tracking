package org.ftt.familytasktracking.services;

import com.querydsl.core.types.dsl.BooleanExpression;
import jakarta.transaction.Transactional;
import lombok.NonNull;
import org.ftt.familytasktracking.dtos.RewardRequestDto;
import org.ftt.familytasktracking.dtos.RewardResponseDto;
import org.ftt.familytasktracking.entities.Household;
import org.ftt.familytasktracking.entities.Profile;
import org.ftt.familytasktracking.entities.QReward;
import org.ftt.familytasktracking.entities.Reward;
import org.ftt.familytasktracking.exceptions.WebRtException;
import org.ftt.familytasktracking.mappers.RewardMapper;
import org.ftt.familytasktracking.models.RewardModel;
import org.ftt.familytasktracking.predicate.PredicatesBuilder;
import org.ftt.familytasktracking.repositories.ProfileRepository;
import org.ftt.familytasktracking.repositories.RewardRepository;
import org.ftt.familytasktracking.search.SearchQuery;
import org.ftt.familytasktracking.utils.SearchQueryUtils;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.StreamSupport;

@Service
public class RewardServiceImpl implements RewardService {
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
    }

    @Override
    public RewardResponseDto createReward(RewardRequestDto dto, Jwt jwt) {
        Reward reward = rewardMapper.mapRewardDtoToReward(dto);
        reward.setHousehold(this.householdService.getHouseholdByJwt(jwt));
        return rewardMapper.mapRewardToRewardDto(rewardRepository.save(reward));
    }

    @Override
    public List<RewardModel> getAllRewardsByJwtAndSearchQuery(@NonNull Jwt jwt, @NonNull String query) {
        Household household = this.householdService.getHouseholdByJwt(jwt);
        PredicatesBuilder<Reward> predicatesBuilder = new PredicatesBuilder<>(Reward.class);

        List<SearchQuery> searchQueries = SearchQueryUtils.parseSearchQueries(query, Reward.class);

        searchQueries.forEach(predicatesBuilder::with);

        BooleanExpression exp = predicatesBuilder.build();
        QReward reward = QReward.reward;
        Iterable<Reward> rewards;
        try {
            rewards = this.rewardRepository.findAll(reward.household.eq(household).and(exp));
        } catch (Exception exception) {
            throw new WebRtException(HttpStatus.BAD_REQUEST, "Query Error: " + exception.getMessage());
        }
        return StreamSupport.stream(rewards.spliterator(), false)
                .map(this::buildModelFromRewardEntity)
                .toList();
    }

    @Override
    public RewardModel getRewardByJwtAndUuid(@NonNull Jwt jwt, @NonNull UUID uuid) {
        Household household = this.householdService.getHouseholdByJwt(jwt);
        return buildModelFromRewardEntity(this.rewardRepository.findRewardByHouseholdAndUuid(household, uuid));
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
        if (!safe) {
            // Privileged User am Werk, sprich updateReward ohne weitere Logik
            this.rewardMapper.updateReward(updateReward, targetReward);
        } else if (Boolean.TRUE.equals(updateReward.getRedeemed())) {
            // Unprivileged User am Werk, führe Redeem Reward aus
            this.redeemReward(targetReward, profile);
        }
        return buildModelFromRewardEntity(
                this.rewardRepository.save(targetReward)
        );
    }

    @Override
    @Transactional
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


    private void redeemReward(Reward targetReward, Profile profile) {
        if (Boolean.TRUE.equals(targetReward.getRedeemed())) {
            throw new WebRtException(HttpStatus.FORBIDDEN, "The reward was already redeemed");
        }
        if (profile.getPoints() >= targetReward.getCost()) {
            profile.setPoints(profile.getPoints() - targetReward.getCost());
            this.profileRepository.save(profile);
            targetReward.setRedeemed(true);
            targetReward.setRedeemedBy(profile);
            targetReward.setRedeemedAt(LocalDateTime.now());
        } else {
            throw new WebRtException(HttpStatus.FORBIDDEN,
                    String.format("The profile '%s' has not enough points for '%s'.", profile.getName(), targetReward.getName()));
        }
    }

}
