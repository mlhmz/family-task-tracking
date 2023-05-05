package org.ftt.familytasktracking.tasks.scheduler;

import org.ftt.familytasktracking.entities.Task;

import java.time.LocalDateTime;

/**
 * Interface for Task Rescheduling Logic
 * <br>
 * The implementation is injected by the {@link org.springframework.stereotype.Component} annotation
 */
public interface TaskScheduler {
    LocalDateTime getNextExecutionFromLastOne(Task task);

    LocalDateTime getNextExecutionFromNow(Task task);
}
