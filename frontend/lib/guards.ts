"use client";

import { HouseholdResponse } from "@/types/household";
import { PermissionType } from "@/types/permission-type";
import { Profile, ProfileAuthResponse } from "@/types/profile";

// This is a hack to add hasOwnProperty to Object
declare global {
  interface Object {
    hasOwnProperty<K extends string>(key: K): this is Record<K, unknown>;
  }
}

// Parser is a function which takes unknown and returns T or null
type Parser<T> = (val: unknown) => T | null;

// createTypeGuard is a function which takes a parser and returns a new function
// The returned function is a safe type guard for T
const createTypeGuard =
  <T>(parse: Parser<T>) =>
  (value: unknown): value is T => {
    // By assuming that parser returns only T or null
    // We can say that value from parser is T when it is not a null
    return parse(value) !== null;
  };

const parsePermissionType = (value: unknown): PermissionType | null => {
  if (typeof value === "string" && (value === "ADMIN" || value === "MEMBER")) {
    return value as PermissionType;
  }
  return null;
};

export const isPermissionType = createTypeGuard<PermissionType>(parsePermissionType);

const parseHouseholdResponse = (value: unknown): HouseholdResponse | null => {
  if (
    typeof value === "object" &&
    value &&
    value.hasOwnProperty("uuid") &&
    value.hasOwnProperty("householdName") &&
    value.hasOwnProperty("createdAt") &&
    value.hasOwnProperty("updatedAt")
  ) {
    return {
      uuid: typeof value.uuid === "string" ? value.uuid : undefined,
      householdName: typeof value.householdName === "string" ? value.householdName : undefined,
      createdAt: typeof value.createdAt === "string" ? value.createdAt : undefined,
      updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : undefined,
    };
  }
  return null;
};

export const isHouseholdReponse = createTypeGuard<HouseholdResponse>(parseHouseholdResponse);

const parseProfile = (value: unknown): Profile | null => {
  if (
    typeof value === "object" &&
    value &&
    value.hasOwnProperty("uuid") &&
    value.hasOwnProperty("name") &&
    value.hasOwnProperty("points") &&
    value.hasOwnProperty("permissionType") &&
    value.hasOwnProperty("passwordProtected") &&
    value.hasOwnProperty("createdAt") &&
    value.hasOwnProperty("updatedAt")
  ) {
    return {
      uuid: typeof value.uuid === "string" ? value.uuid : undefined,
      name: typeof value.name === "string" ? value.name : undefined,
      points: typeof value.points === "number" ? value.points : undefined,
      permissionType: isPermissionType(value.permissionType) ? value.permissionType : undefined,
      passwordProtected: typeof value.passwordProtected === "boolean" ? value.passwordProtected : undefined,
      createdAt: typeof value.createdAt === "string" ? value.createdAt : undefined,
      updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : undefined,
    };
  }
  return null;
};

export const isProfile = createTypeGuard<Profile>(parseProfile);

const parseProfileAuthResponse = (value: unknown): ProfileAuthResponse | null => {
  if (
    typeof value === "object" &&
    value &&
    value.hasOwnProperty("sessionId") &&
    value.hasOwnProperty("profileId") &&
    value.hasOwnProperty("expiresAt")
  ) {
    return {
      sessionId: typeof value.sessionId === "string" ? value.sessionId : undefined,
      profileId: typeof value.profileId === "string" ? value.profileId : undefined,
      expiresAt: typeof value.expiresAt === "string" ? value.expiresAt : undefined,
    };
  }
  return null;
};

export const isProfileAuthResponse = createTypeGuard<ProfileAuthResponse>(parseProfileAuthResponse);
