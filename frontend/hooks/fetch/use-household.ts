"use client";

import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { HouseholdResponse } from "@/types/household";

import { assertIsHouseholdResponse } from "@/lib/guards";

async function fetchHousehold() {
  const response = await fetch("/api/v1/household");
  if (!response.ok) {
    if (response.status == 204) {
      throw new Error("No content");
    }
  }
  const household = await response.json();
  assertIsHouseholdResponse(household);
  return household;
}

export const useHousehold = () => {
  const [household, setHousehold] = useState({} as HouseholdResponse);
  const [isHouseholdEmpty, setIsHouseholdEmpty] = useState(false);
  const { data, error } = useQuery({
    queryKey: ["household"],
    queryFn: fetchHousehold,
  });

  useEffect(() => {
    if (data) {
      setHousehold(data);
      setIsHouseholdEmpty(false);
    }
    if (error && error instanceof Error && error.message == "No content") {
      setIsHouseholdEmpty(true);
    }
  }, [data, error]);

  return {
    isHouseholdEmpty,
    household,
  };
};
