"use client";

import { useQuery } from "@tanstack/react-query";

import { getProfiles } from "@/lib/profile-requests";
import { useAuth } from "react-oidc-context";

export const useProfiles = () => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ["profiles"],
    queryFn: () => getProfiles({}),
    enabled: isAuthenticated,
    initialData: [],
  });
};
