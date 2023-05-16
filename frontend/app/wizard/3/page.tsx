"use client";

import { useContext, useState } from "react";

import { useRouter } from "next/navigation";

import { ProfileAuthRequest, Profile } from "@/types/profile";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ProfileContext } from "@/app/profile-context";

async function changePassword(profileInstance: Profile, password?: string) {
  const request: ProfileAuthRequest = { profileUuid: profileInstance.uuid, password };
  const response = await fetch("/api/v1/profiles/auth", {
    method: "PUT",
    body: JSON.stringify(request),
  });
  return { status: response.status };
}

export default function ThirdWizardPage() {
  const [password, setPassword] = useState("");
  const profile = useContext(ProfileContext);
  const router = useRouter();

  const onPinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className="m-auto my-5 flex w-1/3 flex-col gap-5">
      <h1 className="m-auto text-6xl">🔐</h1>
      <h3>Step 3</h3>
      <h2 className="text-2xl font-bold">Define a pin for your profile</h2>
      <Input placeholder="PIN" type="password" onChange={onPinInputChange} value={password} maxLength={255} />
      <Progress className="m-auto h-2 w-1/2" value={75}></Progress>
      <Button
        className={buttonVariants({ size: "sm" })}
        onClick={() =>
          changePassword(profile.profileInstance, password).then(
            (response) => response.status == 200 && router.push("/wizard/finished"),
          )
        }>
        Next
      </Button>
    </div>
  );
}
