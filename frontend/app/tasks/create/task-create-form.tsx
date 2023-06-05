"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { TaskRequest } from "@/types/task";
import { TaskState, getTranslatedTaskStateValue } from "@/types/task-state";
import { isTask } from "@/lib/guards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Icons } from "@/components/icons";
import { useZodForm } from "@/app/hooks/use-zod-form";

async function createTask(request: TaskRequest) {
  const response = await fetch("/api/v1/admin/tasks", {
    method: "POST",
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }

  const task = await response.json();
  if (!isTask(task)) throw new Error("Problem fetching data");
  return task;
}

const hours = z.object({
  activated: z.boolean().default(false),
  value: z.number().min(0).max(24),
});

const days = z.object({
  activated: z.boolean().default(false),
  value: z.number().min(0).max(31),
});

const months = z.object({
  activated: z.boolean().default(false),
  value: z.number().min(0).max(12),
});

const schedulingSchema = z.object({
  hours: hours,
  days: days,
  months: months,
  activated: z.boolean(),
});

const taskSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1).max(255).optional(),
  points: z.number().optional(),
  taskState: z.enum([TaskState.Done, TaskState.Undone, TaskState.Finished, TaskState.Reviewed]).optional(),
});

const schema = z.object({
  task: taskSchema,
  scheduling: schedulingSchema,
});

export default function TaskCreateForm() {
  const { register, handleSubmit, formState, setValue, getValues } = useZodForm({
    schema,
    defaultValues: {
      task: { points: 0 },
      scheduling: {
        hours: { value: 0 },
        days: { value: 0 },
        months: { value: 0 },
      },
    },
  });
  const { mutate, error, isLoading } = useMutation({
    mutationFn: createTask,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["tasks"]);
      router.push(`/tasks/task/${data.uuid}`);
    },
  });
  const [isSchedulingActivated, setIsSchedulingActivated] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const buildCronExpressionFromInput = (scheduling: z.infer<typeof schedulingSchema>): string => {
    if (!scheduling.activated) {
      return "";
    }
    const expressionArray = ["0", "*", "*", "*", "*"];
    const [hours, days, months] = [scheduling.hours, scheduling.days, scheduling.months];

    if (!hours.activated && (days.activated || months.activated)) {
      expressionArray[1] = "0";
    } else if (hours.activated && hours.value != 0) {
      expressionArray[1] = `*/${scheduling.hours.value}`;
    }

    if (!days.activated && months.activated) {
      expressionArray[2] = "0";
    } else if (days.activated && days.value != 0) {
      expressionArray[2] = `*/${scheduling.days.value}`;
    }

    if (months.activated && months.value != 0) {
      expressionArray[3] = `*/${scheduling.months.value}`;
    }

    return expressionArray.join(" ");
  };

  const onSubmit = (formData: z.infer<typeof schema>) => {
    const task = {
      ...formData.task,
      scheduled: formData.scheduling.activated,
      cronExpression: buildCronExpressionFromInput(formData.scheduling),
    } as TaskRequest;
    mutate({ ...task });
  };

  return (
    <div>
      <form className="flex flex-col gap-10" onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={isLoading} className="flex flex-col items-center gap-10">
          <Input placeholder="Name" {...register("task.name")} />
          <Input placeholder="Description" {...register("task.description")} />
          <Input placeholder="Points" type="number" {...register("task.points", { valueAsNumber: true })} />

          <Select
            defaultValue={TaskState.Undone}
            onValueChange={(value) => setValue("task.taskState", value as TaskState)}>
            <SelectTrigger>
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(TaskState).map((taskState) => (
                <SelectItem key={taskState} value={taskState}>
                  {getTranslatedTaskStateValue(taskState)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Switch
              onCheckedChange={(value: boolean) => {
                setValue("scheduling.activated", value);
                setIsSchedulingActivated(value);
              }}
            />
            <p>Scheduled</p>
          </div>

          {isSchedulingActivated && (
            <Card>
              <CardHeader>Scheduling</CardHeader>
              <CardContent>
                <div className="flex flex-row gap-5">
                  <div className="flex flex-col items-center gap-2">
                    <p>Every</p>
                    <Input
                      type="number"
                      placeholder="0..24"
                      max={24}
                      {...register("scheduling.hours.value", { valueAsNumber: true })}
                    />
                    <p>Hours</p>
                    <Switch
                      onCheckedChange={(value: boolean) => setValue("scheduling.hours.activated", value)}
                    />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <p>Every</p>
                    <Input
                      type="number"
                      placeholder="1..31"
                      max={31}
                      {...register("scheduling.days.value", { valueAsNumber: true })}
                    />
                    <p>Days</p>
                    <Switch
                      onCheckedChange={(value: boolean) => setValue("scheduling.days.activated", value)}
                    />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <p>Every</p>
                    <Input
                      type="number"
                      placeholder="1..12"
                      max={12}
                      {...register("scheduling.months.value", { valueAsNumber: true })}
                    />
                    <p>Months</p>
                    <Switch
                      onCheckedChange={(value: boolean) => setValue("scheduling.months.activated", value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Button type="submit">
            {isLoading ? <Icons.spinner className="animate-spin text-secondary" /> : <>Save</>}
          </Button>
          {Object.entries(formState.errors).map(([key, value]) => (
            <p className="text-destructive" key={key}>
              {value.message}
            </p>
          ))}
          <>{error && error instanceof Error && <p className="text-destructive">{error.message}</p>}</>
        </fieldset>
      </form>
    </div>
  );
}
