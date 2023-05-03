package org.ftt.familytasktracking.services;

import org.ftt.familytasktracking.entities.Task;
import org.ftt.familytasktracking.enums.TaskState;
import org.ftt.familytasktracking.repositories.TaskRepository;
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
import static org.mockito.Mockito.doReturn;

@SpringBootTest(classes = {TaskSchedulingServiceTest.class, TaskSchedulingServiceImpl.class, TaskRepository.class})
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
                .taskState(TaskState.DONE)
                .scheduled(true)
                .cronExpression("0 0 0 */5 * *")
                .build();
        LocalDateTime secondLastTaskCreationAt = LocalDateTime.now().minusDays(2);
        Task task2 = Task.builder()
                .lastTaskCreationAt(secondLastTaskCreationAt)
                .nextTaskCreationAt(LocalDateTime.now())
                .taskState(TaskState.DONE)
                .scheduled(true)
                .cronExpression("0 0 0 */5 * *")
                .build();
        LocalDateTime thirdLastTaskCreationAt = LocalDateTime.now().minusDays(2);
        Task task3 = Task.builder()
                .lastTaskCreationAt(thirdLastTaskCreationAt)
                .nextTaskCreationAt(LocalDateTime.now())
                .taskState(TaskState.DONE)
                .scheduled(false)
                .cronExpression("0 0 0 */5 * *")
                .build();

        doReturn(List.of(task1, task2, task3)).when(taskRepository).findAllByHousehold(any());
        doReturn(null).when(taskRepository).saveAll(tasksCaptor.capture());

        // Param is irrelevant because the Stub above matches everything
        taskSchedulingService.updateAllTaskSchedulingParametersByHousehold(null);

        List<Task> savedTasks = tasksCaptor.getValue();

        // First Task
        assertThat(savedTasks.get(0).getLastTaskCreationAt()).isEqualToIgnoringMinutes(LocalDateTime.now());
        assertThat(savedTasks.get(0).getTaskState()).isEqualTo(TaskState.UNDONE);

        // Second Task
        assertThat(savedTasks.get(1).getLastTaskCreationAt()).isEqualTo(secondLastTaskCreationAt);
        assertThat(savedTasks.get(1).getTaskState()).isEqualTo(TaskState.DONE);

        // Third Task
        assertThat(savedTasks.get(2).getLastTaskCreationAt()).isEqualTo(thirdLastTaskCreationAt);
        assertThat(savedTasks.get(2).getTaskState()).isEqualTo(TaskState.DONE);
    }

    @Test
    void updateTasksSchedulingParameters_UpdatesTaskSchedulingWhenExpired() {
        Task task = Task.builder()
                .lastTaskCreationAt(LocalDateTime.now().minusDays(5))
                .nextTaskCreationAt(LocalDateTime.now())
                .taskState(TaskState.DONE)
                .scheduled(true)
                .cronExpression("0 0 0 /5 * *")
                .build();

        taskSchedulingService.updateTasksSchedulingParameters(task);
        assertThat(task.getLastTaskCreationAt()).isEqualToIgnoringMinutes(LocalDateTime.now());
        assertThat(task.getTaskState()).isEqualTo(TaskState.UNDONE);
        assertThat(task.getNextTaskCreationAt()).isEqualToIgnoringMinutes(LocalDateTime.now().plusDays(5));
    }
}
