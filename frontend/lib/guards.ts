"use client";

import { HouseholdResponse } from "@/types/household";

export function assertIsHouseholdResponse(response: any): asserts response is HouseholdResponse {
  if (!response) {
    throw new Error("HouseholdResponse is undefined");
  }
  if (typeof response !== "object") {
    throw new Error("HouseholdResponse is not an object");
  }
  if (response.uuid && typeof response.uuid !== "string") {
    throw new Error("HouseholdResponse.uuid is not a string");
  }
  if (response.householdName && typeof response.householdName !== "string") {
    throw new Error("HouseholdResponse.householdName is not a string");
  }
  if (response.createdAt && typeof response.createdAt !== "string") {
    throw new Error("HouseholdResponse.createdAt is not a string");
  }
  if (response.updatedAt && typeof response.updatedAt !== "string") {
    throw new Error("HouseholdResponse.updatedAt is not a string");
  }
}
