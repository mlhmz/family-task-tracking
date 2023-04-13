package org.ftt.familytasktracking.repositories;

import org.ftt.familytasktracking.entities.Household;
import com.querydsl.core.types.dsl.StringExpression;
import com.querydsl.core.types.dsl.StringPath;
import org.ftt.familytasktracking.entities.Household;
import org.ftt.familytasktracking.entities.QTask;
import org.ftt.familytasktracking.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.querydsl.binding.QuerydslBinderCustomizer;
import org.springframework.data.querydsl.binding.QuerydslBindings;
import org.springframework.data.querydsl.binding.SingleValueBinding;

import java.util.List;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID>,
        QuerydslPredicateExecutor<Task>, QuerydslBinderCustomizer<QTask> {
    @Override
    default void customize(QuerydslBindings bindings, QTask root) {
        bindings.bind(String.class)
                .first((SingleValueBinding<StringPath, String>) StringExpression::containsIgnoreCase);
    }

    List<Task> findAllByHousehold(Household household);

    Task findTaskByHouseholdAndUuid(Household household, UUID uuid);
    
    void deleteTaskByUuidAndHousehold(UUID uuid, Household household);

    boolean existsTaskByUuidAndHousehold(UUID uuid, Household household);
}
