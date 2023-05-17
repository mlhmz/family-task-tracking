"use client";

import { ReactNode, useCallback, useContext, useEffect } from "react";

import { useRouter } from "next/navigation";

import { PermissionType } from "@/types/permission-type";

import { HouseholdContext } from "./household-context";
import { ProfileContext } from "./profile-context";
import { ProfilesContext } from "./profiles-context";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const household = useContext(HouseholdContext);
  const profile = useContext(ProfileContext);
  const profiles = useContext(ProfilesContext);
  const router = useRouter();

  const isAnyAdminProfileAvailable = useCallback(() => {
    const bool = profiles.data?.some((profile) => profile.permissionType == PermissionType.Admin);
    console.log(bool);
    return bool;
  }, [profiles]);

  useEffect(() => {
    if (household.isHouseholdEmpty) {
      console.log("Household empty");
      router.push("/wizard");
    } else if (!isAnyAdminProfileAvailable) {
      console.log("No admin");
      router.push("/wizard/2");
    } else if (profile.isError) {
      console.log("No bitches");
      router.push("/profile/select");
    } else if (profile.data?.permissionType === PermissionType.Admin && !profile.data?.passwordProtected) {
      console.log("No password");
      router.push("/wizard/3");
    }
  }, [household, isAnyAdminProfileAvailable, profile, profiles, router]);

  return <>{children}</>;
}
