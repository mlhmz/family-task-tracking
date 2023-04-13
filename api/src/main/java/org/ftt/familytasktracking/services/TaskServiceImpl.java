package org.ftt.familytasktracking.services;

import com.querydsl.core.types.dsl.BooleanExpression;
import lombok.NonNull;
import org.ftt.familytasktracking.dtos.TaskRequestDto;
import org.ftt.familytasktracking.dtos.TaskResponseDto;
import org.ftt.familytasktracking.entities.Household;
import org.ftt.familytasktracking.entities.Profile;
import org.ftt.familytasktracking.entities.QTask;
import org.ftt.familytasktracking.entities.Task;
import org.ftt.familytasktracking.exceptions.WebRtException;
import org.ftt.familytasktracking.mappers.TaskMapper;
import org.ftt.familytasktracking.models.TaskModel;
import org.ftt.familytasktracking.predicate.PredicatesBuilder;
import org.ftt.familytasktracking.repositories.TaskRepository;
import org.ftt.familytasktracking.search.SearchQuery;
import org.ftt.familytasktracking.utils.SearchQueryUtils;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.StreamSupport;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskMapper taskMapper;
    private final TaskRepository taskRepository;
    private final ProfileService profileService;
    private final HouseholdService householdService;

    public TaskServiceImpl(TaskMapper taskMapper, TaskRepository taskRepository, ProfileService profileService,
                           HouseholdService householdService) {
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

    @Override
    public List<TaskModel> getAllTasksByJwt(@NonNull Jwt jwt) {
        Household household = this.householdService.getHouseholdByJwt(jwt);
        return this.taskRepository.findAllByHousehold(household).stream()
                .map(this::buildModelFromTaskEntity)
                .toList();
    }

    @Override
    public List<TaskModel> getAllTasksByJwtAndSearchQuery(@NonNull Jwt jwt, @NonNull String query) {
        Household household = this.householdService.getHouseholdByJwt(jwt);
        PredicatesBuilder<Task> predicatesBuilder = new PredicatesBuilder<>(Task.class);

        List<SearchQuery> searchQueries = SearchQueryUtils.parseSearchQueries(query);

        searchQueries.forEach(predicatesBuilder::with);
        for (SearchQuery searchQuery : searchQueries) {
            predicatesBuilder.with(searchQuery);
        }

        BooleanExpression exp = predicatesBuilder.build();
        QTask task = QTask.task;
        Iterable<Task> tasks;
        try {
            tasks = this.taskRepository.findAll(task.household.eq(household).and(exp));
        } catch (Exception exception) {
            throw new WebRtException(HttpStatus.BAD_REQUEST, "Query Error: " + exception.getMessage());
        }
        return StreamSupport.stream(tasks.spliterator(), false)
                .map(this::buildModelFromTaskEntity)
                .toList();
    }

    @Override
    public TaskModel getTaskByUuidAndJwt(@NonNull UUID uuid, @NonNull Jwt jwt) {
        Household household = this.householdService.getHouseholdByJwt(jwt);
        return buildModelFromTaskEntity(
                this.taskRepository.findTaskByHouseholdAndUuid(household, uuid)
        );
    }

    @Override
    public TaskModel buildModelFromTaskEntity(Task entity) {
        return new TaskModel(entity, taskMapper);
    }

    @Override
    public TaskModel buildModelFromTaskRequestDto(TaskRequestDto dto) {
        return new TaskModel(dto, taskMapper);
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
