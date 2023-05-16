"use client";

import { useProfile } from "@/hooks/fetch/use-profile";
import { ProfileResponse } from "@/types/profile";
import React, { createContext } from "react";

export interface ProfileContextProps {
    children: React.ReactNode;
}

export interface ProfileContextContent {
    profileInstance: ProfileResponse
}

export const ProfileContext = createContext<ProfileContextContent>({} as ProfileContextContent);

export default function ProfileContextProvider({ children }: ProfileContextProps) {
    const { profileInstance } = useProfile();

    return (
        <ProfileContext.Provider value={{profileInstance}}>{ children }</ProfileContext.Provider>
    )
}