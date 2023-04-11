package org.ftt.familytasktracking.repositories;

import org.ftt.familytasktracking.entities.Household;
import org.ftt.familytasktracking.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {
    List<Task> findAllByHousehold(Household household);

    Task findTaskByHouseholdAndUuid(Household household, UUID uuid);

}
