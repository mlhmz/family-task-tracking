package org.ftt.familytasktracking.services;

import com.querydsl.core.types.dsl.BooleanExpression;
import lombok.NonNull;
import org.ftt.familytasktracking.dtos.RewardRequestDto;
import org.ftt.familytasktracking.dtos.RewardResponseDto;
import org.ftt.familytasktracking.entities.Household;
import org.ftt.familytasktracking.entities.QReward;
import org.ftt.familytasktracking.entities.Reward;
import org.ftt.familytasktracking.exceptions.WebRtException;
import org.ftt.familytasktracking.mappers.RewardMapper;
import org.ftt.familytasktracking.models.RewardModel;
import org.ftt.familytasktracking.predicate.PredicatesBuilder;
import org.ftt.familytasktracking.repositories.RewardRepository;
import org.ftt.familytasktracking.search.SearchQuery;
import org.ftt.familytasktracking.utils.SearchQueryUtils;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.StreamSupport;

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
    public List<RewardModel> getAllRewardsByJwtAndSearchQuery(@NonNull Jwt jwt, @NonNull String query) {
        Household household = this.householdService.getHouseholdByJwt(jwt);
        PredicatesBuilder<Reward> predicatesBuilder = new PredicatesBuilder<>(Reward.class);

        List<SearchQuery> searchQueries = SearchQueryUtils.parseSearchQueries(query);

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
    public List<RewardModel> getAllRewardsByJwt(Jwt jwt) {
        Household household = this.householdService.getHouseholdByJwt(jwt);
        return this.rewardRepository.findAllByHousehold(household).stream()
                .map(this::buildModelFromRewardEntity)
                .toList();
    }

    @Override
    public RewardModel updateRewardByUuidAndJwt(@NonNull RewardModel updateRewardModel, @NonNull UUID uuid, @NonNull Jwt jwt) {
        Reward updateReward = updateRewardModel.toEntity();
        Reward targetReward = this.getRewardByUuidAndJwt(uuid, jwt).toEntity();
        this.rewardMapper.updateReward(updateReward, targetReward);
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
}
