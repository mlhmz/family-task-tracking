package org.ftt.familytasktracking.mappers;

import org.ftt.familytasktracking.dtos.TaskDto;
import org.ftt.familytasktracking.entities.Household;
import org.ftt.familytasktracking.entities.Task;
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
                .done(false)
                .household(
                        Household.builder()
                                .uuid(UUID.randomUUID())
                                .build()
                ).build();
        TaskDto dto = taskMapper.mapTaskToTaskDto(task);
        assertThat(dto.uuid()).isEqualTo(task.getUuid().toString());
        assertThat(dto.name()).isEqualTo(task.getName());
        assertThat(dto.description()).isEqualTo(task.getDescription());
        assertThat(dto.createdAt()).isEqualTo(task.getCreatedAt());
        assertThat(dto.updatedAt()).isEqualTo(task.getUpdatedAt());
        assertThat(dto.expirationAt()).isEqualTo(task.getExpirationAt());
        assertThat(dto.doneAt()).isEqualTo(task.getDoneAt());
        assertThat(dto.done()).isEqualTo(task.isDone());
        assertThat(dto.householdUuid()).isEqualTo(task.getHousehold().getUuid().toString());
    }

    @Test
    void mapTaskDtoToTask() {
        TaskDto dto = new TaskDto(UUID.randomUUID().toString(), "Task 1", "Test Description",
                LocalDateTime.now(), LocalDateTime.now(), LocalDateTime.now(), LocalDateTime.now(), false,
                UUID.randomUUID().toString(), UUID.randomUUID().toString());
        Task task = taskMapper.mapTaskDtoToTask(dto);
        assertThat(task.getUuid()).hasToString(dto.uuid());
        assertThat(task.getName()).isEqualTo(dto.name());
        assertThat(task.getDescription()).isEqualTo(dto.description());
        assertThat(task.getCreatedAt()).isEqualTo(dto.createdAt());
        assertThat(task.getUpdatedAt()).isEqualTo(dto.updatedAt());
        assertThat(task.getExpirationAt()).isEqualTo(dto.expirationAt());
        assertThat(task.getDoneAt()).isEqualTo(dto.doneAt());
        assertThat(task.isDone()).isEqualTo(dto.done());
        assertThat(task.getHousehold()).isEqualTo(null);
    }
}