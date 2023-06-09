"use client";

import { useContext, useState } from "react";
import Link from "next/link";

import { DialogTrigger } from "@radix-ui/react-dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

import { PermissionType } from "@/types/permission-type";
import { Task } from "@/types/task";
import { getTranslatedTaskStateValue } from "@/types/task-state";
import { isTask } from "@/lib/guards";
import { deleteTask, getTasks } from "@/lib/task-requests";
import { formatISODateToReadable } from "@/lib/utils";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ProfileShowcase from "@/components/common/profile/profile-showcase";
import { Icons } from "@/components/icons";
import { useZodForm } from "@/app/hooks/use-zod-form";
import { ProfileContext } from "@/app/profile-context";
import TaskFilterMenu from "@/app/tasks/task-filter-menu";
import RedeemRewardButton from "../rewards/redeem-reward-button";
import RedeemTaskButton from "./redeem-task-button";

import AssignTaskButton from "./assign-task-button";
import TaskCreateForm from "./task-create-form";
import DataTableSkeleton from "@/components/ui/skeleton/data-table-skeleton";

interface SearchQuery {
  name?: string;
}

const schema = z.object({
  name: z.string().optional(),
});

export default function TaskDataTable() {
  const [searchQuery, setSearchQuery] = useState({ query: [""] });
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [hasOpenDeleteConfirmation, setHasOpenDeleteConfirmation] = useState(false);
  const [hasOpenCreationDialog, setHasOpenCreationDialog] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
  const { data: profile } = useContext(ProfileContext);
  const { register, handleSubmit } = useZodForm({ schema });
  const { mutateAsync: mutateAsyncDelete, isLoading: isDeleteLoading } = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries(["tasks"]),
  });
  const { data, isLoading: isSearchLoading } = useQuery({
    queryKey: ["tasks", searchQuery],
    queryFn: () => getTasks(searchQuery.query),
    initialData: [],
  });
  const queryClient = useQueryClient();

  const isChecked = (task: Task) => selectedTasks.some((selectedTask) => selectedTask.uuid === task.uuid);

  const isEveryTaskChecked = () => {
    return selectedTasks == data;
  };

  const onCheckedChange = (task: Task) => {
    if (isChecked(task)) {
      setSelectedTasks(selectedTasks.filter((entry) => entry.uuid !== task.uuid));
    } else {
      setSelectedTasks([...selectedTasks, task]);
    }
  };

  const onEveryTaskCheckedChange = () => {
    if (isEveryTaskChecked()) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(data);
    }
  };

  const onSearchSubmit = (formData: SearchQuery) => {
    setSearchQuery({ query: [] });

    if (!formData.name) {
      return;
    }

    let queries = [`name:${formData.name}`];

    if (profile?.permissionType !== PermissionType.Admin && profile?.uuid) {
      queries.push(`assignee.uuid:${profile.uuid}`);
    }

    formData.name && setSearchQuery({ query: queries });
  };

  const resetAfterDelete = () => {
    setSelectedTasks([]);
    queryClient.invalidateQueries(["tasks", searchQuery]);
  };

  const deleteEverySelectedTask = () => {
    if (selectedTasks.length === 0) {
      toast(`Please select at least one task.`);
      return;
    }
    const deletePromises = selectedTasks.map((task) => mutateAsyncDelete(task.uuid ?? ""));
    toast.promise(Promise.all(deletePromises), {
      loading: `Deleting ${selectedTasks.length} task(s)...`,
      success: () => {
        resetAfterDelete();
        return `${selectedTasks.length} task(s) were successfully deleted.`;
      },
      error: (responses: Response[]) => {
        resetAfterDelete();
        const failedDeletions = responses.filter((response) => !response.ok).length;
        const allRequestedDeletions = responses.length;
        return `${failedDeletions} from ${allRequestedDeletions} task(s) couldn't be deleted, please try again.`;
      },
    });
  };

  if (!profile || profile.permissionType !== PermissionType.Admin) {
    return <DataTableSkeleton />
  }
  return (
    <div>
      <div className="my-2 flex gap-2">
        <form onSubmit={handleSubmit(onSearchSubmit)} className="grow">
          <Input placeholder="Search by Name..." {...register("name")} />
        </form>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="ghost">
                {isSearchLoading ? <Icons.spinner className="animate-spin text-primary" /> : <Icons.search />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Trigger search</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="ghost" onClick={() => setShowFilterMenu(!showFilterMenu)}>
                <Icons.filter />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Show filter menu</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {profile?.permissionType === PermissionType.Admin && (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Dialog
                    open={hasOpenCreationDialog}
                    onOpenChange={() => setHasOpenCreationDialog(!hasOpenCreationDialog)}>
                    <DialogTrigger>
                      <Button variant="ghost">
                        <Icons.taskPlus />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>Create a task</DialogHeader>
                      <TaskCreateForm handleCloseDialog={() => setHasOpenCreationDialog(false)} />
                    </DialogContent>
                  </Dialog>
                </TooltipTrigger>
                <TooltipContent>Create task</TooltipContent>
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
                        <AlertDialogTitle>Delete task(s)</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete the selected task(s)?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={deleteEverySelectedTask}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TooltipTrigger>
                <TooltipContent>Delete task(s)</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}
      </div>
      {showFilterMenu && <TaskFilterMenu sendQuery={(query) => setSearchQuery({ query: [query] })} />}
      <div className="rounded-md outline outline-1 outline-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">
                <div className="grid place-items-center">
                  <Checkbox checked={isEveryTaskChecked()} onCheckedChange={onEveryTaskCheckedChange} />
                </div>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>State</TableHead>
              <TableHead className="text-center">Assignee</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((task) => (
              <TableRow key={task.uuid}>
                <TableCell>
                  <div className="grid place-items-center">
                    <Checkbox checked={isChecked(task)} onCheckedChange={() => onCheckedChange(task)} />
                  </div>
                </TableCell>
                <TableCell>
                  <p>{task.name}</p>
                </TableCell>
                <TableCell>{task.points}</TableCell>
                <TableCell>{task.createdAt && formatISODateToReadable(task.createdAt)}</TableCell>
                <TableCell>{task.updatedAt && formatISODateToReadable(task.updatedAt)}</TableCell>
                <TableCell>{task.taskState && getTranslatedTaskStateValue(task.taskState)}</TableCell>
                <TableCell>
                  {task.assigneeUuid && <ProfileShowcase profileUuid={task.assigneeUuid} />}
                </TableCell>
                <TableCell>
                  <div className="m-auto flex items-center justify-center gap-1">
                    <Button variant="ghost">
                      <Link href={`/tasks/task/${task.uuid}`}>
                        <Icons.externalLink />
                      </Link>
                    </Button>
                    <AssignTaskButton task={task} />
                    <RedeemTaskButton task={task} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
