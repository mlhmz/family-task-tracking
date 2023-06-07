"use client";

import { useContext, useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { Task } from "@/types/task";
import { TaskState } from "@/types/task-state";
import { isTasks } from "@/lib/guards";
import { DashboardSkeleton } from "@/components/ui/skeleton/dashboard-skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ProfileContext } from "../profile-context";
import { TaskCard } from "./task-card";

async function getTasks(uuid?: string) {
  const query = new URLSearchParams(uuid ? { query: `assignee.uuid:${uuid}` } : undefined);
  const response = await fetch(`/api/v1/tasks?${query}`);

  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }

  const tasks = await response.json();
  if (!isTasks(tasks)) throw new Error("Problem fetching data");
  return tasks;
}

interface FilteredTasks {
  undone: Task[];
  done: Task[];
  reviewed: Task[];
  finished: Task[];
  expiringSoon: Task[];
}

const UnprivilegedDashboard = () => {
  const { data: profile } = useContext(ProfileContext);
  const [filteredTasks, setFilteredTasks] = useState<FilteredTasks>({
    undone: [],
    done: [],
    reviewed: [],
    finished: [],
    expiringSoon: [],
  });
  const { data: tasks, isLoading: isTasksLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getTasks(profile?.uuid),
    enabled: !!profile?.uuid,
  });

  useEffect(() => {
    if (!tasks) return;
    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const undone = tasks.filter((task) => task.taskState === TaskState.Undone);
    const done = tasks.filter((task) => task.taskState === TaskState.Done);
    const reviewed = tasks.filter((task) => task.taskState === TaskState.Reviewed);
    const finished = tasks.filter((task) => task.taskState === TaskState.Finished);
    const expiringSoon = tasks.filter((task) => task.expirationAt && new Date(task.expirationAt) < in24Hours);
    setFilteredTasks({ undone, done, reviewed, finished, expiringSoon });
  }, [tasks]);

  if (isTasksLoading) return <DashboardSkeleton />;

  return (
    <Tabs defaultValue="allTasks" className="w-full">
      <TabsList>
        <TabsTrigger value="allTasks">All</TabsTrigger>
        <TabsTrigger value="undone">To Do</TabsTrigger>
        <TabsTrigger value="done">Done</TabsTrigger>
        <TabsTrigger value="reviewed">In review</TabsTrigger>
        <TabsTrigger value="finished">Finished</TabsTrigger>
        <TabsTrigger value="expiringSoon">Expiring soon</TabsTrigger>
      </TabsList>
      <TabsContent value="allTasks">
        <div className="flex w-full flex-wrap gap-4">
          {tasks?.map((task) => (
            <TaskCard key={task.uuid} task={task} />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="undone">
        {" "}
        <div className="flex w-full flex-wrap gap-4">
          {filteredTasks.undone?.map((task) => (
            <TaskCard key={task.uuid} task={task} />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="done">
        <div className="flex w-full flex-wrap gap-4">
          {filteredTasks.done?.map((task) => (
            <TaskCard key={task.uuid} task={task} />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="reviewed">
        <div className="flex w-full flex-wrap gap-4">
          {filteredTasks.reviewed?.map((task) => (
            <TaskCard key={task.uuid} task={task} />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="finished">
        <div className="flex w-full flex-wrap gap-4">
          {filteredTasks.finished?.map((task) => (
            <TaskCard key={task.uuid} task={task} />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="expiringSoon">
        <div className="flex w-full flex-wrap gap-4">
          {filteredTasks.expiringSoon?.map((task) => (
            <TaskCard key={task.uuid} task={task} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default UnprivilegedDashboard;