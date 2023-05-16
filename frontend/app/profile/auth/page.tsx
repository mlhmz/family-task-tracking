"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";


import ProfileSelector from "@/components/profile-selector";
import { Profile } from "@/types/profile";

async function fetchProfiles() {
  const response = await fetch("/api/v1/profiles");
  const profiles = (await response.json()) as Profile[];
  return profiles;
}

export default function ProfileAuth() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetch() {
      const data = await fetchProfiles();
      setProfiles(data);
    }
    fetch();
  }, [setProfiles]);

  return (
    <div className="m-auto my-5 flex w-full flex-col gap-2">
      <h1 className="text-center text-2xl font-bold">Select a Profile</h1>
      <div className="m-auto flex flex-row flex-wrap justify-center gap-2">
        {profiles.map((profile) => (
          <ProfileSelector profile={profile} />
        ))}
      </div>
    </div>
  );
}
