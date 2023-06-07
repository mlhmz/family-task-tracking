"use client";

import { useQuery } from "@tanstack/react-query";

import { getTask } from "@/lib/task-requests";

export const useTask = (uuid: string) => {
  return useQuery({
    queryKey: ["task", { uuid: uuid }],
    queryFn: () => getTask(uuid),
    retry: 1,
  });
};
