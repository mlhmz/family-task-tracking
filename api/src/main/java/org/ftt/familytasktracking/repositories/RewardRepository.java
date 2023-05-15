package org.ftt.familytasktracking.repositories;

import com.querydsl.core.types.dsl.StringExpression;
import com.querydsl.core.types.dsl.StringPath;
import lombok.NonNull;
import org.ftt.familytasktracking.entities.Household;
import org.ftt.familytasktracking.entities.QReward;
import org.ftt.familytasktracking.entities.Reward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.querydsl.binding.QuerydslBinderCustomizer;
import org.springframework.data.querydsl.binding.QuerydslBindings;
import org.springframework.data.querydsl.binding.SingleValueBinding;

import java.util.List;
import java.util.UUID;

public interface RewardRepository extends JpaRepository<Reward, UUID>,
        QuerydslPredicateExecutor<Reward>, QuerydslBinderCustomizer<QReward> {
    @Override
    default void customize(QuerydslBindings bindings, @NonNull QReward root) {
        bindings.bind(String.class)
                .first((SingleValueBinding<StringPath, String>) StringExpression::containsIgnoreCase);
    }


    List<Reward> findAllByHousehold(Household household);

    Reward findRewardByHouseholdAndUuid(Household household, UUID uuid);

    void deleteRewardByUuidAndHousehold(UUID uuid, Household household);

    boolean existsRewardByUuidAndHousehold(UUID uuid, Household household);
}

