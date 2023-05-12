"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { PermissionType } from "@/types/permission-type";
import { ProfileRequest, ProfileResponse } from "@/types/profile";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useProfile } from "@/hooks/fetch/use-profile";

async function createProfile(profileRequest: ProfileRequest) {
  const response = await fetch("/api/v1/admin/profiles", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(profileRequest),
  });
  const profileResponse = await response.json() as ProfileResponse;
  return profileResponse;
}

export default function SecondWizardPage() {
  const [profileRequest, setProfileRequest] = useState<ProfileRequest>({
    name: "",
    permissionType: PermissionType.Admin,
  } as ProfileRequest);
  const [profileResponse, setProfileResponse] = useState<ProfileResponse>({} as ProfileResponse);
  const {isLoggedIn, setProfileAuthRequest} = useProfile();
  const router = useRouter();

  const onAdministratorNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileRequest({ name: e.target.value, permissionType: profileRequest.permissionType });
  };

  useEffect(() => {
    setProfileAuthRequest({profileUuid: profileResponse.uuid})
  }, [profileResponse, setProfileAuthRequest])

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/wizard/3");
    }
  }, [isLoggedIn, router])

  return (
    <div className="m-auto my-5 flex w-1/3 flex-col gap-5">
      <h1 className="m-auto text-6xl">👻</h1>
      <h3>Step 2</h3>
      <h2 className="text-2xl font-bold">Create an administrator profile</h2>
      <Input
        placeholder="Administrators Name"
        onChange={onAdministratorNameInputChange}
        value={profileRequest.name}
        maxLength={255}
      />
      <Progress className="m-auto h-2 w-1/2" value={50}></Progress>
      <Button className="m-auto" onClick={() => createProfile(profileRequest)
        .then(response => setProfileResponse(response))}>
        Next
      </Button>
    </div>
  );
}
