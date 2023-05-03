package org.ftt.familytasktracking.services;

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
    public void updateAllTaskSchedulingsByHousehold(Household household) {
        List<Task> tasks = this.taskRepository.findAllByHousehold(household);
        tasks.forEach(this::updateTasksScheduling);
        this.taskRepository.saveAll(tasks);
    }

    @Override
    public void updateTasksScheduling(Task task) {
        CronExpression cronExpression = CronExpression.parse(task.getCronExpression());
        LocalDateTime nextExecution = cronExpression.next(task.getLastTaskCreationAt());
        if (LocalDateTime.now().isAfter(nextExecution)) {
            updateTaskSchedulingParametersByCronExpression(task, cronExpression);
            resetTaskState(task);
        }
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
