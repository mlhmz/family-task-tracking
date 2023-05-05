package org.ftt.familytasktracking.services;

import org.ftt.familytasktracking.entities.Task;
import org.ftt.familytasktracking.enums.TaskState;
import org.ftt.familytasktracking.repositories.TaskRepository;
import org.ftt.familytasktracking.tasks.scheduler.CronTaskScheduler;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doReturn;

@SpringBootTest(classes = {TaskSchedulingServiceTest.class, TaskSchedulingServiceImpl.class, TaskRepository.class,
        CronTaskScheduler.class})
class TaskSchedulingServiceTest {
    @Autowired
    TaskSchedulingService taskSchedulingService;
    @MockBean
    TaskRepository taskRepository;
    @Captor
    ArgumentCaptor<List<Task>> tasksCaptor;

    @Test
    void updateAllTaskSchedulingParametersByHousehold_UpdatesMultipleHouseholds() {
        Task task1 = Task.builder()
                .lastTaskCreationAt(LocalDateTime.now().minusDays(7))
                .nextTaskCreationAt(LocalDateTime.now())
                .taskState(TaskState.FINISHED)
                .scheduled(true)
                .cronExpression("0 0 0 */5 * *")
                .build();
        LocalDateTime secondLastTaskCreationAt = LocalDateTime.now().minusDays(2);
        Task task2 = Task.builder()
                .lastTaskCreationAt(secondLastTaskCreationAt)
                .nextTaskCreationAt(LocalDateTime.now())
                .taskState(TaskState.FINISHED)
                .scheduled(true)
                .cronExpression("0 0 0 */5 * *")
                .build();
        LocalDateTime thirdLastTaskCreationAt = LocalDateTime.now().minusDays(2);
        Task task3 = Task.builder()
                .lastTaskCreationAt(thirdLastTaskCreationAt)
                .nextTaskCreationAt(LocalDateTime.now())
                .taskState(TaskState.FINISHED)
                .scheduled(false)
                .cronExpression("0 0 0 */5 * *")
                .build();
        LocalDateTime fourthLastTaskCreationAt = LocalDateTime.now().minusDays(2);
        Task task4 = Task.builder()
                .lastTaskCreationAt(fourthLastTaskCreationAt)
                .nextTaskCreationAt(LocalDateTime.now())
                .taskState(TaskState.DONE)
                .scheduled(true)
                .cronExpression("0 0 0 */5 * *")
                .build();

        doReturn(List.of(task1, task2, task3, task4)).when(taskRepository).findAllByHouseholdAndTaskState(any(),
                eq(TaskState.FINISHED));
        doReturn(null).when(taskRepository).saveAll(tasksCaptor.capture());

        // Param is irrelevant because the Stub above matches everything
        taskSchedulingService.rescheduleAllExpiredAndDoneTasks(null);

        List<Task> savedTasks = tasksCaptor.getValue();

        assertThat(savedTasks).isNotNull().hasSize(4);

        // First Task
        assertThat(savedTasks.get(0).getLastTaskCreationAt()).isEqualToIgnoringMinutes(LocalDateTime.now());
        assertThat(savedTasks.get(0).getTaskState()).isEqualTo(TaskState.UNDONE);

        // Second Task
        assertThat(savedTasks.get(1).getLastTaskCreationAt()).isEqualTo(secondLastTaskCreationAt);
        assertThat(savedTasks.get(1).getTaskState()).isEqualTo(TaskState.FINISHED);

        // Third Task
        assertThat(savedTasks.get(2).getLastTaskCreationAt()).isEqualTo(thirdLastTaskCreationAt);
        assertThat(savedTasks.get(2).getTaskState()).isEqualTo(TaskState.FINISHED);

        // Fourth Task
        assertThat(savedTasks.get(3).getLastTaskCreationAt()).isEqualTo(fourthLastTaskCreationAt);
        assertThat(savedTasks.get(3).getTaskState()).isEqualTo(TaskState.DONE);
    }

    @Test
    void updateTasksSchedulingParameters_UpdatesTaskSchedulingWhenExpired() {
        Task task = Task.builder()
                .lastTaskCreationAt(LocalDateTime.now().minusDays(6))
                .nextTaskCreationAt(LocalDateTime.now())
                .taskState(TaskState.FINISHED)
                .scheduled(true)
                .cronExpression("0 0 0 ${CD}/5 * *")
                .build();

        taskSchedulingService.rescheduleExpiredTask(task);
        assertThat(task.getLastTaskCreationAt()).isEqualToIgnoringMinutes(LocalDateTime.now());
        assertThat(task.getTaskState()).isEqualTo(TaskState.UNDONE);
        assertThat(task.getNextTaskCreationAt()).isEqualToIgnoringHours(LocalDateTime.now().plusDays(5));
    }

    @Test
    void updateTasksSchedulingParameters_DoesntUpdateTaskSchedulingWhenNotExpired() {
        LocalDateTime lastTaskCreation = LocalDateTime.now().minusDays(1);
        Task task = Task.builder()
                .lastTaskCreationAt(lastTaskCreation)
                .nextTaskCreationAt(null)
                .taskState(TaskState.FINISHED)
                .scheduled(true)
                .cronExpression("0 0 0 ${CD}/5 * *")
                .build();

        taskSchedulingService.rescheduleExpiredTask(task);

        assertThat(task.getNextTaskCreationAt()).isNull();
        assertThat(task.getLastTaskCreationAt()).isEqualToIgnoringSeconds(lastTaskCreation);
        assertThat(task.getTaskState()).isEqualTo(TaskState.FINISHED);
    }
}
