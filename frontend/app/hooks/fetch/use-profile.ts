"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { isProfile } from "@/lib/guards";

async function fetchProfile(uuid?: string) {
  const response = await fetch(`/api/v1/profiles/${uuid ? uuid : "profile"}`);

  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }

  const profile = await response.json();
  if (!isProfile(profile)) throw new Error("Problem fetching data");
  return profile;
}

/**
 * Fetches a profile by uuid if provided else by the session id
 */
export const useProfile = (uuid?: string) => {
  const { status } = useSession();
  const qKey = uuid ? ["profile", { uuid: uuid }] : ["profile"];
  return useQuery({
    queryKey: qKey,
    queryFn: () => fetchProfile(uuid),
    enabled: status === "authenticated",
    retry: 1,
  });
};
