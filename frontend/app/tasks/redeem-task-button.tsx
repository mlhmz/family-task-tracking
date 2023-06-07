import { Tooltip } from "@radix-ui/react-tooltip";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { PermissionType } from "@/types/permission-type";
import { Task, TaskRequest } from "@/types/task";
import { TaskState } from "@/types/task-state";
import { isTask } from "@/lib/guards";
import { Button } from "@/components/ui/button";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Icons } from "@/components/icons";

import { useProfile } from "../hooks/fetch/use-profile";

async function updateTaskState(redeemPayload: RedeemPayload, uuid?: string) {
  const request: TaskRequest = {
    taskState: redeemPayload.taskState,
  };
  const response = await fetch(`/api/v1/${!redeemPayload.safe ? "admin/" : ""}tasks/${uuid}`, {
    method: "PUT",
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }
  const content = await response.json()
  if (!isTask(content)) throw new Error("Problem fetching data");
  return content;
}

interface RedeemPayload {
  taskState: TaskState;
  safe: boolean;
}

export default function RedeemTaskButton({ task }: { task: Task }) {
  const { data: currentProfile } = useProfile();
  const { mutate, isLoading } = useMutation({
    mutationFn: (redeemPayload: RedeemPayload) => updateTaskState(redeemPayload, task.uuid),
  });
  const privilegedStates = [TaskState.Finished, TaskState.Reviewed];

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
      return <Icons.checkCircle />;
    } else if (
      task.taskState === TaskState.Done &&
      currentProfile?.permissionType === PermissionType.Member
    ) {
      return <Icons.x />;
    } else if (task.taskState === TaskState.Done && currentProfile?.permissionType === PermissionType.Admin) {
      return <Icons.checkCircle />;
    } else {
      return <Icons.x />;
    }
  };

  const redeem = () => {
    if (task.taskState === TaskState.Undone) {
      mutate(
        { taskState: TaskState.Done, safe: true },
        {
          onSuccess: () => {
            toast.success("Task completed successfully!");
          },
          onError: (error) =>
            toast.error(
              `Error redeeming reward: ${error instanceof Error ? error.message : "Unknown error"}`,
            ),
        },
      );
    } else if (
      task.taskState === TaskState.Done &&
      currentProfile?.permissionType === PermissionType.Member
    ) {
      mutate({ taskState: TaskState.Undone, safe: true });
    } else if (task.taskState === TaskState.Done && currentProfile?.permissionType === PermissionType.Admin) {
      mutate({ taskState: TaskState.Reviewed, safe: false });
    }
  };

  const isRedeemButtonForPrivileged = () => {
    return (
      privilegedStates.some((state) => task.taskState === state) || task.assigneeUuid !== currentProfile?.uuid
    );
  };

  if (!isRedeemButtonForPrivileged() && currentProfile?.permissionType !== PermissionType.Admin) {
    return <></>;
  }
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Button variant="ghost" onClick={redeem}>
            {isLoading ? <Icons.spinner className="animate-spin" /> : getIconByStatus()}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{getTooltipContentByStatus()}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
