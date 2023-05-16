"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { PermissionType } from "@/types/permission-type";
import { ProfileAuthRequest, ProfileRequest, Profile } from "@/types/profile";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

async function authProfile(profileAuthRequest: ProfileAuthRequest) {
  await fetch("/api/v1/profiles/auth", {
    method: "POST",
    body: JSON.stringify(profileAuthRequest),
  });
}

async function createProfile(profileRequest: ProfileRequest) {
  const response = await fetch("/api/v1/admin/profiles", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(profileRequest),
  });
  const profileResponse = (await response.json()) as Profile;
  return profileResponse;
}

export default function SecondWizardPage() {
  const [profileRequest, setProfileRequest] = useState<ProfileRequest>({
    name: "",
    permissionType: PermissionType.Admin,
  } as ProfileRequest);
  const router = useRouter();

  const onAdministratorNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileRequest({ name: e.target.value, permissionType: profileRequest.permissionType });
  };

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
      <Button
        className={buttonVariants({ size: "sm" })}
        onClick={() =>
          createProfile(profileRequest).then((response) => {
            authProfile({ profileUuid: response.uuid }).then((res) => {
              router.push("/wizard/3");
            });
          })
        }>
        Next
      </Button>
    </div>
  );
}
