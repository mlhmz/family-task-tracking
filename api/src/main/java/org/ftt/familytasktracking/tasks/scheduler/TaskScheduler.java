package org.ftt.familytasktracking.tasks.scheduler;

import org.ftt.familytasktracking.entities.Task;

import java.time.LocalDateTime;

/**
 * Interface for Task Rescheduling Logic
 * <br>
 * The implementation is injected by the {@link org.springframework.stereotype.Component} annotation
 */
public interface TaskScheduler {
    /**
     * Gets a next execution date from the last execution date
     *
     * @param task {@link Task} which should the next execution be calculated from
     * @return {@link LocalDateTime} with the next execution
     */
    LocalDateTime getNextExecutionFromLastExecutionDate(Task task);

    /**
     * Gets the Next Execution Date from the Current Date
     *
     * @param task {@link Task} that the Next Execution Date from the Current Date should be generated from
     * @return {@link LocalDateTime} with the next execution
     */
    LocalDateTime getNextExecutionFromCurrentDate(Task task);
}
