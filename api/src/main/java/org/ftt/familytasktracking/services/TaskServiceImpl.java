package org.ftt.familytasktracking.services;

import org.ftt.familytasktracking.dtos.TaskRequestDto;
import org.ftt.familytasktracking.dtos.TaskResponseDto;
import org.ftt.familytasktracking.entities.Profile;
import org.ftt.familytasktracking.entities.Task;
import org.ftt.familytasktracking.mappers.TaskMapper;
import org.ftt.familytasktracking.repositories.TaskRepository;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskMapper taskMapper;
    private final TaskRepository taskRepository;
    private final ProfileService profileService;
    private final HouseholdService householdService;

    public TaskServiceImpl(TaskMapper taskMapper, TaskRepository taskRepository, ProfileService profileService, HouseholdService householdService) {
        this.taskMapper = taskMapper;
        this.taskRepository = taskRepository;
        this.profileService = profileService;
        this.householdService = householdService;
    }

    @Override
    public TaskResponseDto createTask(TaskRequestDto dto, Jwt jwt) {
        Task task = taskMapper.mapTaskDtoToTask(dto);
        setTasksAssigneeByMappingResult(task, jwt);
        task.setHousehold(this.householdService.getHouseholdByJwt(jwt));
        return taskMapper.mapTaskToTaskDto(taskRepository.save(task));
    }

    private void setTasksAssigneeByMappingResult(Task task, Jwt jwt) {
        if (task.getAssignee() != null) {
            UUID assigneeUuid = task.getAssignee().getUuid();
            Profile assignee = assigneeUuid != null ?
                    this.profileService.getProfileByUuidAndJwt(assigneeUuid, jwt).toEntity() : null;
            task.setAssignee(assignee);
        }
    }
}
