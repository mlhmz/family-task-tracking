package org.ftt.familytasktracking.services;

import lombok.NonNull;
import org.ftt.familytasktracking.dtos.RewardRequestDto;
import org.ftt.familytasktracking.dtos.RewardResponseDto;
import org.ftt.familytasktracking.entities.Reward;
import org.ftt.familytasktracking.models.RewardModel;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;
import java.util.UUID;

public interface RewardService {
    /**
     * Creates a new reward
     *
     * @param dto {@link RewardRequestDto}
     * @return {@link RewardResponseDto}
     */
    RewardResponseDto createReward(RewardRequestDto dto, Jwt jwt);

    /**
     * Gets all Rewards of a household by its jwt
     *
     * @param jwt {@link Jwt} of the household
     * @return {@link List} of {@link RewardModel}
     */
    List<RewardModel> getAllRewardsByJwt(Jwt jwt);

    /**
     * Updates a Task by its uuid, jwt and a updateTask payload
     *
     * @param updateReward Update-Payload as {@link RewardModel}
     * @param uuid         {@link UUID} of the Task to update
     * @param jwt          {@link Jwt} of the Task
     * @return Updated Task as {@link RewardModel}
     */
    RewardModel updateRewardByUuidAndJwt(@NonNull RewardModel updateReward, @NonNull UUID uuid,
                                         @NonNull Jwt jwt, UUID sessionId, boolean safe);


    /**
     * Deletes a Reward by its uuid and jwt
     *
     * @param rewardId {@link UUID} of the Reward to delete
     * @param jwt      {@link Jwt} of the Household
     */
    void deleteRewardByIdAndJwt(UUID rewardId, Jwt jwt);

    /**
     * Gets a certain Reward of a household by its uuid and the households jwt
     *
     * @param uuid {@link UUID} of the reward
     * @param jwt  {@link Jwt} of the household
     * @return {@link Reward} as {@link RewardModel}
     */
    RewardModel getRewardByUuidAndJwt(@NonNull UUID uuid, @NonNull Jwt jwt);

    /**
     * Builds a Model from a Task-Entity and injects the services TaskMapper
     *
     * @param entity {@link Reward}-Entity to build from
     * @return Built {@link RewardModel} containing the task entity
     */
    RewardModel buildModelFromRewardEntity(Reward entity);

    /**
     * Builds a Model from a TaskRequestDto and injects the services TaskMapper
     *
     * @param dto {@link RewardRequestDto}-Entity to build from
     * @return Built {@link RewardModel} entity containing the dto payload
     */
    RewardModel buildModelFromRewardRequestDto(RewardRequestDto dto);
}
