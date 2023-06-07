import { z } from "zod";

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
  scheduled?: boolean;
  cronExpression?: string;
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

export const hourSchema = z.object({
  activated: z.boolean().default(false),
  value: z.number().min(0).max(24),
});

export const daySchema = z.object({
  activated: z.boolean().default(false),
  value: z.number().min(0).max(31),
});

export const monthSchema = z.object({
  activated: z.boolean().default(false),
  value: z.number().min(0).max(12),
});

export const schedulingSchema = z.object({
  hours: hourSchema,
  days: daySchema,
  months: monthSchema,
  activated: z.boolean(),
});

export const createOrEditTaskSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1).max(255).optional(),
  points: z.number().optional(),
  taskState: z.enum([TaskState.Done, TaskState.Undone, TaskState.Finished, TaskState.Reviewed]).optional(),
  expirationAt: z.string().optional(),
});
