package org.ftt.familytasktracking.mappers;

import org.ftt.familytasktracking.dtos.TaskRequestDto;
import org.ftt.familytasktracking.dtos.TaskResponseDto;
import org.ftt.familytasktracking.entities.Profile;
import org.ftt.familytasktracking.entities.Task;
import org.ftt.familytasktracking.enums.TaskState;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(properties = "spring.main.lazy-initialization=true",
        classes = {TaskMapperTest.class, TaskMapperImpl.class})
class TaskMapperTest {
    @Autowired
    TaskMapper taskMapper;

    @Test
    void mapTaskToTaskDto() {
        Task task = Task.builder()
                .uuid(UUID.randomUUID())
                .name("Task 1")
                .description("Task Description")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .expirationAt(LocalDateTime.now())
                .doneAt(LocalDateTime.now())
                .taskState(TaskState.UNDONE)
                .assignee(Profile.builder().uuid(UUID.randomUUID()).build())
                .build();
        TaskResponseDto dto = taskMapper.mapTaskToTaskDto(task);
        assertThat(dto.uuid()).isEqualTo(task.getUuid().toString());
        assertThat(dto.name()).isEqualTo(task.getName());
        assertThat(dto.description()).isEqualTo(task.getDescription());
        assertThat(dto.createdAt()).isEqualTo(task.getCreatedAt());
        assertThat(dto.updatedAt()).isEqualTo(task.getUpdatedAt());
        assertThat(dto.expirationAt()).isEqualTo(task.getExpirationAt());
        assertThat(dto.doneAt()).isEqualTo(task.getDoneAt());
        assertThat(dto.taskState()).isEqualTo(task.getTaskState());
        assertThat(dto.assigneeUuid()).isEqualTo(task.getAssignee().getUuid().toString());
    }

    @Test
    void mapTaskDtoToTask() {
        TaskRequestDto dto = new TaskRequestDto("Task 1", "Test Description",
                TaskState.UNDONE,
                UUID.randomUUID().toString());
                false, true, "* * * * *", UUID.randomUUID().toString());
        Task task = taskMapper.mapTaskDtoToTask(dto);
        assertThat(task.getName()).isEqualTo(dto.name());
        assertThat(task.getDescription()).isEqualTo(dto.description());
        assertThat(task.getTaskState()).isEqualTo(dto.taskState());
        assertThat(task.getAssignee()).isNotNull();
        assertThat(task.getScheduled()).isTrue();
        assertThat(task.getCronExpression()).isEqualTo(dto.cronExpression());
        assertThat(task.getAssignee().getUuid()).hasToString(dto.assigneeUuid());
    }
}