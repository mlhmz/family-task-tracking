package org.ftt.familytasktracking.services;

import org.ftt.familytasktracking.entities.Task;
import org.ftt.familytasktracking.enums.TaskState;
import org.ftt.familytasktracking.repositories.TaskRepository;
import org.ftt.familytasktracking.tasks.scheduler.SchedulerMode;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.MockedStatic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mockStatic;

@SpringBootTest(classes = {TaskSchedulingServiceTest.class, TaskSchedulingServiceImpl.class, TaskRepository.class})
class TaskSchedulingServiceTest {
    @Autowired
    TaskSchedulingService taskSchedulingService;
    @MockBean
    TaskRepository taskRepository;
    @Captor
    ArgumentCaptor<List<Task>> tasksCaptor;
    MockedStatic<LocalDateTime> localDateTimeMockedStatic;
    LocalDateTime localDateTime;

    @BeforeEach
    void setUp() {
        localDateTime = LocalDateTime.of(2022, 1, 1, 14, 12, 13);
        localDateTimeMockedStatic = mockStatic(LocalDateTime.class);
        localDateTimeMockedStatic.when(LocalDateTime::now).thenReturn(localDateTime);
    }

    @AfterEach
    void tearDown() {
        localDateTimeMockedStatic.close();
    }

    @Test
    void rescheduleAllExpiredAndDoneTasks_UpdatesMultipleHouseholds() {
        Task task1 = Task.builder()
                .lastTaskCreationAt(LocalDateTime.now().minusDays(5))
                .nextTaskCreationAt(LocalDateTime.now())
                .taskState(TaskState.FINISHED)
                .schedulerMode(SchedulerMode.CRON)
                .cronExpression("0 0 0 */5 * *")
                .build();
        LocalDateTime secondLastTaskCreationAt = localDateTime.plusDays(1);
        Task task2 = Task.builder()
                .lastTaskCreationAt(secondLastTaskCreationAt)
                .nextTaskCreationAt(LocalDateTime.now())
                .taskState(TaskState.FINISHED)
                .schedulerMode(SchedulerMode.CRON)
                .cronExpression("0 0 0 */10 * *")
                .build();
        LocalDateTime thirdLastTaskCreationAt = LocalDateTime.now().minusDays(2);
        Task task3 = Task.builder()
                .lastTaskCreationAt(thirdLastTaskCreationAt)
                .nextTaskCreationAt(LocalDateTime.now())
                .taskState(TaskState.FINISHED)
                .schedulerMode(SchedulerMode.DEACTIVATED)
                .cronExpression("0 0 0 */5 * *")
                .build();
        LocalDateTime fourthLastTaskCreationAt = LocalDateTime.now().minusDays(2);
        Task task4 = Task.builder()
                .lastTaskCreationAt(fourthLastTaskCreationAt)
                .nextTaskCreationAt(LocalDateTime.now())
                .taskState(TaskState.FINISHED)
                .schedulerMode(SchedulerMode.MILLI_INTERVAL)
                .intervalMillis(1000L)
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
        assertThat(savedTasks.get(3).getLastTaskCreationAt()).isEqualTo(LocalDateTime.now());
        assertThat(savedTasks.get(3).getTaskState()).isEqualTo(TaskState.UNDONE);
    }

    @Test
    void rescheduleExpiredTaskWithCron_UpdatesTaskSchedulingWhenExpired() {
        Task task = Task.builder()
                .lastTaskCreationAt(localDateTime.minusDays(5))
                .nextTaskCreationAt(LocalDateTime.now())
                .taskState(TaskState.FINISHED)
                .schedulerMode(SchedulerMode.CRON)
                .cronExpression("0 0 0 */5 * *")
                .build();

        taskSchedulingService.rescheduleExpiredTask(task);
        assertThat(task.getLastTaskCreationAt()).isEqualToIgnoringMinutes(localDateTime);
        assertThat(task.getTaskState()).isEqualTo(TaskState.UNDONE);
        assertThat(task.getNextTaskCreationAt()).isEqualToIgnoringHours(localDateTime.plusDays(5));
    }

    @Test
    void rescheduleExpiredTaskWithIntervalMillis_UpdatesTaskSchedulingWhenExpired() {
        Task task = Task.builder()
                .lastTaskCreationAt(localDateTime.minusDays(61))
                .nextTaskCreationAt(LocalDateTime.now())
                .taskState(TaskState.FINISHED)
                .schedulerMode(SchedulerMode.MILLI_INTERVAL)
                .intervalMillis(TimeUnit.DAYS.toMillis(60))
                .build();

        taskSchedulingService.rescheduleExpiredTask(task);
        assertThat(task.getLastTaskCreationAt()).isEqualToIgnoringMinutes(localDateTime);
        assertThat(task.getTaskState()).isEqualTo(TaskState.UNDONE);
        assertThat(task.getNextTaskCreationAt()).isEqualToIgnoringHours(localDateTime.plusDays(60));
    }

    @Test
    void rescheduleExpiredTaskWithCron_DoesntUpdateTaskSchedulingWhenNotExpired() {
        LocalDateTime lastTaskCreation = localDateTime;
        Task task = Task.builder()
                .lastTaskCreationAt(lastTaskCreation)
                .nextTaskCreationAt(null)
                .taskState(TaskState.FINISHED)
                .schedulerMode(SchedulerMode.CRON)
                .cronExpression("0 0 0 */5 * *")
                .build();

        taskSchedulingService.rescheduleExpiredTask(task);

        assertThat(task.getNextTaskCreationAt()).isNull();
        assertThat(task.getLastTaskCreationAt()).isEqualToIgnoringSeconds(lastTaskCreation);
        assertThat(task.getTaskState()).isEqualTo(TaskState.FINISHED);
    }

    @Test
    void rescheduleExpiredTaskWithIntervalMillis_DoesntUpdateTaskSchedulingWhenNotExpired() {
        Task task = Task.builder()
                .lastTaskCreationAt(localDateTime.minusDays(55))
                .nextTaskCreationAt(LocalDateTime.now())
                .taskState(TaskState.FINISHED)
                .schedulerMode(SchedulerMode.MILLI_INTERVAL)
                .intervalMillis(TimeUnit.DAYS.toMillis(60))
                .build();

        taskSchedulingService.rescheduleExpiredTask(task);
        assertThat(task.getLastTaskCreationAt()).isEqualToIgnoringMinutes(localDateTime.minusDays(55));
        assertThat(task.getTaskState()).isEqualTo(TaskState.FINISHED);
    }
}
