"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Avatar from "boring-avatars";
import { z } from "zod";

import { TaskRequest } from "@/types/task";
import { isTask } from "@/lib/guards";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Icons } from "@/components/icons";

import { useProfiles } from "../hooks/fetch/use-profiles";
import { useZodForm } from "../hooks/use-zod-form";
import { toast } from "sonner";

async function updateTaskAssignee(request: TaskRequest, uuid: string) {
  const response = await fetch(`/api/v1/admin/tasks/${uuid}/assignee`, {
    method: "PATCH",
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
  assigneeUuid: z.string().uuid(),
});

export default function TaskAssignForm({ taskUuid }: { taskUuid: string }) {
  const { handleSubmit, setValue } = useZodForm({ schema });
  const { data: profiles } = useProfiles();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: (data: TaskRequest) => updateTaskAssignee(data, taskUuid),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks", { uuid: taskUuid }]);
    },
  });

  const onSubmit = (taskRequest: TaskRequest) => mutate({ ...taskRequest }, {
    onSuccess: () => {
      toast.success("Task assignee updated");
    },
    onError: (error) => {
      toast.error(`Error creating profile: ${error instanceof Error ? error.message : "Unknown error"}`);
    },
  });

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="flex flex-col items-center gap-5">
          <Select
            onValueChange={(value) => {
              setValue("assigneeUuid", value);
            }}>
            <SelectTrigger>
              <SelectValue placeholder="Select a Assignee..." />
            </SelectTrigger>
            <SelectContent>
              <>
                {profiles?.map(
                  (profile) =>
                    profile.uuid && (
                      <SelectItem value={profile?.uuid} key={profile?.uuid}>
                        <div className="flex flex-row gap-5">
                          <Avatar
                            size={32}
                            name={profile?.uuid}
                            variant="beam"
                            colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
                          />
                          <p className="flex items-center">{profile?.name}</p>
                        </div>
                      </SelectItem>
                    ),
                )}
              </>
            </SelectContent>
          </Select>
          <Button type="submit">
            {isLoading ? <Icons.spinner className="animate-spin text-secondary" /> : <>Assign</>}
          </Button>
        </fieldset>
      </form>
    </div>
  );
}
