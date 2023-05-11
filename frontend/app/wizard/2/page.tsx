"use client";

import { useEffect, useState } from "react";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { PermissionType } from "@/types/permission-type";
import { ProfileRequest } from "@/types/profile";

async function createProfile(profileRequest: ProfileRequest, router: AppRouterInstance) {
  const response = await fetch("/api/v1/admin/profiles", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(profileRequest),
  });
  console.log((await response.json()))
}

export default function SecondWizardPage() {
  const [profile, setProfile] = useState<ProfileRequest>({ name: "", permissionType: PermissionType.Admin } as ProfileRequest);
  const router = useRouter();

  const onAdministratorNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ name: e.target.value, permissionType: profile.permissionType });
  };

  useEffect(() => {
    console.log(profile.name);
    console.log(profile);
  }, [profile]);

  return (
    <div className="m-auto my-5 flex w-1/3 flex-col gap-5">
      <h1 className="m-auto text-6xl">👻</h1>
      <h3>Step 2</h3>
      <h2 className="text-2xl font-bold">Create an administrator profile</h2>
      <Input
        placeholder="Administrators Name"
        onChange={onAdministratorNameInputChange}
        value={profile.name}
        maxLength={255}
      />
      <Progress className="m-auto h-2 w-1/2" value={50}></Progress>
      <Button className="m-auto" onClick={() => createProfile(profile, router)}>
        Next
      </Button>
    </div>
  );
}
