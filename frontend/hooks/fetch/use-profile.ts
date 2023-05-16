
import { useQuery } from "@tanstack/react-query";

import { Profile } from "@/types/profile";

async function fetchProfile() {
  const response = await fetch("/api/v1/profiles/profile");
  const profile = (await response.json()) as Profile;
  return {
    ...profile,
    status: response.status,
  };
}

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });
};
