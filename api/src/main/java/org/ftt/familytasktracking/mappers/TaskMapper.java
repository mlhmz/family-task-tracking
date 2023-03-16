package org.ftt.familytasktracking.mappers;

import org.ftt.familytasktracking.dtos.TaskDto;
import org.ftt.familytasktracking.entities.Task;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * Mapper for the {@link Task} and {@link TaskDto} Object
 */
@Mapper(componentModel = "spring")
public interface TaskMapper {
    /**
     * Maps a {@link Task}-Entity to a {@link TaskDto}.
     * The assignee will be mapped to special uuid fields
     *
     * @param task {@link Task} to map
     * @return Mapped {@link TaskDto}
     */
    @Mapping(target = "assigneeUuid", source = "assignee.uuid")
    TaskDto mapTaskToTaskDto(Task task);

    /**
     * Maps a {@link TaskDto}-Entity to a {@link Task}.
     * <p>
     * <b>IMPORTANT:</b> Only the uuid of the assignee will be mapped into the assignee object.
     *
     * @param taskDto {@link TaskDto} to map
     * @return Mapped {@link Task}
     */
    @InheritInverseConfiguration
    @Mapping(target = "household", ignore = true)
    Task mapTaskDtoToTask(TaskDto taskDto);
}
