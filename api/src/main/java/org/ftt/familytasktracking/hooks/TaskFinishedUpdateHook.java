package org.ftt.familytasktracking.hooks;

import org.ftt.familytasktracking.entities.Task;
import org.ftt.familytasktracking.enums.TaskState;

public class TaskFinishedUpdateHook implements TaskUpdateHook {

    @Override
    public void executeUpdateHook(Task updateTask, Task targetTask, boolean safe) {
        if (TaskState.REVIEWED == targetTask.getTaskState()) {
            targetTask.setTaskState(TaskState.FINISHED);
        }
    }
}
