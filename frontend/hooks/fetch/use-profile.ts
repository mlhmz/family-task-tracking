"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { assertIsProfile } from "@/lib/guards";

async function fetchProfile(uuid?: string) {
  const response = await fetch(`/api/v1/profiles/${uuid ?? "profile"}`);

  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }

  const profile = await response.json();
  assertIsProfile(profile);
  return profile;
}

export const useProfile = (uuid?: string) => {
  const { status } = useSession();
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => fetchProfile(uuid),
    enabled: status === "authenticated",
  });
};
