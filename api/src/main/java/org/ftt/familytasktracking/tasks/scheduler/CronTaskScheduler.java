package org.ftt.familytasktracking.tasks.scheduler;

import io.micrometer.common.util.StringUtils;
import org.ftt.familytasktracking.entities.Task;
import org.ftt.familytasktracking.utils.CronFormattingUtils;
import org.springframework.scheduling.support.CronExpression;

import java.time.LocalDateTime;

public class CronTaskScheduler implements TaskScheduler {
    @Override
    public LocalDateTime getNextExecution(Task task) {
        String formattedExp = getFormattedCronExpressionString(task.getCronExpression());
        if (!isTaskScheduledAndExpValid(task, formattedExp)) {
            return null;
        }
        return CronExpression.parse(formattedExp).next(task.getLastTaskCreationAt());
    }

    private String getFormattedCronExpressionString(String cronExpression) {
        return CronFormattingUtils.format(cronExpression);
    }

    private boolean isTaskScheduledAndExpValid(Task task, String cronExpression) {
        return StringUtils.isNotEmpty(task.getCronExpression()) && CronExpression.isValidExpression(cronExpression);
    }
}
