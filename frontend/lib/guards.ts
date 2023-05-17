"use client";

import { HouseholdResponse } from "@/types/household";
import { Profile } from "@/types/profile";

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

export function assertIsProfile(response: any): asserts response is Profile {
  if (!response) {
    throw new Error("Profile is undefined");
  }
  if (typeof response !== "object") {
    throw new Error("Profile is not an object");
  }
  if (response.uuid && typeof response.uuid !== "string") {
    throw new Error("Profile.uuid is not a string");
  }
  if (response.sessionId && typeof response.sessionId !== "string") {
    throw new Error("Profile.sessionId is not a string");
  }
  if (response.name && typeof response.name !== "string") {
    throw new Error("Profile.name is not a string");
  }
  if (response.points && typeof response.points !== "number") {
    throw new Error("Profile.points is not a number");
  }
  if (response.permissionType && typeof response.permissionType !== "string") {
    throw new Error("Profile.permissionType is not a string");
  }
  if (response.passwordProtected && typeof response.passwordProtected !== "boolean") {
    throw new Error("Profile.passwordProtected is not a boolean");
  }
}
