"use client";

import { useProfile } from "@/hooks/fetch/use-profile";
import React, { createContext } from "react";

export interface ProfileContextProps {
    children: React.ReactNode;
}

type ProfileContextContent = ReturnType<typeof useProfile>;

export const ProfileContext = createContext<ProfileContextContent>({} as ProfileContextContent);

export default function ProfileContextProvider({ children }: ProfileContextProps) {
    const data = useProfile();

    return (
        <ProfileContext.Provider value={data}>{ children }</ProfileContext.Provider>
    )
}