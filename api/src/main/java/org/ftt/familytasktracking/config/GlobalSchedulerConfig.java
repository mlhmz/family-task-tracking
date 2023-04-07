package org.ftt.familytasktracking.config;

import org.ftt.familytasktracking.services.UserSessionService;
import org.ftt.familytasktracking.tasks.ExpiredUserSessionRemovalTaskRunnable;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.scheduling.support.PeriodicTrigger;

import java.time.Duration;

@Configuration
public class GlobalSchedulerConfig {
    private final UserSessionService userSessionService;
    private final TaskScheduler taskScheduler;
    private final ApplicationConfigProperties appConfigProps;

    public GlobalSchedulerConfig(UserSessionService userSessionService, ApplicationConfigProperties appConfigProps) {
        this.userSessionService = userSessionService;
        ThreadPoolTaskScheduler threadPoolTaskScheduler = new ThreadPoolTaskScheduler();
        threadPoolTaskScheduler.setPoolSize(5);
        threadPoolTaskScheduler.setThreadNamePrefix("Scheduler");
        threadPoolTaskScheduler.initialize();
        this.taskScheduler = threadPoolTaskScheduler;
        this.appConfigProps = appConfigProps;
    }

    @Bean
    public void runExpiredUserSessionRemovalTaskRunnable() {
        PeriodicTrigger periodicTrigger =
                new PeriodicTrigger(Duration.ofMinutes(appConfigProps.getSessionExpirationSchedulingDelayInMinutes()));
        taskScheduler.schedule(new ExpiredUserSessionRemovalTaskRunnable(userSessionService), periodicTrigger);
    }
}
