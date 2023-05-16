package org.ftt.familytasktracking.mappers;

import org.ftt.familytasktracking.dtos.TaskRequestDto;
import org.ftt.familytasktracking.dtos.TaskResponseDto;
import org.ftt.familytasktracking.entities.Task;
import org.ftt.familytasktracking.enums.TaskState;
import org.mapstruct.*;

/**
 * Mapper for the {@link Task} and {@link TaskResponseDto} Object
 */
@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
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
    @Mapping(source = "assigneeUuid", target = "assignee.uuid")
    Task mapTaskDtoToTask(TaskRequestDto taskRequestDto);

    @Mapping(target = "assignee", ignore = true)
    @Mapping(target = "household", ignore = true)
    void updateTask(Task updateTask, @MappingTarget Task targetTask);

    @Mapping(target = "name", ignore = true)
    @Mapping(target = "description", ignore = true)
    @Mapping(target = "taskState", ignore = true)
    @Mapping(target = "household", ignore = true)
    void updateTaskAssignee(Task updateTask, @MappingTarget Task targetTask);

    default void safeUpdateTask(Task updateTask, @MappingTarget Task targetTask) {
        if (TaskState.DONE == updateTask.getTaskState()) {
            targetTask.setTaskState(TaskState.DONE);
        }
    }
}
