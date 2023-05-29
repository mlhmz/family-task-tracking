"use client";

import { useQuery } from "@tanstack/react-query";

import { isProfiles } from "@/lib/guards";

async function fetchProfiles() {
  const response = await fetch("/api/v1/profiles");
  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching profile data");
  }
  const profiles = await response.json();
  if (!isProfiles(profiles)) throw new Error("Problem fetching profile data");
  return profiles;
}

export const useProfiles = () => {
  return useQuery({
    queryKey: ["profiles"],
    queryFn: fetchProfiles,
    initialData: [],
  });
};
