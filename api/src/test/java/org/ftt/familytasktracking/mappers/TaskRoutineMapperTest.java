package org.ftt.familytasktracking.mappers;

import org.ftt.familytasktracking.dtos.TaskRoutineDto;
import org.ftt.familytasktracking.entities.Household;
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
                .household(
                        Household.builder()
                            .uuid(UUID.randomUUID())
                        .build()
                ).build();
        TaskRoutineDto dto = taskRoutineMapper.mapTaskRoutineToTaskRoutineDto(taskRoutine);
        assertThat(dto.uuid()).isEqualTo(taskRoutine.getUuid().toString());
        assertThat(dto.name()).isEqualTo(taskRoutine.getName());
        assertThat(dto.description()).isEqualTo(taskRoutine.getDescription());
        assertThat(dto.interval()).isEqualTo(taskRoutine.getInterval());
        assertThat(dto.intervalType()).isEqualTo(taskRoutine.getIntervalType());
        assertThat(dto.createdAt()).isEqualTo(taskRoutine.getCreatedAt());
        assertThat(dto.updatedAt()).isEqualTo(taskRoutine.getUpdatedAt());
        assertThat(dto.lastTaskCreationAt()).isEqualTo(taskRoutine.getLastTaskCreationAt());
        assertThat(dto.activated()).isEqualTo(taskRoutine.isActivated());
        assertThat(dto.householdUuid()).isEqualTo(taskRoutine.getHousehold().getUuid().toString());

    }

    @ParameterizedTest
    @EnumSource(IntervalType.class)
    void mapTaskRoutineDtoToTaskRoutine(IntervalType type) {
        TaskRoutineDto dto = new TaskRoutineDto(UUID.randomUUID().toString(), "Task 1",
                "Test Description", 5, type, LocalDateTime.now(), LocalDateTime.now(),
                LocalDateTime.now(), true, UUID.randomUUID().toString());
        TaskRoutine taskRoutine = taskRoutineMapper.mapTaskRoutineDtoToTaskRoutine(dto);
        assertThat(taskRoutine.getUuid()).hasToString(dto.uuid());
        assertThat(taskRoutine.getName()).isEqualTo(dto.name());
        assertThat(taskRoutine.getDescription()).isEqualTo(dto.description());
        assertThat(taskRoutine.getInterval()).isEqualTo(dto.interval());
        assertThat(taskRoutine.getIntervalType()).isEqualTo(dto.intervalType());
        assertThat(taskRoutine.getCreatedAt()).isEqualTo(dto.createdAt());
        assertThat(taskRoutine.getUpdatedAt()).isEqualTo(dto.updatedAt());
        assertThat(taskRoutine.getLastTaskCreationAt()).isEqualTo(dto.lastTaskCreationAt());
        assertThat(taskRoutine.isActivated()).isEqualTo(dto.activated());
        // The household shouldn't be mapped back, so just checking if its null is ok
        assertThat(taskRoutine.getHousehold()).isNull();
    }
}