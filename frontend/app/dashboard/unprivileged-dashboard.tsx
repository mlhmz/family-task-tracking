"use client";

import { useContext, useEffect, useState } from "react";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useQuery } from "@tanstack/react-query";

import { Task } from "@/types/task";
import { TaskState } from "@/types/task-state";
import { isTasks } from "@/lib/guards";
import { getRewards } from "@/lib/reward-requests";
import { DashboardSkeleton } from "@/components/ui/skeleton/dashboard-skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ProfileContext } from "../profile-context";
import { RewardCard } from "./reward-card";
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
  finished: Task[];
  expiringSoon: Task[];
}

const UnprivilegedDashboard = () => {
  const [allTasksParent] = useAutoAnimate();
  const [undoneParent] = useAutoAnimate();

  const { data: profile } = useContext(ProfileContext);
  const [filteredTasks, setFilteredTasks] = useState<FilteredTasks>({
    undone: [],
    done: [],
    finished: [],
    expiringSoon: [],
  });
  const { data: tasks, isLoading: isTasksLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getTasks(profile?.uuid),
    enabled: !!profile?.uuid,
  });
  const { data: rewards, isLoading: isRewardsLoading } = useQuery({
    queryKey: ["rewards", "not_redeemed"],
    queryFn: () => getRewards("redeemed:false"),
  });

  useEffect(() => {
    if (!tasks) return;
    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const undone = tasks.filter((task) => task.taskState === TaskState.Undone);
    const done = tasks.filter((task) => task.taskState === TaskState.Done);
    const finished = tasks.filter((task) => task.taskState === TaskState.Finished);
    const expiringSoon = tasks.filter((task) => task.expirationAt && new Date(task.expirationAt) < in24Hours);
    setFilteredTasks({ undone, done, finished, expiringSoon });
  }, [tasks]);

  if (isTasksLoading) return <DashboardSkeleton />;

  return (
    <Tabs defaultValue="allTasks" className="w-full">
      <TabsList className="h-auto flex-col items-start p-2 sm:h-10 sm:flex-row sm:items-center sm:p-1">
        <TabsTrigger value="allTasks">All Tasks</TabsTrigger>
        <TabsTrigger value="undone">To Do</TabsTrigger>
        <TabsTrigger value="done">Done</TabsTrigger>
        <TabsTrigger value="finished">Finished</TabsTrigger>
        <TabsTrigger value="expiringSoon">Expiring soon</TabsTrigger>
        <TabsTrigger value="rewards">Rewards</TabsTrigger>
      </TabsList>
      <TabsContent value="allTasks">
        <div className="flex w-full flex-wrap gap-4" ref={allTasksParent}>
          {tasks?.map((task) => (
            <TaskCard key={task.uuid} task={task} />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="undone">
        {" "}
        <div className="flex w-full flex-wrap gap-4" ref={undoneParent}>
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
      <TabsContent value="rewards">
        <div className="flex w-full flex-wrap gap-4">
          {rewards?.map((reward) => (
            <RewardCard key={reward.uuid} reward={reward} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default UnprivilegedDashboard;
