package org.ftt.familytasktracking.mappers;

import org.ftt.familytasktracking.dtos.TaskRequestDto;
import org.ftt.familytasktracking.dtos.TaskResponseDto;
import org.ftt.familytasktracking.entities.Task;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

/**
 * Mapper for the {@link Task} and {@link TaskResponseDto} Object
 */
@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface TaskMapper {
    /**
     * Maps a {@link Task}-Entity to a {@link TaskResponseDto}.
     * The assignee will be mapped to special uuid fields
     *
     * @param task {@link Task} to map
     * @return Mapped {@link TaskResponseDto}
     */
    @Mapping(target = "assigneeUuid", source = "assignee.uuid")
    TaskResponseDto mapTaskToTaskDto(Task task);

    /**
     * Maps a {@link TaskRequestDto}-Entity to a {@link Task}.
     * <p>
     * <b>IMPORTANT:</b> Only the uuid of the assignee will be mapped into the assignee object.
     *
     * @param taskRequestDto {@link TaskRequestDto} to map
     * @return Mapped {@link Task}
     */
    @InheritInverseConfiguration
    Task mapTaskDtoToTask(TaskRequestDto taskRequestDto);
}
