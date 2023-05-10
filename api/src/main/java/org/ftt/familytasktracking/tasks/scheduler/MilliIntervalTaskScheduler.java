package org.ftt.familytasktracking.tasks.scheduler;

import org.ftt.familytasktracking.entities.Task;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

public class MilliIntervalTaskScheduler implements TaskScheduler {
    @Override
    public LocalDateTime getNextExecutionFromLastExecutionDate(Task task) {
        return getNextExecutionFromDate(task, task.getLastTaskCreationAt());
    }

    @Override
    public LocalDateTime getNextExecutionFromCurrentDate(Task task) {
        return getNextExecutionFromDate(task, LocalDateTime.now());
    }

    private LocalDateTime getNextExecutionFromDate(Task task, LocalDateTime dateTime) {
        if (task.getIntervalMillis() != null) {
            return dateTime.plus(task.getIntervalMillis(), ChronoUnit.MILLIS);
        } else {
            return null;
        }
    }
}
