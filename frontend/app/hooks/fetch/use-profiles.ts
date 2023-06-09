"use client";

import { useQuery } from "@tanstack/react-query";

import { getProfiles } from "@/lib/profile-requests";
import { useSession } from "next-auth/react";

export const useProfiles = () => {
  const { status } = useSession();
  return useQuery({
    queryKey: ["profiles"],
    queryFn: () => getProfiles({}),
    enabled: status === "authenticated",
    initialData: [],
  });
};
