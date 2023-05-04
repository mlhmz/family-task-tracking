package org.ftt.familytasktracking.services;

import com.querydsl.core.types.dsl.BooleanExpression;
import jakarta.transaction.Transactional;
import lombok.NonNull;
import org.ftt.familytasktracking.dtos.TaskRequestDto;
import org.ftt.familytasktracking.dtos.TaskResponseDto;
import org.ftt.familytasktracking.entities.Household;
import org.ftt.familytasktracking.entities.Profile;
import org.ftt.familytasktracking.entities.QTask;
import org.ftt.familytasktracking.entities.Task;
import org.ftt.familytasktracking.exceptions.WebRtException;
import org.ftt.familytasktracking.hooks.TaskFinishedUpdateHook;
import org.ftt.familytasktracking.hooks.TaskPointsUpdateHook;
import org.ftt.familytasktracking.hooks.TaskUpdateDoneHook;
import org.ftt.familytasktracking.hooks.TaskUpdateHook;
import org.ftt.familytasktracking.mappers.TaskMapper;
import org.ftt.familytasktracking.models.TaskModel;
import org.ftt.familytasktracking.predicate.PredicatesBuilder;
import org.ftt.familytasktracking.repositories.TaskRepository;
import org.ftt.familytasktracking.search.SearchQuery;
import org.ftt.familytasktracking.utils.SearchQueryUtils;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.StreamSupport;

@Service
public class TaskServiceImpl implements TaskService {
    private final List<TaskUpdateHook> taskUpdateHooks = new ArrayList<>();
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
        addUpdateHooksToArrayList();
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
        Task task = this.taskRepository.findTaskByHouseholdAndUuid(household, uuid);
        if (task == null) {
            throw new WebRtException(HttpStatus.NOT_FOUND,
                    String.format("The task with the uuid '%s' was not found.", uuid));
        }
        return buildModelFromTaskEntity(
                task
        );
    }

    @Override
    @Transactional
    public TaskModel updateTaskByUuidAndJwt(@NonNull TaskModel updateTaskModel, @NonNull UUID uuid, @NonNull Jwt jwt,
                                            boolean safe) {
        Task updateTask = updateTaskModel.toEntity();
        Task targetTask = this.getTaskByUuidAndJwt(uuid, jwt).toEntity();
        updateTargetTask(updateTask, targetTask, safe);
        executeUpdateHooks(updateTask, targetTask, safe);
        return buildModelFromTaskEntity(
                this.taskRepository.save(targetTask)
        );
    }

    @Override
    @Transactional
    public void deleteTaskByIdAndJwt(UUID taskId, Jwt jwt) {
        Household household = this.householdService.getHouseholdByJwt(jwt);
        if (!taskRepository.existsTaskByUuidAndHousehold(taskId, household)) {
            throw new WebRtException(HttpStatus.NOT_FOUND, "Task was not found");
        }
        taskRepository.deleteTaskByUuidAndHousehold(taskId, household);
    }

    @Override
    public TaskModel buildModelFromTaskEntity(Task entity) {
        return new TaskModel(entity, taskMapper);
    }

    @Override
    public TaskModel buildModelFromTaskRequestDto(TaskRequestDto dto) {
        return new TaskModel(dto, taskMapper);
    }

    private void updateTargetTask(@NonNull Task updateTask, @NonNull Task targetTask, boolean safe) {
        if (safe) {
            this.taskMapper.safeUpdateTask(updateTask, targetTask);
        } else {
            this.taskMapper.updateTask(updateTask, targetTask);
        }
    }

    /**
     * Executes all {@link TaskUpdateHook}-Hooks
     *
     * @param targetTask {@link Task} that the hooks should execute on
     */
    private void executeUpdateHooks(Task updateTask, Task targetTask, boolean safe) {
        for (TaskUpdateHook taskUpdateHook : taskUpdateHooks) {
            taskUpdateHook.executeUpdateHook(updateTask, targetTask, safe);
        }
    }

    private void addUpdateHooksToArrayList() {
        taskUpdateHooks.add(new TaskUpdateDoneHook());
        taskUpdateHooks.add(new TaskPointsUpdateHook());
        taskUpdateHooks.add(new TaskFinishedUpdateHook());
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
