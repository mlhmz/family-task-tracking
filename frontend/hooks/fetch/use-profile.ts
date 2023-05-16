import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { toSvg } from "jdenticon";

import { Profile } from "@/types/profile";

async function fetchProfile() {
  const response = await fetch("/api/v1/profiles/profile");
  const profile = (await response.json()) as Profile;
  return {
    ...profile,
    status: response.status,
  };
}

function getJdenticonImageUrlFromUuid(uuid?: string) {
  if (uuid) {
    const svgString = toSvg(uuid, 100, {backColor: "#ffffff"});
    const baseString = Buffer.from(
      decodeURIComponent(encodeURIComponent(svgString)),
    ).toString("base64");
    return `data:image/svg+xml;base64,${baseString}`;
  } else {
    return "";
  }
}

export const useProfile = () => {
  const [profileInstance, setProfileInstance] = useState({} as Profile);
  const { data, error } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  useEffect(() => {
    if (data) {
      setProfileInstance({ ...data, imageUrl: getJdenticonImageUrlFromUuid(data.uuid) });
    }
  }, [data, error]);

  return {
    profileInstance,
  };
};
