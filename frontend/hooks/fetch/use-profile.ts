import { useEffect, useState } from "react";

import { useCookies } from "react-cookie";

import { ProfileAuthRequest, ProfileAuthResponse, ProfileResponse } from "@/types/profile";

async function authProfile(profileAuthRequest: ProfileAuthRequest) {
  const response = await fetch("/api/v1/profiles/auth", {
    method: "POST",
    body: JSON.stringify(profileAuthRequest),
  });
  const profileAuthResponse = (await response.json()) as ProfileAuthResponse;
  return { ...profileAuthResponse, status: response.status };
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

export const useProfile = () => {
  const [profileInstance, setProfileInstance] = useState({} as ProfileResponse);
  const [profileAuthRequest, setProfileAuthRequest] = useState({} as ProfileAuthRequest);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [sessionId, setSessionId] = useCookies(["session-id"]);

  useEffect(() => {
    async function getProfileSession() {
      const authResponse = await authProfile(profileAuthRequest);
      if (authResponse && authResponse.status == 200) {
        setSessionId("session-id", authResponse.sessionId)
        setLoggedIn(true);
      }
    }
    getProfileSession();
  }, [profileAuthRequest, setSessionId]);

  useEffect(() => {
    async function getProfile() {
      if (sessionId) {
        const profile = await fetchProfile(sessionId["session-id"]);
        setLoggedIn(profile.status == 200);
        setProfileInstance({ ...profile, sessionId: sessionId["session-id"] });
      }
    }
    getProfile();
  }, [sessionId, setSessionId, profileAuthRequest]);

  return {
    profileInstance,
    setProfileAuthRequest,
    isLoggedIn,
  };
};
