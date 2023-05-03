package org.ftt.familytasktracking.services;

import org.ftt.familytasktracking.entities.Household;
import org.ftt.familytasktracking.entities.Task;

/**
 * The task scheduling services reschedules and resets task states when they are scheduled.
 */
public interface TaskSchedulingService {
    /**
     * Updates all tasks scheduling parameters when their schedule expire
     *
     * @param household Household that's tasks shall be updated
     */
    void updateAllTaskSchedulingParametersByHousehold(Household household);

    /**
     * Updates a single tasks scheduling parameters
     *
     * @param task Task to update the scheduling parameters of
     */
    void updateTasksSchedulingParameters(Task task);
}
