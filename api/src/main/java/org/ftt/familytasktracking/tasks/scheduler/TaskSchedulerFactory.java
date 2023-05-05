package org.ftt.familytasktracking.tasks.scheduler;

/**
 * Factory for the TaskScheduler
 */
public class TaskSchedulerFactory {
    private static TaskSchedulerFactory instance;

    public static TaskSchedulerFactory getInstance() {
        if (instance == null) {
            instance = new TaskSchedulerFactory();
        }
        return instance;
    }

    /**
     * Gets the TaskScheduler by the SchedulerMode
     *
     * @param mode {@link SchedulerMode} that shall be used
     * @return {@link TaskScheduler} or null, if the Mode {@link SchedulerMode#DEACTIVATED} was selected
     * or an unimplemented one.
     */
    public TaskScheduler getBySchedulerMode(SchedulerMode mode) {
        return switch (mode) {
            case CRON -> new CronTaskScheduler();
            case MILLI_INTERVAL -> new MilliIntervalTaskScheduler();
            default -> null;
        };
    }
}
