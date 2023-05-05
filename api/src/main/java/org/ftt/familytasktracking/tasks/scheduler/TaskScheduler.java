package org.ftt.familytasktracking.tasks.scheduler;

import org.ftt.familytasktracking.entities.Task;

/**
 * Interface for Task Rescheduling Logic
 * <br>
 * The implementation is injected by the {@link org.springframework.stereotype.Component} annotation
 */
public interface TaskScheduler {
    boolean rescheduleOnExpiration(Task task);
}
