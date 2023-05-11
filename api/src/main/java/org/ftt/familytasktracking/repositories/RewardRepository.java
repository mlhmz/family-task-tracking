package org.ftt.familytasktracking.repositories;

import org.ftt.familytasktracking.entities.Household;
import org.ftt.familytasktracking.entities.Reward;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RewardRepository extends JpaRepository<Reward, UUID> {
    List<Reward> findAllByHousehold(Household household);

    Reward findRewardByHouseholdAndUuid(Household household, UUID uuid);

    void deleteRewardByUuidAndHousehold(UUID uuid, Household household);

    boolean existsRewardByUuidAndHousehold(UUID uuid, Household household);
}

