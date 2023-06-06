"use client";

import { useQuery } from "@tanstack/react-query";

import { getProfiles } from "@/lib/profile-requests";

export const useProfiles = () => {
  return useQuery({
    queryKey: ["profiles"],
    queryFn: () => getProfiles({}),
    initialData: [],
  });
};
