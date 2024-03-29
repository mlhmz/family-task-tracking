package org.ftt.familytasktracking.tasks.scheduler;

import io.micrometer.common.util.StringUtils;
import org.ftt.familytasktracking.entities.Task;
import org.springframework.scheduling.support.CronExpression;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class CronTaskScheduler implements TaskScheduler {
    @Override
    public LocalDateTime getNextExecutionFromLastExecutionDate(Task task) {
        return getNextExecutionFromDate(task, task.getLastTaskCreationAt());
    }

    @Override
    public LocalDateTime getNextExecutionFromCurrentDate(Task task) {
        return getNextExecutionFromDate(task, LocalDateTime.now());
    }

    private LocalDateTime getNextExecutionFromDate(Task task, LocalDateTime dateTime) {
        String expression = task.getCronExpression();
        if (Boolean.TRUE.equals(task.getScheduled()) && isTaskScheduledAndExpValid(expression)) {
            return CronExpression.parse(expression).next(dateTime);
        } else {
            return null;
        }
    }

    private boolean isTaskScheduledAndExpValid(String cronExpression) {
        return StringUtils.isNotEmpty(cronExpression) && CronExpression.isValidExpression(cronExpression);
    }
}
