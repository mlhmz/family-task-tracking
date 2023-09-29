"use client";

import { ReactNode, useCallback, useContext, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";

import { PermissionType } from "@/types/permission-type";

import { HouseholdContext } from "./household-context";
import { ProfileContext } from "./profile-context";
import { ProfilesContext } from "./profiles-context";
import { useAuth } from "react-oidc-context";
import { useCookie } from "react-use";
import { toast } from "sonner";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const household = useContext(HouseholdContext);
  const profile = useContext(ProfileContext);
  const profiles = useContext(ProfilesContext);
  const router = useRouter();
  const pathName = usePathname();
  const queryClient = useQueryClient();
  const { isAuthenticated, user, error } = useAuth();
  const [_, setToken] = useCookie("token");

  // Temporary solution because react-oidc-context is storing the cookie into the session store
  useEffect(() => {
    if (isAuthenticated && user) {
      setToken(user.access_token)
    }
  }, [isAuthenticated, setToken, user])

  useEffect(() => {
    error && toast.error(`Error while authenticating: ${error.message}`)
  }, [error])

  const isAnyAdminProfileAvailable = useCallback(() => {
    queryClient.invalidateQueries(["profiles"]).then(() => {
      if (profiles.isFetched && !profiles.isError) {
        return profiles.data?.some((profile) => profile.permissionType === PermissionType.Admin);
      }
    });
    return true;
  }, [profiles, queryClient]);

  useEffect(() => {
    if (!pathName.match("/wizard.*")) {
      if (household.isHouseholdEmpty) {
        router.push("/wizard");
      } else if (!isAnyAdminProfileAvailable()) {
        router.push("/wizard/2");
      } else if (!pathName.match("/profile/select.*")) {
        if (profiles.isFetched && !profiles.isError && profile.isError) {
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
