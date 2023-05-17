import { Profile } from "@/types/profile";
import { useQuery } from "@tanstack/react-query";

async function fetchProfiles() {
  const response = await fetch("/api/v1/profiles");
  const profiles = (await response.json()) as Profile[];
  return profiles;
}

export const useProfiles = () => {
  return useQuery({
    queryKey: ["profiles"],
    queryFn: fetchProfiles
  });
}
