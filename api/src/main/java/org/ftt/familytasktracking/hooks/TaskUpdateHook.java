package org.ftt.familytasktracking.hooks;

import org.ftt.familytasktracking.entities.Task;

public interface TaskUpdateHook {
    void executeUpdateHook(Task updateTask, Task targetTask);
}
