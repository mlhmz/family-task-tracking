"use client";

import { useContext, useEffect } from "react";

import { ProfileSelectSkeleton } from "@/components/ui/skeleton/profile-select-skeleton";

import { useLogoutProfile } from "@/app/hooks/use-logout-profile";
import { ProfilesContext } from "@/app/profiles-context";

import ProfileSelector from "./profile-selector";

export default function ProfileAuth() {
  const { data } = useContext(ProfilesContext);
  const { logoutProfile } = useLogoutProfile();

  useEffect(() => {
    logoutProfile();
  }, [logoutProfile]);

  if (!data) {
    return <ProfileSelectSkeleton />;
  }
  return (
    <div className="m-auto my-5 flex w-full flex-col gap-2">
      <h1 className="text-center text-2xl font-bold">Select a Profile</h1>
      <div className="flex flex-wrap justify-center gap-2">
        {Array.isArray(data) &&
          data?.map((profile) => <ProfileSelector profile={profile} key={profile.uuid} />)}
      </div>
    </div>
  );
}
