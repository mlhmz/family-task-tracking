"use client";

import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { Task } from "@/types/task";
import { TaskState } from "@/types/task-state";
import { isTasks } from "@/lib/guards";
import { getRewards } from "@/lib/reward-requests";
import { DashboardSkeleton } from "@/components/ui/skeleton/dashboard-skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { RewardCard } from "./reward-card";
import { TaskCard } from "./task-card";

async function getTasks() {
  const response = await fetch("/api/v1/tasks");

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
  inReview: Task[];
  expiringSoon: Task[];
}

const PrivilegedDashboard = () => {
  const [filteredTasks, setFilteredTasks] = useState<FilteredTasks>({ inReview: [], expiringSoon: [] });
  const { data: tasks, isLoading: isTasksLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getTasks(),
  });
  const { data: rewards, isLoading: isRewardsLoading } = useQuery({
    queryKey: ["rewards", "redeemed"],
    queryFn: () => getRewards("redeemed:true"),
  });

  useEffect(() => {
    if (!tasks) return;
    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const inReview = tasks.filter((task) => task.taskState === TaskState.Done);
    const expiringSoon = tasks.filter((task) => task.expirationAt && new Date(task.expirationAt) < in24Hours);
    setFilteredTasks({ inReview, expiringSoon });
    console.log(tasks);
  }, [tasks]);

  if (isTasksLoading || isRewardsLoading) return <DashboardSkeleton />;

  return (
    <Tabs defaultValue="review" className="w-full">
      <TabsList className="h-auto flex-col items-start p-2 sm:h-10 sm:flex-row sm:items-center sm:p-1">
        <TabsTrigger value="review">Ready for review</TabsTrigger>
        <TabsTrigger value="expiringSoon">Expiring soon</TabsTrigger>
        <TabsTrigger value="rewards">Redeemed rewards</TabsTrigger>
      </TabsList>
      <TabsContent value="review">
        <div className="flex w-full flex-wrap gap-4">
          {filteredTasks.inReview?.map((task) => (
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

export default PrivilegedDashboard;
