"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { getProfiles } from "@/lib/profile-requests";

export const useProfiles = () => {
  const { status } = useSession();
  return useQuery({
    queryKey: ["profiles"],
    queryFn: () => getProfiles({}),
    enabled: status === "authenticated",
    initialData: [],
  });
};
