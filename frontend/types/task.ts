import { TaskState } from "@/types/task-state";

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
  scheduled?: boolean;
  cronExpression?: string;
  expirationAt?: string;
  assigneeUuid?: string;
}
