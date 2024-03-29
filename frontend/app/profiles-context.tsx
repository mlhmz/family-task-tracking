"use client";

import { createContext, ReactNode } from "react";

import { useProfiles } from "@/app/hooks/fetch/use-profiles";

export interface ProfilesContextProps {
  children: ReactNode;
}

type ProfilesContextContent = ReturnType<typeof useProfiles>;

export const ProfilesContext = createContext<ProfilesContextContent>({} as ProfilesContextContent);

export default function ProfilesContextProvider({ children }: ProfilesContextProps) {
  const data = useProfiles();

  return <ProfilesContext.Provider value={data}>{children}</ProfilesContext.Provider>;
}
