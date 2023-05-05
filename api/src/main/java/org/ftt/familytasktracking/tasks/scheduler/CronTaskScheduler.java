package org.ftt.familytasktracking.tasks.scheduler;

import io.micrometer.common.util.StringUtils;
import org.ftt.familytasktracking.entities.Task;
import org.springframework.scheduling.support.CronExpression;

import java.time.LocalDateTime;

public class CronTaskScheduler implements TaskScheduler {
    @Override
    public LocalDateTime getNextExecution(Task task) {
        String expression = task.getCronExpression();
        if (isTaskScheduledAndExpValid(task, expression)) {
            return CronExpression.parse(expression).next(task.getLastTaskCreationAt());
        } else {
            return null;
        }
    }

    private boolean isTaskScheduledAndExpValid(Task task, String cronExpression) {
        return StringUtils.isNotEmpty(task.getCronExpression()) && CronExpression.isValidExpression(cronExpression);
    }
}
