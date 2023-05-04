package org.ftt.familytasktracking.hooks;

import org.ftt.familytasktracking.entities.Task;
import org.ftt.familytasktracking.enums.TaskState;

import java.time.LocalDateTime;

public class TaskUpdateDoneHook implements TaskUpdateHook {
    @Override
    public void executeUpdateHook(Task updateTask, Task targetTask, boolean safe) {
        if (targetTask.getDoneAt() == null && targetTask.getTaskState().equals(TaskState.DONE))
            targetTask.setDoneAt(LocalDateTime.now());
    }
}
