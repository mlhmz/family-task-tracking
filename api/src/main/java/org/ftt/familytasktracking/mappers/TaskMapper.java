package org.ftt.familytasktracking.mappers;

import org.ftt.familytasktracking.dtos.TaskDto;
import org.ftt.familytasktracking.entities.Task;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * Mapper for the {@link Task} and {@link TaskDto} Object
 */
@Mapper(componentModel = "spring")
public interface TaskMapper {
    /**
     * Maps a {@link Task}-Entity to a {@link TaskDto}.
     * The assignee as well as the household will be mapped to special uuid fields
     *
     * @param task {@link Task} to map
     * @return Mapped {@link TaskDto}
     */
    @Mapping(target = "householdUuid", source = "household.uuid")
    @Mapping(target = "assigneeUuid", source = "assignee.uuid")
    TaskDto mapTaskToTaskDto(Task task);

    /**
     * Maps a {@link TaskDto}-Entity to a {@link Task}.
     * The assignee as well as the household will be ignored.
     *
     * @param taskDto {@link TaskDto} to map
     * @return Mapped {@link Task}
     */
    @Mapping(target = "household", ignore = true)
    @Mapping(target = "assignee", ignore = true)
    Task mapTaskDtoToTask(TaskDto taskDto);
}
