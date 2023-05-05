package org.ftt.familytasktracking.tasks.scheduler;

import org.ftt.familytasktracking.entities.Task;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

public class MilliIntervalTaskScheduler implements TaskScheduler {
    @Override
    public LocalDateTime getNextExecution(Task task) {
        if (task.getIntervalMillis() != null) {
            LocalDateTime lastTaskCreationAt = task.getLastTaskCreationAt();
            return lastTaskCreationAt.plus(task.getIntervalMillis(), ChronoUnit.MILLIS);
        } else {
            return null;
        }
    }
}
