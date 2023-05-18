"use client";

import { ReactNode, useCallback, useContext, useEffect } from "react";

import { usePathname, useRouter } from "next/navigation";

import { PermissionType } from "@/types/permission-type";

import { HouseholdContext } from "./household-context";
import { ProfileContext } from "./profile-context";
import { ProfilesContext } from "./profiles-context";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const household = useContext(HouseholdContext);
  const profile = useContext(ProfileContext);
  const profiles = useContext(ProfilesContext);
  const router = useRouter();
  const pathName = usePathname();

  const isAnyAdminProfileAvailable = useCallback(() => {
    if (Array.isArray(profiles.data)) {
      return profiles.data?.some((profile) => profile.permissionType === PermissionType.Admin);
    } else {
      return true;
    }
  }, [profiles]);

  useEffect(() => {
    if (!pathName.match("/wizard.*")) {
      if (household.isHouseholdEmpty) {
        router.push("/wizard");
      } else if (!isAnyAdminProfileAvailable()) {
        router.push("/wizard/2");
      } else if (!pathName.match("/profile/select.*")) {
        if (profile.isError) {
          router.push("/profile/select");
        } else if (
          profile.data?.permissionType === PermissionType.Admin &&
          !profile.data?.passwordProtected &&
          !pathName.match("/profile/select.*")
        ) {
          router.push("/wizard/3");
        }
      }
    }
  }, [household, isAnyAdminProfileAvailable, profile, profiles, router, pathName]);

  return <>{children}</>;
}
