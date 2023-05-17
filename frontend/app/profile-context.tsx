"use client";

import { ReactNode, createContext, useContext, useEffect } from "react";

import { useRouter } from "next/navigation";

import { PermissionType } from "@/types/permission-type";

import { useProfile } from "@/hooks/fetch/use-profile";

import { HouseholdContext } from "./household-context";

export interface ProfileContextProps {
  children: ReactNode;
}

type ProfileContextContent = ReturnType<typeof useProfile>;

export const ProfileContext = createContext<ProfileContextContent>({} as ProfileContextContent);

export default function ProfileContextProvider({ children }: ProfileContextProps) {
  const data = useProfile();

  return <ProfileContext.Provider value={data}>{children}</ProfileContext.Provider>;
}
