package org.ftt.familytasktracking.config;

import io.micrometer.common.util.StringUtils;
import org.ftt.familytasktracking.entities.Household;
import org.ftt.familytasktracking.entities.Profile;
import org.ftt.familytasktracking.entities.Task;
import org.ftt.familytasktracking.entities.TaskRoutine;
import org.ftt.familytasktracking.enums.IntervalType;
import org.ftt.familytasktracking.enums.PermissionType;
import org.ftt.familytasktracking.repositories.HouseholdRepository;
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
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    public FixtureConfig(HouseholdRepository householdRepository) {
        this.householdRepository = householdRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (args.getNonOptionArgs().contains("fixtures")) {
            List<Profile> sampleProfiles = getSampleProfiles();
            List<Task> sampleTasks = getSampleTasks(
                    sampleProfiles.get(0),
                    sampleProfiles.get(1)
            );
            List<TaskRoutine> taskRoutines = getTaskRoutines();
            Household household = Household.builder()
                    .householdName("Mustermann")
                    .keycloakUserId(getKcUserUuid())
                    .tasks(sampleTasks)
                    .profiles(sampleProfiles)
                    .taskRoutines(taskRoutines)
                    .build();
            this.householdRepository.save(household);
            logger.info("Created Fixture - Household UUID: {}", household.getUuid());
        }
    }

    private UUID getKcUserUuid() {
        String kcUserUuid = System.getenv("KC_USER_UUID");

        if (StringUtils.isEmpty(kcUserUuid)) {
            logger.warn("There was no Keycloak User UUID found. Generating Random UUID.");
            return UUID.randomUUID();
        }

        return UUID.fromString(kcUserUuid);
    }

    private List<Profile> getSampleProfiles() {
        Profile firstProfile = Profile
                .builder()
                .name("Max")
                .points(90)
                .password("1234")
                .permissionType(PermissionType.MEMBER)
                .build();
        Profile secondProfile = Profile
                .builder()
                .name("Max 2")
                .points(90)
                .password("1234")
                .permissionType(PermissionType.MEMBER)
                .build();
        Profile thirdProfile = Profile
                .builder()
                .name("Max 3")
                .points(90)
                .password("1234")
                .permissionType(PermissionType.ADMIN)
                .build();
        return List.of(firstProfile, secondProfile, thirdProfile);
    }

    private List<Task> getSampleTasks(Profile firstProfile, Profile secondProfile) {
        Task firstTask = Task.builder()
                .name("Do something 1")
                .description("This is an example task")
                .done(false)
                .expirationAt(LocalDateTime.now().plusDays(5))
                .assignee(firstProfile)
                .build();
        Task secondTask = Task.builder()
                .name("Do something 2")
                .description("This is an example task")
                .done(false)
                .expirationAt(LocalDateTime.now().plusDays(5))
                .assignee(secondProfile)
                .build();
        return List.of(firstTask, secondTask);
    }

    private List<TaskRoutine> getTaskRoutines() {
        TaskRoutine firstTaskRoutine = TaskRoutine.builder()
                .name("Do something routine 1")
                .description("This is an example task routine")
                .activated(true)
                .lastTaskCreationAt(LocalDateTime.now().minusDays(5))
                .interval(5)
                .intervalType(IntervalType.DAYS)
                .build();
        TaskRoutine secondTaskRoutine = TaskRoutine.builder()
                .name("Do something routine 1")
                .description("This is an example task routine")
                .activated(true)
                .lastTaskCreationAt(LocalDateTime.now().minusDays(5))
                .interval(2)
                .intervalType(IntervalType.WEEKS)
                .build();
        return List.of(firstTaskRoutine, secondTaskRoutine);
    }
}
