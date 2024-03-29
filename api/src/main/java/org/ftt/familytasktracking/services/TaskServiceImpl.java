package org.ftt.familytasktracking.services;

import com.querydsl.core.types.dsl.BooleanExpression;
import io.micrometer.common.util.StringUtils;
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
import org.springframework.scheduling.support.CronExpression;
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
    private final ProfileAuthService profileAuthService;
    private final HouseholdService householdService;

    public TaskServiceImpl(TaskMapper taskMapper, TaskRepository taskRepository, ProfileService profileService,
                           HouseholdService householdService, ProfileAuthService profileAuthService) {
        this.taskMapper = taskMapper;
        this.taskRepository = taskRepository;
        this.profileService = profileService;
        this.householdService = householdService;
        this.profileAuthService = profileAuthService;
        addUpdateHooksToArrayList();
    }

    @Override
    public TaskResponseDto createTask(TaskRequestDto dto, Jwt jwt) {
        throwBadRequestOnInvalidCronExpression(dto.cronExpression());
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

        List<SearchQuery> searchQueries = SearchQueryUtils.parseSearchQueries(query, Task.class);

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
                                            UUID sessionId, boolean safe) {
        Task updateTask = updateTaskModel.toEntity();
        Task targetTask = this.getTaskByUuidAndJwt(uuid, jwt).toEntity();
        throwBadRequestOnSafeAndAssigneeNotProfileInstance(jwt, sessionId, safe, targetTask);
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

    private void throwBadRequestOnInvalidCronExpression(String cronExpression) {
        if (StringUtils.isNotEmpty(cronExpression) && !CronExpression.isValidExpression(cronExpression)) {
            throw new WebRtException(HttpStatus.BAD_REQUEST, "The given scheduling expression is invalid.");
        }
    }

    private void throwBadRequestOnSafeAndAssigneeNotProfileInstance(Jwt jwt, UUID sessionId, boolean safe,
                                                                    Task targetTask) {
        if (safe) {
            throwBadRequestOnAssigneeNotProfileInstace(jwt, sessionId, targetTask);
        }
    }

    private void throwBadRequestOnAssigneeNotProfileInstace(Jwt jwt, UUID sessionId, Task targetTask) {
        Profile profileInstance = this.profileAuthService.getProfileBySession(sessionId, jwt).toEntity();
        if (profileInstance.getUuid().equals(targetTask.getUuid())) {
            throw new WebRtException(HttpStatus.BAD_REQUEST, "You can't edit tasks, that you're not assigned to.");
        }
    }

    private void updateTargetTask(@NonNull Task updateTask, @NonNull Task targetTask, boolean safe) {
        if (safe) {
            this.taskMapper.safeUpdateTask(updateTask, targetTask);
        } else {
            throwBadRequestOnInvalidCronExpression(updateTask.getCronExpression());
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

    @Override
    public TaskResponseDto setAssigneeForTask(TaskModel updateTaskModel, UUID targetTaskUuid, Jwt jwt) {
        Task updateTask = updateTaskModel.toEntity();
        Task targetTask = this.getTaskByUuidAndJwt(targetTaskUuid, jwt).toEntity();
        if (updateTask.getAssignee().getUuid() != null) {
            this.taskMapper.updateTaskAssignee(updateTask, targetTask);
            this.profileService.existsByProfile(targetTask.getAssignee());
        } else {
            targetTask.setAssignee(null);
        }
        this.taskRepository.save(targetTask);
        return this.taskMapper.mapTaskToTaskDto(targetTask);
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
