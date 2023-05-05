package org.ftt.familytasktracking.services;

import org.ftt.familytasktracking.entities.Household;
import org.ftt.familytasktracking.entities.Task;
import org.ftt.familytasktracking.enums.TaskState;
import org.ftt.familytasktracking.repositories.TaskRepository;
import org.ftt.familytasktracking.schedulers.TaskScheduler;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskSchedulingServiceImpl implements TaskSchedulingService {
    private static final TaskState DONE_TASK_STATE = TaskState.FINISHED;
    private final TaskRepository taskRepository;
    private final TaskScheduler taskScheduler;

    public TaskSchedulingServiceImpl(TaskRepository taskRepository, TaskScheduler taskScheduler) {
        this.taskRepository = taskRepository;
        this.taskScheduler = taskScheduler;
    }

    @Override
    public void rescheduleAllExpiredAndDoneTasks(Household household) {
        List<Task> tasks = this.taskRepository.findAllByHouseholdAndTaskState(household, DONE_TASK_STATE);
        tasks.forEach(this::rescheduleExpiredTask);
        this.taskRepository.saveAll(tasks);
    }

    @Override
    public void rescheduleExpiredTask(Task task) {
        if (taskScheduler.rescheduleOnExpiration(task)) {
            resetTaskState(task);
        }
    }

    private void resetTaskState(Task task) {
        task.setTaskState(TaskState.UNDONE);
        task.setDoneAt(null);
    }
}
