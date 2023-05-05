package org.ftt.familytasktracking.tasks.scheduler;

/**
 * Enum for the Scheduler Mode
 */
public enum SchedulerMode {
    /**
     * Cron uses a Cron Expression for resolving Execution Dates
     */
    CRON {
        @Override
        public TaskScheduler createScheduler() {
            return new CronTaskScheduler();
        }
    },
    /**
     * Milli Interval uses an actual Milli Interval for resolving Execution Dates
     */
    MILLI_INTERVAL {
        @Override
        public TaskScheduler createScheduler() {
            return new MilliIntervalTaskScheduler();
        }
    },
    /**
     * Deactivates the Scheduler
     */
    DEACTIVATED {
        @Override
        public TaskScheduler createScheduler() {
            return null;
        }
    };

    public abstract TaskScheduler createScheduler();
}
