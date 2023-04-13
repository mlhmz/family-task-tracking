package org.ftt.familytasktracking.models;

import org.ftt.familytasktracking.dtos.TaskRequestDto;
import org.ftt.familytasktracking.dtos.TaskResponseDto;
import org.ftt.familytasktracking.entities.Task;
import org.ftt.familytasktracking.mappers.TaskMapper;

public class TaskModel implements Model<Task, TaskResponseDto> {
    private final TaskMapper taskMapper;
    private final Task task;

    public TaskModel(Task task, TaskMapper taskMapper) {
        this.task = task;
        this.taskMapper = taskMapper;
    }

    public TaskModel(TaskRequestDto dto, TaskMapper taskMapper) {
        this.task = taskMapper.mapTaskDtoToTask(dto);
        this.taskMapper = taskMapper;
    }

    @Override
    public Task toEntity() {
        return this.task;
    }

    @Override
    public TaskResponseDto toResponseDto() {
        return this.taskMapper.mapTaskToTaskDto(task);
    }
}
