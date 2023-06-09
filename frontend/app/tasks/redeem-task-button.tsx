import { Tooltip } from "@radix-ui/react-tooltip";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { PermissionType } from "@/types/permission-type";
import { Task, TaskRequest, TaskStateUpdateRequest } from "@/types/task";
import { TaskState } from "@/types/task-state";
import { isTask } from "@/lib/guards";
import { Button } from "@/components/ui/button";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TaskStateIcon } from "@/components/common/task/task-state-icon";
import { Icons } from "@/components/icons";

import { useProfile } from "../hooks/fetch/use-profile";
import { updateTaskState } from "@/lib/task-requests";

export default function RedeemTaskButton({ task }: { task: Task }) {
  const { data: currentProfile } = useProfile();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: (taskStateUpdateRequest: TaskStateUpdateRequest) => updateTaskState(taskStateUpdateRequest, task.uuid),
    onSuccess: () => {
      queryClient.invalidateQueries(["task", { uuid: task.uuid }]);
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  const getTooltipContentByStatus = () => {
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
  };

  const getIconByStatus = () => {
    if (task.taskState === TaskState.Undone) {
      return <TaskStateIcon taskState={TaskState.Done} />;
    } else if (task.taskState === TaskState.Done && currentProfile?.permissionType === PermissionType.Admin) {
      return <TaskStateIcon taskState={TaskState.Finished} />;
    } else {
      return <Icons.x />;
    }
  };

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
    task.taskState === TaskState.Finished
  ) {
    return <Button className="cursor-default- h-[40px] w-[56px] opacity-0" variant="ghost"></Button>;
  }
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Button variant="ghost" className="cursor-pointer" onClick={(event) => redeem(event)}>
            {isLoading ? <Icons.spinner className="animate-spin" /> : getIconByStatus()}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{getTooltipContentByStatus()}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
