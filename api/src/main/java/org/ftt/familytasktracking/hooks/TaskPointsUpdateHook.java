package org.ftt.familytasktracking.hooks;

import org.ftt.familytasktracking.entities.Task;
import org.ftt.familytasktracking.enums.TaskState;

public class TaskPointsUpdateHook implements TaskUpdateHook {
    @Override
    public void executeUpdateHook(Task updateTask, Task targetTask, boolean safe) {
        givePointsForTaskReviewed(targetTask);
    }

    public void givePointsForTaskReviewed(Task targetTask) {
        if (TaskState.REVIEWED == targetTask.getTaskState()) {
            Integer points = targetTask.getAssignee().getPoints() + targetTask.getPoints();
            targetTask.getAssignee().setPoints(points);
        }
    }

}
