package org.ftt.familytasktracking.config;

import org.ftt.familytasktracking.tasks.scheduler.CronTaskScheduler;
import org.ftt.familytasktracking.tasks.scheduler.TaskScheduler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class TaskSchedulerProviderConfig {
    private final CronTaskScheduler taskScheduler;

    public TaskSchedulerProviderConfig(CronTaskScheduler taskScheduler) {
        this.taskScheduler = taskScheduler;
    }

    /**
     * Returns the default TaskScheduler, because the Component-Annotation won't provide
     * one on interface injection
     *
     * @return {@link TaskScheduler}
     */
    @Primary
    @Bean
    public TaskScheduler getTaskScheduler() {
        return taskScheduler;
    }
}
