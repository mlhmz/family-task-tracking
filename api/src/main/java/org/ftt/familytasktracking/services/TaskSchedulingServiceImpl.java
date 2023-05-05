package org.ftt.familytasktracking.services;

import io.micrometer.common.util.StringUtils;
import org.ftt.familytasktracking.entities.Household;
import org.ftt.familytasktracking.entities.Task;
import org.ftt.familytasktracking.enums.TaskState;
import org.ftt.familytasktracking.repositories.TaskRepository;
import org.ftt.familytasktracking.utils.CronFormattingUtils;
import org.springframework.scheduling.support.CronExpression;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskSchedulingServiceImpl implements TaskSchedulingService {
    private static final TaskState DONE_TASK_STATE = TaskState.FINISHED;
    private final TaskRepository taskRepository;

    public TaskSchedulingServiceImpl(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public void updateAllTaskSchedulingParametersByHousehold(Household household) {
        List<Task> tasks = this.taskRepository.findAllByHouseholdAndTaskState(household, DONE_TASK_STATE);
        tasks.forEach(this::updateTasksSchedulingParameters);
        this.taskRepository.saveAll(tasks);
    }

    @Override
    public void updateTasksSchedulingParameters(Task task) {
        String formattedExp = getFormattedCronExpressionString(task.getCronExpression());
        if (!isTaskScheduledAndExpValid(task, formattedExp)) {
            return;
        }
        CronExpression cronExpression = CronExpression.parse(formattedExp);
        LocalDateTime nextExecution = cronExpression.next(getLastTaskCreation(task));
        if (LocalDateTime.now().isAfter(nextExecution)) {
            updateTaskSchedulingParametersByCronExpression(task, cronExpression);
            resetTaskState(task);
        }
    }

    private static LocalDateTime getLastTaskCreation(Task task) {
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

    private void resetTaskState(Task task) {
        task.setTaskState(TaskState.UNDONE);
        task.setDoneAt(null);
    }
}
