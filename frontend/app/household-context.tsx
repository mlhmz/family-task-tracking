"use client";

import { createContext, useEffect } from "react";

import { useRouter } from "next/navigation";

import { HouseholdResponse } from "@/types/household";

import { useHousehold } from "@/hooks/fetch/use-household";

export interface HouseholdContextProps {
  children: React.ReactNode;
}

export interface HouseholdContextContent {
  household?: HouseholdResponse;
  isHouseholdEmpty: boolean;
}

export const HouseholdContext = createContext<HouseholdContextContent>({} as HouseholdContextContent);

export default function HouseholdContextProvider({ children }: HouseholdContextProps) {
  const { household, isHouseholdEmpty } = useHousehold();

  return (
    <HouseholdContext.Provider
      value={{
        household: household,
        isHouseholdEmpty: isHouseholdEmpty,
      }}>
      {children}
    </HouseholdContext.Provider>
  );
}
