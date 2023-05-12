import { useEffect, useState } from "react";

import { cookies } from "next/dist/client/components/headers";

import { useCookies } from "react-cookie";

import { ProfileAuthRequest, ProfileAuthResponse, ProfileResponse } from "@/types/profile";

async function authProfile(profileAuthRequest: ProfileAuthRequest) {
  const response = await fetch("/api/v1/profiles/auth", {
    method: "POST",
    body: JSON.stringify(profileAuthRequest),
  });
  const profileAuthResponse = (await response.json()) as ProfileAuthResponse;
  return profileAuthResponse;
}

async function fetchProfile(sessionId?: string) {
  const response = await fetch("/api/v1/profiles/profile", {
    headers: { "session-id": sessionId ?? "" },
  });
  const profile = (await response.json()) as ProfileResponse;
  return {
    ...profile,
    status: response.status,
  };
}

export const useProfile = (profileAuthRequest?: ProfileAuthRequest) => {
  const [profileInstance, setProfileInstance] = useState({} as ProfileResponse);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [sessionId, setSessionId, removeSessionId] = useCookies(["session-id"]);

  useEffect(() => {
    async function getProfile() {
      if (profileAuthRequest && !sessionId) {
        const authResponse = await authProfile(profileAuthRequest);
        setSessionId("session-id", authResponse.sessionId, { expires: authResponse.expiresAt });
      }
      // TODO: Bessere Lösung finden
      const profile = await fetchProfile(String(sessionId));
      setLoggedIn(profile.status == 200);
      setProfileInstance(profile);
    }
    getProfile();
  }, [sessionId, setSessionId, profileAuthRequest]);

  return {
    profileInstance,
    isLoggedIn,
  };
};
