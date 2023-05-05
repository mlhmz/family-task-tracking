package org.ftt.familytasktracking.tasks.scheduler;

/**
 * Enum for the Scheduler Mode
 */
public enum SchedulerMode {
    /**
     * Cron uses a Cron Expression for resolving Execution Dates
     */
    CRON,
    /**
     * Milli Interval uses an actual Milli Interval for resolving Execution Dates
     */
    MILLI_INTERVAL,
    /**
     * Deactivates the Scheduler
     */
    DEACTIVATED
}
