import { ProfileAuthRequest, ProfileAuthResponse, ProfileRequest } from "@/types/profile";

import { isProfile, isProfileAuthResponse, isProfiles } from "./guards";

export async function createProfile(request: ProfileRequest) {
  const response = await fetch("/api/v1/admin/profiles", {
    method: "POST",
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }

  const profile = await response.json();
  if (!isProfile(profile)) throw new Error("Problem fetching data");
  return profile;
}

export async function getProfile(uuid?: string) {
  const response = await fetch(`/api/v1/profiles/${uuid ? uuid : "profile"}`);

  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }

  const profile = await response.json();
  if (!isProfile(profile)) throw new Error("Problem fetching data");
  return profile;
}

export async function getProfiles({ query }: { query?: string }) {
  const request = query
    ? new URLSearchParams({
        query: query,
      })
    : undefined;
  const response = await fetch(`/api/v1/profiles${request ? "?" + request : ""}`);
  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }
  const profiles = await response.json();
  if (!isProfiles(profiles)) throw new Error("Problem fetching data");
  return profiles;
}

export async function authProfile(authRequest: ProfileAuthRequest) {
  const response = await fetch("/api/v1/profiles/auth", {
    method: "POST",
    body: JSON.stringify(authRequest),
  });
  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }
  const authResponse = (await response.json()) as ProfileAuthResponse;
  if (!isProfileAuthResponse(authResponse)) throw new Error("Problem authenticating profile");
  return response;
}

export async function changePassword(request: ProfileAuthRequest) {
  const response = await fetch("/api/v1/profiles/auth", {
    method: "PUT",
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }
}

export async function deleteProfile(uuid: string) {
  const response = await fetch(`/api/v1/admin/profiles/${uuid}`, { method: "DELETE" });
  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }
  return response;
}

export async function editProfile(request: ProfileRequest) {
  const response = await fetch(`/api/v1/profiles/profile`, {
    method: "PUT",
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }
  const profile = await response.json();
  if (!isProfile(profile)) throw new Error("Problem fetching data");
  return profile;
}

export async function editProfileByUuid(request: ProfileRequest, uuid?: string) {
  const response = await fetch(`/api/v1/admin/profiles/${uuid}`, {
    method: "PUT",
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }
  const profile = await response.json();
  if (!isProfile(profile)) throw new Error("Problem fetching data");
  return profile;
}
