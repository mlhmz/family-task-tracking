package org.ftt.familytasktracking.repositories;

import org.ftt.familytasktracking.entities.Household;
import org.ftt.familytasktracking.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {
    void deleteTaskByUuidAndHousehold(UUID uuid, Household household);

    boolean existsTaskByUuidAndHousehold(UUID uuid, Household household);
}
