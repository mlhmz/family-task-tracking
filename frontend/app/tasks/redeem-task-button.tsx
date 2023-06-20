import { useMemo } from "react";

import { Tooltip } from "@radix-ui/react-tooltip";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { PermissionType } from "@/types/permission-type";
import { Task, TaskStateUpdateRequest } from "@/types/task";
import { TaskState } from "@/types/task-state";
import { isTask } from "@/lib/guards";
import { updateTaskState } from "@/lib/task-requests";
import { Button } from "@/components/ui/button";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { iconsMap } from "@/components/common/task/task-state-icon";
import { Icons } from "@/components/icons";

import { useProfile } from "../hooks/fetch/use-profile";

const GhostButton = () => {
  return <Button className="cursor-default- h-[40px] w-[56px] opacity-0" variant="ghost"></Button>;
};

export default function RedeemTaskButton({ task }: { task: Task }) {
  const { data: currentProfile } = useProfile();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: (taskStateUpdateRequest: TaskStateUpdateRequest) =>
      updateTaskState(taskStateUpdateRequest, task.uuid),
    onSuccess: () => {
      queryClient.invalidateQueries(["task", { uuid: task.uuid }]);
      queryClient.invalidateQueries(["profile"]);
      queryClient.invalidateQueries(["profiles"]);
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  const tooltipContent = useMemo(() => {
    if (task.taskState === TaskState.Undone) {
      return <>Complete Task</>;
    } else if (
      task.taskState === TaskState.Done &&
      currentProfile?.permissionType === PermissionType.Member
    ) {
      return <>Revert Task Completion</>;
    } else if (task.taskState === TaskState.Done && currentProfile?.permissionType === PermissionType.Admin) {
      return <>Confirm Task Completion</>;
    } else {
      return <>Not available</>;
    }
  }, [task, currentProfile]);

  const taskStateIcon = useMemo(() => {
    if (task.taskState === TaskState.Undone) {
      return iconsMap[TaskState.Done];
    } else if (task.taskState === TaskState.Done && currentProfile?.permissionType === PermissionType.Admin) {
      return iconsMap[TaskState.Finished];
    } else {
      return <GhostButton />;
    }
  }, [task, currentProfile]);

  const taskHasAssignee = useMemo(() => {
    return isTask(task) && task.assigneeUuid !== null;
  }, [task]);

  const redeem = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    if (task.taskState === TaskState.Undone) {
      mutate(
        { taskState: TaskState.Done, safe: true },
        {
          onSuccess: () => {
            toast.success("Task completed successfully!");
          },
          onError: (error) =>
            toast.error(`Error completing task: ${error instanceof Error ? error.message : "Unknown error"}`),
        },
      );
    } else if (task.taskState === TaskState.Done && currentProfile?.permissionType === PermissionType.Admin) {
      if (!taskHasAssignee) {
        toast.error("Task has no assignee!");
        return;
      }
      mutate(
        { taskState: TaskState.Reviewed, safe: false },
        {
          onSuccess: () => {
            toast.success("Task reviewed successfully!");
          },
          onError: (error) =>
            toast.error(`Error reviewing task: ${error instanceof Error ? error.message : "Unknown error"}`),
        },
      );
    }
  };

  if (
    (task.taskState !== TaskState.Undone && currentProfile?.permissionType !== PermissionType.Admin) ||
    task.taskState === TaskState.Finished ||
    task.taskState === TaskState.Reviewed
  ) {
    return <GhostButton />;
  }
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Button variant="ghost" className="cursor-pointer" onClick={(event) => redeem(event)}>
            {isLoading ? <Icons.spinner className="animate-spin" /> : taskStateIcon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{tooltipContent}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
