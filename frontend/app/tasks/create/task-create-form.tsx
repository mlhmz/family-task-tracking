"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { TaskRequest } from "@/types/task";
import { getTranslatedTaskStateValue, TaskState } from "@/types/task-state";
import { isTask } from "@/lib/guards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
<<<<<<< HEAD
=======
import { Switch } from "@/components/ui/switch";
>>>>>>> 6125cbc (Prototype scheduling card)
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

const schema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1).max(255).optional(),
  points: z.number().optional(),
  taskState: z.enum([TaskState.Done, TaskState.Undone, TaskState.Finished, TaskState.Reviewed]).optional(),
});

export default function TaskCreateForm() {
  const { register, handleSubmit, formState, setValue } = useZodForm({
    schema,
    defaultValues: { points: 0 },
  });
  const { mutate, error, isLoading } = useMutation({
    mutationFn: createTask,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["tasks"]);
      router.push(`/tasks/task/${data.uuid}`);
    },
  });
  const [scheduled, setScheduled] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const onSubmit = (formData: TaskRequest) => mutate({ ...formData });

  return (
    <div>
      <form className="flex flex-col gap-10" onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={isLoading} className="flex flex-col items-center gap-10">
          <Input placeholder="Name" {...register("name")} />
          <Input placeholder="Description" {...register("description")} />
          <Input placeholder="Points" type="number" {...register("points", { valueAsNumber: true })} />

          <Select
            defaultValue={TaskState.Undone}
            onValueChange={(value) => setValue("taskState", value as TaskState)}>
            <SelectTrigger>
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(TaskState).map((taskState) => (
                <SelectItem value={taskState}>{getTranslatedTaskStateValue(taskState)}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Switch onCheckedChange={() => setScheduled(!scheduled)} checked={scheduled} />
            <p>Scheduled</p>
          </div>

          {scheduled && (
            <Card>
              <CardHeader>Scheduling</CardHeader>
              <CardContent>
                <div className="flex flex-row gap-5">
                  <div className="flex flex-col items-center gap-2">
                    <p>Every</p>
                    <Input type="number" placeholder="0..24" max={24} />
                    <p>Hours</p>
                    <Switch />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <p>Every</p>
                    <Input type="number" placeholder="1..31" max={31} />
                    <p>Days</p>
                    <Switch />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <p>Every</p>
                    <Input type="number" placeholder="1..12" max={12} />
                    <p>Months</p>
                    <Switch />
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
