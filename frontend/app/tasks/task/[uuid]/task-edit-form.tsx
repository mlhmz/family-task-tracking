"use client";

import { Dispatch, useState } from "react";
import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

import { createOrEditTaskSchema, schedulingSchema, Task, TaskRequest } from "@/types/task";
import { getTranslatedTaskStateValue, TaskState } from "@/types/task-state";
import { updateTask } from "@/lib/task-requests";
import { buildCronExpressionFromInput } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Icons } from "@/components/icons";
import { useZodForm } from "@/app/hooks/use-zod-form";

interface TaskEditFormProps {
  task: Task;
  handleCloseDialog: Dispatch<void>;
}

const schema = z.object({
  task: createOrEditTaskSchema,
  scheduling: schedulingSchema,
});

export default function TaskEditForm({ task, handleCloseDialog }: TaskEditFormProps) {
  const { register, handleSubmit, formState, setValue } = useZodForm({
    schema,
    defaultValues: {
      task: { ...task },
      scheduling: {
        activated: false,
        hours: { value: 0 },
        days: { value: 0 },
        months: { value: 0 },
      },
    },
  });
  const { mutate, error, isLoading } = useMutation({
    mutationFn: updateTask,
    onSuccess: () => queryClient.invalidateQueries(["tasks"]),
  });
  const [isSchedulingActivated, setIsSchedulingActivated] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const onSubmit = (formData: z.infer<typeof schema>) => {
    const taskRequest = {
      ...formData.task,
      scheduled: formData.scheduling.activated,
      cronExpression: buildCronExpressionFromInput(formData.scheduling),
    } satisfies TaskRequest;
    mutate(
      { request: taskRequest, uuid: task.uuid },
      {
        onSuccess: (task) => {
          toast.success(`The task '${task.name}' was updated!`, {
            action: {
              label: "View",
              onClick: () => router.push(`/tasks/task/${task.uuid}`),
            },
          });
          handleCloseDialog();
        },
      },
    );
  };

  return (
    <div>
      <form className="flex flex-col gap-10" onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={isLoading} className="flex flex-col items-center gap-10">
          <Input placeholder="Name" {...register("task.name")} />
          <Input placeholder="Description" {...register("task.description")} />
          <Input placeholder="Points" type="number" {...register("task.points", { valueAsNumber: true })} />
          <Input placeholder="Expiration At" type="datetime-local" {...register("task.expirationAt")} />

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
