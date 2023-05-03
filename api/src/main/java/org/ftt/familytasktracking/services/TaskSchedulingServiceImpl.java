package org.ftt.familytasktracking.services;

import io.micrometer.common.util.StringUtils;
import org.ftt.familytasktracking.entities.Household;
import org.ftt.familytasktracking.entities.Task;
import org.ftt.familytasktracking.enums.TaskState;
import org.ftt.familytasktracking.repositories.TaskRepository;
import org.springframework.scheduling.support.CronExpression;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskSchedulingServiceImpl implements TaskSchedulingService {
    private final TaskRepository taskRepository;

    public TaskSchedulingServiceImpl(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public void updateAllTaskSchedulingParametersByHousehold(Household household) {
        List<Task> tasks = this.taskRepository.findAllByHousehold(household);
        tasks.forEach(this::updateTasksSchedulingParameters);
        this.taskRepository.saveAll(tasks);
    }

    @Override
    public void updateTasksSchedulingParameters(Task task) {
        if (!isTaskScheduled(task)) {
            return;
        }
        CronExpression cronExpression = CronExpression.parse(task.getCronExpression());
        LocalDateTime nextExecution = cronExpression.next(task.getLastTaskCreationAt());
        if (LocalDateTime.now().isAfter(nextExecution)) {
            updateTaskSchedulingParametersByCronExpression(task, cronExpression);
            resetTaskState(task);
        }
    }

    private boolean isTaskScheduled(Task task) {
        return Boolean.TRUE.equals(task.getScheduled()) &&
                StringUtils.isNotEmpty(task.getCronExpression()) &&
                CronExpression.isValidExpression(task.getCronExpression());
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
