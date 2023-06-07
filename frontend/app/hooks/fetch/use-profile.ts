"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { getProfile } from "@/lib/profile-requests";

/**
 * Fetches a profile by uuid if provided else by the session id
 */
export const useProfile = (uuid?: string) => {
  const { status } = useSession();
  const qKey = uuid ? ["profile", { uuid: uuid }] : ["profile"];
  return useQuery({
    queryKey: qKey,
    queryFn: () => getProfile(uuid),
    enabled: status === "authenticated",
    retry: 1,
  });
};
