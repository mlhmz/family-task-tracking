"use client";

import { useContext, useMemo, useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { PermissionType } from "@/types/permission-type";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import InfoPageSkeleton from "@/components/ui/skeleton/info-page-skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TaskStateIcon } from "@/components/common/task/task-state-icon";
import { Icons } from "@/components/icons";
import { useTask } from "@/app/hooks/fetch/use-task";
import { ProfileContext } from "@/app/profile-context";

import TaskEditForm from "./task-edit-form";
import TaskInfo from "./task-info";
import { useRouter } from "next/navigation";
import { deleteTask } from "@/lib/task-requests";
import { toast } from "sonner";

export default function TaskDetailPage({ params }: { params: { uuid: string } }) {
  const { data: task } = useTask(params.uuid);
  const { data: profileInstance } = useContext(ProfileContext);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: mutateDelete, isLoading: isDeleteLoading } = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => router.push("/tasks"),
  });

  const onDelete = () => {
    mutateDelete(params.uuid, { onSuccess: () => toast.success(`The task was successfully deleted`) });
  };

  const isAdmin = useMemo(() => profileInstance?.permissionType === PermissionType.Admin, [profileInstance]);

  if (!task) return <InfoPageSkeleton />;

  return (
    <div className="mx-2 mt-5 flex flex-col gap-5 lg:mx-auto lg:w-1/3">
      <h1 className="text-2xl font-bold">Task</h1>
      <div className="grid grid-cols-1 grid-rows-1">
        <div id="title" className="flex flex-row items-center justify-start gap-3">
          <h2 className="col-start-1 justify-self-start text-2xl">{task?.name}</h2>
          <TaskStateIcon taskState={task?.taskState} />
        </div>
        <div id="actions" className="col-start-2">
          {isAdmin && (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="ghost">
                          <Icons.edit />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>Edit Task</DialogHeader>
                        <TaskEditForm
                          task={task}
                          handleCloseDialog={() => {
                            queryClient.invalidateQueries(["task", { uuid: params.uuid }]);
                            setIsEditDialogOpen(false);
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                  </TooltipTrigger>
                  <TooltipContent>Edit Task</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost">
                          {isDeleteLoading ? <Icons.spinner className="animate-spin" /> : <Icons.trash />}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Task</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this task?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={onDelete}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TooltipTrigger>
                  <TooltipContent>Delete Task</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}
        </div>
      </div>
      <TaskInfo task={task} />
    </div>
  );
}