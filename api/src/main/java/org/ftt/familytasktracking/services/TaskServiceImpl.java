package org.ftt.familytasktracking.services;

import org.ftt.familytasktracking.dtos.TaskRequestDto;
import org.ftt.familytasktracking.dtos.TaskResponseDto;
import org.ftt.familytasktracking.entities.Task;
import org.ftt.familytasktracking.mappers.TaskMapper;
import org.ftt.familytasktracking.repositories.ProfileRepository;
import org.ftt.familytasktracking.repositories.TaskRepository;
import org.springframework.stereotype.Service;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskMapper taskMapper;
    private final TaskRepository taskRepository;
    private final ProfileRepository profileRepository;

    public TaskServiceImpl(TaskMapper taskMapper, TaskRepository taskRepository, ProfileRepository profileRepository) {
        this.taskMapper = taskMapper;
        this.taskRepository = taskRepository;
        this.profileRepository = profileRepository;
    }
    @Override
    public TaskResponseDto createTask(TaskRequestDto dto) {
        Task task = taskMapper.mapTaskDtoToTask(dto);
        task.setAssignee(profileRepository.getProfileByUuid(task.getAssignee().getUuid()));
        return taskMapper.mapTaskToTaskDto(taskRepository.save(task));
    }
}
