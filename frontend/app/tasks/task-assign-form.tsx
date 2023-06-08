"use client";

import { Dispatch } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Avatar from "boring-avatars";
import { toast } from "sonner";
import { z } from "zod";

import { TaskRequest } from "@/types/task";
import { isTask } from "@/lib/guards";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Icons } from "@/components/icons";

import { useProfiles } from "../hooks/fetch/use-profiles";
import { useZodForm } from "../hooks/use-zod-form";

async function updateTaskAssignee(request: TaskRequest, uuid?: string) {
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
  assigneeUuid: z.string().uuid().or(z.string().max(0)),
});

export default function TaskAssignForm({
  taskUuid,
  handleAssignSuccess,
}: {
  taskUuid?: string;
  handleAssignSuccess: Dispatch<void>;
}) {
  const { handleSubmit, setValue } = useZodForm({ schema, defaultValues: { assigneeUuid: "" } });
  const { data: profiles } = useProfiles();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: (data: TaskRequest) => updateTaskAssignee(data, taskUuid),
    onSuccess: () => {
      queryClient.invalidateQueries(["task", { uuid: taskUuid }]);
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  const onSubmit = (taskRequest: TaskRequest) =>
    mutate(
      { ...taskRequest },
      {
        onSuccess: () => {
          toast.success("Task assignee updated");
          handleAssignSuccess();
        },
        onError: (error) => {
          toast.error(`Error creating profile: ${error instanceof Error ? error.message : "Unknown error"}`);
        },
      },
    );

  if (!taskUuid) return <></>;
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
              <SelectItem value={""} className="cursor-pointer">
                <div className="ml-2 flex gap-5 py-2">
                  <Icons.userCircle className="h-auto w-[32px]" />
                  <p className="flex items-center">None</p>
                </div>
              </SelectItem>
              <>
                {profiles?.map(
                  (profile) =>
                    profile.uuid && (
                      <SelectItem value={profile?.uuid} key={profile?.uuid} className="cursor-pointer">
                        <div className="ml-2 flex gap-5 py-2">
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
