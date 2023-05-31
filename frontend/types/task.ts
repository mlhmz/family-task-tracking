import {TaskState} from "@/types/task-state";
import {SchedulerMode} from "@/types/scheduler-mode";

export interface Task {
  uuid?: string;
  name?: string;
  description?: string;
  points?: number;
  createdAt?: string;
  updatedAt?: string;
  expirationAt?: string;
  doneAt?: string;
  nextTaskCreationAt?: string;
  taskState?: TaskState;
  assigneeUuid?: string;
}

export interface TaskRequest {
  name?: string;
  description?: string;
  points?: number;
  taskState?: TaskState;
  schedulerMode?: SchedulerMode;
  cronExpression?: string;
  intervalMillis?: number;
  assigneeUuid?: string;
}
