package org.ftt.familytasktracking.services;

import org.ftt.familytasktracking.entities.Household;
import org.ftt.familytasktracking.entities.Task;

public interface TaskSchedulingService {
    void updateAllTaskSchedulingsByHousehold(Household household);

    void updateTasksScheduling(Task task);
}
