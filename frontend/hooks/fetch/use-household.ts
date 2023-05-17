"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { assertIsHouseholdResponse } from "@/lib/guards";

async function fetchHousehold() {
  const response = await fetch("/api/v1/household");
  if (!response.ok) {
    if (response.status == 404) {
      throw new Error("No household");
    }
  }
  const household = await response.json();
  assertIsHouseholdResponse(household);
  return household;
}

export const useHousehold = () => {
  const [isHouseholdEmpty, setIsHouseholdEmpty] = useState(false);
  const { status } = useSession();
  const { data, error } = useQuery({
    queryKey: ["household"],
    queryFn: fetchHousehold,
    enabled: status === "authenticated",
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
