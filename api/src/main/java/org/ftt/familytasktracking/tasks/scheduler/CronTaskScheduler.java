package org.ftt.familytasktracking.tasks.scheduler;

import io.micrometer.common.util.StringUtils;
import org.ftt.familytasktracking.entities.Task;
import org.ftt.familytasktracking.utils.CronFormattingUtils;
import org.springframework.scheduling.support.CronExpression;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class CronTaskScheduler implements TaskScheduler {
    @Override
    public boolean rescheduleOnExpiration(Task task) {
        boolean rescheduled = true;
        String formattedExp = getFormattedCronExpressionString(task.getCronExpression());
        if (!isTaskScheduledAndExpValid(task, formattedExp)) {
            rescheduled = false;
        }
        CronExpression cronExpression = CronExpression.parse(formattedExp);
        LocalDateTime nextExecution = cronExpression.next(getLastTaskCreation(task));
        if (LocalDateTime.now().isAfter(nextExecution)) {
            updateTaskSchedulingParametersByCronExpression(task, cronExpression);
        } else {
            rescheduled = false;
        }
        return rescheduled;
    }

    private LocalDateTime getLastTaskCreation(Task task) {
        LocalDateTime lastTaskCreationAt = task.getLastTaskCreationAt();
        if (lastTaskCreationAt == null) {
            return task.getCreatedAt();
        } else {
            return lastTaskCreationAt;
        }
    }

    private String getFormattedCronExpressionString(String cronExpression) {
        return CronFormattingUtils.format(cronExpression);
    }

    private boolean isTaskScheduledAndExpValid(Task task, String cronExpression) {
        return Boolean.TRUE.equals(task.getScheduled()) &&
                StringUtils.isNotEmpty(task.getCronExpression()) &&
                CronExpression.isValidExpression(cronExpression);
    }

    private void updateTaskSchedulingParametersByCronExpression(Task task, CronExpression cronExpression) {
        task.setLastTaskCreationAt(LocalDateTime.now());
        task.setNextTaskCreationAt(cronExpression.next(LocalDateTime.now()));
    }
}
