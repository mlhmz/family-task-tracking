import { useEffect, useState } from "react";

import { ProfileResponse } from "@/types/profile";
import { useQuery } from "@tanstack/react-query";

async function fetchProfile() {
  const response = await fetch("/api/v1/profiles/profile");
  const profile = (await response.json()) as ProfileResponse;
  return {
    ...profile,
    status: response.status,
  };
}

export const useProfile = () => {
  const [profileInstance, setProfileInstance] = useState({} as ProfileResponse);
  const { data, error } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  })

  useEffect(() => {
    if (data) {
      setProfileInstance(data);
    }
  }, [data, error]);

  return {
    profileInstance,
  };
};
