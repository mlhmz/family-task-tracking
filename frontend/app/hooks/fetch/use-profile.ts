"use client";

import { useQuery } from "@tanstack/react-query";

import { getProfile } from "@/lib/profile-requests";
import { useAuth } from "react-oidc-context";

/**
 * Fetches a profile by uuid if provided else by the session id
 */
export const useProfile = (uuid?: string) => {
  const { isAuthenticated } = useAuth();
  const qKey = uuid ? ["profile", { uuid: uuid }] : ["profile"];
  return useQuery({
    queryKey: qKey,
    queryFn: () => getProfile(uuid),
    enabled: isAuthenticated,
    retry: 1,
  });
};
