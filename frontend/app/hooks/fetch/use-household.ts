"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useQuery } from "@tanstack/react-query";

import { isHouseholdResponse } from "@/lib/guards";
import { useAuth } from "react-oidc-context";

async function fetchHousehold() {
  const response = await fetch("/api/v1/household");
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("No household");
    }
  }
  const household = await response.json();
  if (!isHouseholdResponse(household)) throw new Error("Problem fetching data");
  return household;
}

export const useHousehold = () => {
  const [isHouseholdEmpty, setIsHouseholdEmpty] = useState(false);
  const { isAuthenticated } = useAuth();
  const { data, error } = useQuery({
    queryKey: ["household"],
    queryFn: fetchHousehold,
    enabled: isAuthenticated,
    retry: false,
  });

  const router = useRouter();

  useEffect(() => {
    if (data) {
      setIsHouseholdEmpty(false);
    }
    if (error && error instanceof Error && error.message == "No household") {
      setIsHouseholdEmpty(true);
    }
  }, [data, error, setIsHouseholdEmpty, router]);

  return {
    isHouseholdEmpty,
    household: data,
  };
};
