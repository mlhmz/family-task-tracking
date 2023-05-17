import { useQuery } from "@tanstack/react-query";

import { Profile } from "@/types/profile";

async function fetchProfile(uuid?: string) {
  const response = await fetch(`/api/v1/profiles/${uuid ?? "profile"}`);
  const profile = (await response.json()) as Profile;
  return {
    ...profile,
    status: response.status,
  };
}

export const useProfile = (uuid?: string) => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => fetchProfile(uuid),
  });
};
