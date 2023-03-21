package org.ftt.familytasktracking.config;

import io.micrometer.common.util.StringUtils;
import org.ftt.familytasktracking.entities.Household;
import org.ftt.familytasktracking.entities.Profile;
import org.ftt.familytasktracking.entities.Task;
import org.ftt.familytasktracking.entities.TaskRoutine;
import org.ftt.familytasktracking.enums.IntervalType;
import org.ftt.familytasktracking.enums.PermissionType;
import org.ftt.familytasktracking.repositories.HouseholdRepository;
import org.ftt.familytasktracking.repositories.ProfileRepository;
import org.ftt.familytasktracking.repositories.TaskRepository;
import org.ftt.familytasktracking.repositories.TaskRoutineRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Component
public class FixtureConfig implements ApplicationRunner {
    private final HouseholdRepository householdRepository;
    private final ProfileRepository profileRepository;
    private final TaskRepository taskRepository;
    private final TaskRoutineRepository taskRoutineRepository;

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    public FixtureConfig(HouseholdRepository householdRepository, ProfileRepository profileRepository,
                         TaskRepository taskRepository, TaskRoutineRepository taskRoutineRepository) {
        this.householdRepository = householdRepository;
        this.profileRepository = profileRepository;
        this.taskRepository = taskRepository;
        this.taskRoutineRepository = taskRoutineRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (args.getNonOptionArgs().contains("fixtures")) {
            Household household = Household.builder()
                    .householdName("Mustermann")
                    .keycloakUserId(getKcUserUuid())
                    .build();
            List<Profile> sampleProfiles = getSampleProfiles(household);
            List<Task> sampleTasks = getSampleTasks(
                    household,
                    sampleProfiles.get(0),
                    sampleProfiles.get(1));
            List<TaskRoutine> taskRoutines = getTaskRoutines(household);
            persistFixtures(household, sampleProfiles, sampleTasks, taskRoutines);
            logger.info("Created Fixtures - Household UUID: {}", household.getUuid());
        }
    }

    private void persistFixtures(Household household, List<Profile> sampleProfiles,
                                 List<Task> sampleTasks, List<TaskRoutine> taskRoutines) {
        this.householdRepository.save(household);
        this.profileRepository.saveAll(sampleProfiles);
        this.taskRepository.saveAll(sampleTasks);
        this.taskRoutineRepository.saveAll(taskRoutines);
    }

    private UUID getKcUserUuid() {
        String kcUserUuid = System.getenv("KC_USER_UUID");

        if (StringUtils.isEmpty(kcUserUuid)) {
            logger.warn("There was no Keycloak User UUID found. Generating Random UUID.");
            return UUID.randomUUID();
        }

        return UUID.fromString(kcUserUuid);
    }

    private List<Profile> getSampleProfiles(Household household) {
        Profile firstProfile = Profile
                .builder()
                .name("Max")
                .points(90)
                .password("1234")
                .permissionType(PermissionType.MEMBER)
                .household(household)
                .build();
        Profile secondProfile = Profile
                .builder()
                .name("Max 2")
                .points(90)
                .password("1234")
                .permissionType(PermissionType.MEMBER)
                .household(household)
                .build();
        Profile thirdProfile = Profile
                .builder()
                .name("Max 3")
                .points(90)
                .password("1234")
                .permissionType(PermissionType.ADMIN)
                .household(household)
                .build();
        return List.of(firstProfile, secondProfile, thirdProfile);
    }

    private List<Task> getSampleTasks(Household household, Profile firstProfile, Profile secondProfile) {
        Task firstTask = Task.builder()
                .name("Do something 1")
                .description("This is an example task")
                .done(false)
                .expirationAt(LocalDateTime.now().plusDays(5))
                .assignee(firstProfile)
                .household(household)
                .build();
        Task secondTask = Task.builder()
                .name("Do something 2")
                .description("This is an example task")
                .done(false)
                .expirationAt(LocalDateTime.now().plusDays(5))
                .assignee(secondProfile)
                .household(household)
                .build();
        return List.of(firstTask, secondTask);
    }

    private List<TaskRoutine> getTaskRoutines(Household household) {
        TaskRoutine firstTaskRoutine = TaskRoutine.builder()
                .name("Do something routine 1")
                .description("This is an example task routine")
                .activated(true)
                .lastTaskCreationAt(LocalDateTime.now().minusDays(5))
                .interval(5)
                .intervalType(IntervalType.DAYS)
                .household(household)
                .build();
        TaskRoutine secondTaskRoutine = TaskRoutine.builder()
                .name("Do something routine 1")
                .description("This is an example task routine")
                .activated(true)
                .lastTaskCreationAt(LocalDateTime.now().minusDays(5))
                .interval(2)
                .intervalType(IntervalType.WEEKS)
                .household(household)
                .build();
        return List.of(firstTaskRoutine, secondTaskRoutine);
    }
}
