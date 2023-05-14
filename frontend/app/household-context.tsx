"use client";

import { createContext, useEffect } from "react";

import { useRouter } from "next/navigation";

import { useHousehold } from "@/hooks/fetch/use-household";
import { LoadingScreen } from "@/components/loading-screen";

export interface HouseholdContextProps {
  children: React.ReactNode;
}

export interface HouseholdContextContent {
  householdResponse: HouseholdResponse;
  isHouseholdEmpty: boolean;
}

export const HouseholdContext = createContext<HouseholdContextContent>({} as HouseholdContextContent);

export default function HouseholdContextProvider({ children }: HouseholdContextProps) {
  const { isHouseholdFetched, household, isHouseholdEmpty } = useHousehold();
  const router = useRouter();

  useEffect(() => {
    console.log(household);
    isHouseholdEmpty && router.push("/wizard");
  }, [household, isHouseholdEmpty, router]);

  return isHouseholdFetched ? (
    <HouseholdContext.Provider
      value={{
        householdResponse: household,
        isHouseholdEmpty: isHouseholdEmpty,
      }}>
      {children}
    </HouseholdContext.Provider>
  ) : (
    <LoadingScreen textContent="Fetching household..." />
  );
}
