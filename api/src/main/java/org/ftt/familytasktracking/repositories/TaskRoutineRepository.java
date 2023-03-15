package org.ftt.familytasktracking.repositories;

import org.ftt.familytasktracking.entities.TaskRoutine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TaskRoutineRepository extends JpaRepository<TaskRoutine, UUID> {
}
