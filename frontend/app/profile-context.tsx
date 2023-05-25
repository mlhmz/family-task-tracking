"use client";

import { ReactNode, createContext, useContext, useEffect } from "react";

import { useProfile } from "@/app/hooks/fetch/use-profile";

export interface ProfileContextProps {
  children: ReactNode;
}

type ProfileContextContent = ReturnType<typeof useProfile>;

export const ProfileContext = createContext<ProfileContextContent>({} as ProfileContextContent);

export default function ProfileContextProvider({ children }: ProfileContextProps) {
  const data = useProfile();

  return <ProfileContext.Provider value={data}>{children}</ProfileContext.Provider>;
}
