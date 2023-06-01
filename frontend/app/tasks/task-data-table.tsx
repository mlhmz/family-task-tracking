"use client";

import { useContext, useState } from "react";

import Link from "next/link";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Avatar from "boring-avatars";
import { z } from "zod";
import { Task } from "@/types/task";

import { isTask } from "@/lib/guards";
import { formatISODateToReadable } from "@/lib/utils";

import { Icons } from "@/components/icons";
import TaskFilterMenu from "@/app/tasks/task-filter-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getTranslatedTaskStateValue } from "@/types/task-state";

import { useZodForm } from "@/app/hooks/use-zod-form";
import { ProfileContext } from "@/app/profile-context";
import { PermissionType } from "@/types/permission-type";

async function getTasks({ query }: { query: string[] }) {
  const request = new URLSearchParams({
    query: query.join(","),
  });
  const response = await fetch(`/api/v1/tasks${"?" + request}`);
  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }
  const tasks = (await response.json()) as Task[];
  return tasks.filter(isTask);
}

async function deleteTask(uuid: string) {
  const response = await fetch(`/api/v1/admin/tasks/${uuid}`, { method: "DELETE" });
  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }
  return response;
}

interface SearchQuery {
  name?: string;
}

const schema = z.object({
  name: z.string().optional(),
});

export default function TaskDataTable() {
  const [searchQuery, setSearchQuery] = useState({ query: [""] });
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
  const { data: profile } = useContext(ProfileContext);
  const { register, handleSubmit } = useZodForm({ schema });
  const { mutate: mutateDelete, isLoading: isDeleteLoading } = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries(["tasks"]),
  });
  const { data, isLoading: isSearchLoading } = useQuery({
    queryKey: ["tasks", searchQuery],
    queryFn: () => getTasks({ query: searchQuery.query }),
    initialData: [],
  });
  const queryClient = useQueryClient();


  const isChecked = (task: Task) =>
    selectedTasks.some((selectedTask) => selectedTask.uuid === task.uuid);

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

  const deleteEverySelectedTask = () => {
    selectedTasks.forEach((task) => mutateDelete(task.uuid ?? ""));
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSearchSubmit)}>
        <div className="my-2 flex gap-2">
          <Input placeholder="Search by Name..." {...register("name")} />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button variant="ghost">
                  {isSearchLoading ? <Icons.spinner className="animate-spin text-primary" /> : <Icons.search />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Search by name</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button variant="ghost" onClick={() => setShowFilterMenu(!showFilterMenu)}>
                  <Icons.filter />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Show filters</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {profile?.permissionType === PermissionType.Admin &&
            <Link href="/tasks/create">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button variant="ghost">
                      <Icons.taskPlus />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Add task</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Link>}
          {profile?.permissionType === PermissionType.Admin &&
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="ghost" onClick={deleteEverySelectedTask}>
                    {isDeleteLoading ? <Icons.spinner className="animate-spin text-primary" /> : <Icons.trash />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete task</TooltipContent>
              </Tooltip>
            </TooltipProvider>}
        </div>
      </form>
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
              <TableHead className="w-[60px]">&nbsp;</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead className="text-center">State</TableHead>
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
                  <Link
                    className="inline cursor-pointer rounded-full bg-secondary hover:brightness-90"
                    href={`/tasks/task/${task.uuid}`}>
                    <Avatar
                      size={32}
                      name={task.uuid}
                      variant="beam"
                      colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
                    />
                  </Link>
                </TableCell>
                <TableCell>
                  <p>{task.name}</p>
                </TableCell>
                <TableCell>{task.points}</TableCell>
                <TableCell>{task.createdAt && formatISODateToReadable(task.createdAt)}</TableCell>
                <TableCell>{task.updatedAt && formatISODateToReadable(task.updatedAt)}</TableCell>
                <TableCell>{task.taskState && getTranslatedTaskStateValue(task.taskState)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
