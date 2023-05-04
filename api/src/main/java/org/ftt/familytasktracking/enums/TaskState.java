package org.ftt.familytasktracking.enums;

/**
 * The task state defines, if a task is unfinished, done or accepted.
 */
public enum TaskState {
    /**
     * Task is not done yet.
     */
    UNDONE,
    /**
     * Task is done but not reviewed
     */
    DONE,
    /**
     * Task is done and reviewed
     */
    REVIEWED,
    /**
     * Task is done, reviewed and points are granted
     */
    FINISHED
}
