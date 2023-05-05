package org.ftt.familytasktracking.tasks.scheduler;

public class TaskSchedulerFactory {
    private static TaskSchedulerFactory instance;

    public static TaskSchedulerFactory getInstance() {
        if (instance == null) {
            instance = new TaskSchedulerFactory();
        }
        return instance;
    }

    public TaskScheduler getBySchedulerMode(SchedulerMode mode) {
        return switch (mode) {
            case CRON -> new CronTaskScheduler();
            case MILLI_INTERVAL -> new MilliIntervalTaskScheduler();
            default -> null;
        };
    }
}
