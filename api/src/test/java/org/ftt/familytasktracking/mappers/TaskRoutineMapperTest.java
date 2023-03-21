package org.ftt.familytasktracking.mappers;

import org.ftt.familytasktracking.dtos.TaskRoutineRequestDto;
import org.ftt.familytasktracking.dtos.TaskRoutineResponseDto;
import org.ftt.familytasktracking.entities.TaskRoutine;
import org.ftt.familytasktracking.enums.IntervalType;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(properties = "spring.main.lazy-initialization=true",
        classes = {TaskRoutineMapperTest.class, TaskRoutineMapperImpl.class})
class TaskRoutineMapperTest {
    @Autowired
    TaskRoutineMapper taskRoutineMapper;

    @ParameterizedTest
    @EnumSource(IntervalType.class)
    void mapTaskRoutineToTaskRoutineDto(IntervalType type) {
        TaskRoutine taskRoutine = TaskRoutine.builder()
                .uuid(UUID.randomUUID())
                .name("Task 1")
                .description("A simple task")
                .interval(5)
                .intervalType(type)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .lastTaskCreationAt(LocalDateTime.now())
                .activated(true)
                .build();
        TaskRoutineResponseDto dto = taskRoutineMapper.mapTaskRoutineToTaskRoutineDto(taskRoutine);
        assertThat(dto.uuid()).isEqualTo(taskRoutine.getUuid().toString());
        assertThat(dto.name()).isEqualTo(taskRoutine.getName());
        assertThat(dto.description()).isEqualTo(taskRoutine.getDescription());
        assertThat(dto.interval()).isEqualTo(taskRoutine.getInterval());
        assertThat(dto.intervalType()).isEqualTo(taskRoutine.getIntervalType());
        assertThat(dto.createdAt()).isEqualTo(taskRoutine.getCreatedAt());
        assertThat(dto.updatedAt()).isEqualTo(taskRoutine.getUpdatedAt());
        assertThat(dto.lastTaskCreationAt()).isEqualTo(taskRoutine.getLastTaskCreationAt());
        assertThat(dto.activated()).isEqualTo(taskRoutine.isActivated());

    }

    @ParameterizedTest
    @EnumSource(IntervalType.class)
    void mapTaskRoutineDtoToTaskRoutine(IntervalType type) {
        TaskRoutineRequestDto dto = new TaskRoutineRequestDto( "Task 1", "Test Description",
                5, type, true);
        TaskRoutine taskRoutine = taskRoutineMapper.mapTaskRoutineDtoToTaskRoutine(dto);
        assertThat(taskRoutine.getName()).isEqualTo(dto.name());
        assertThat(taskRoutine.getDescription()).isEqualTo(dto.description());
        assertThat(taskRoutine.getInterval()).isEqualTo(dto.interval());
        assertThat(taskRoutine.getIntervalType()).isEqualTo(dto.intervalType());
        assertThat(taskRoutine.isActivated()).isEqualTo(dto.activated());
    }
}