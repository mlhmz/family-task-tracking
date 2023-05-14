"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { ProfileAuthRequest, ProfileResponse } from "@/types/profile";

import { useProfile } from "@/hooks/fetch/use-profile";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

async function changePassword(profileInstance: ProfileResponse, password?: string) {
  const request: ProfileAuthRequest = { profileUuid: profileInstance.uuid, password };
  const response = await fetch("/api/v1/profiles/auth", {
    headers: {
      "session-id": profileInstance.sessionId ?? "",
    },
    method: "PUT",
    body: JSON.stringify(request),
  });
  return { status: response.status }
}

export default function ThirdWizardPage() {
  const [password, setPassword] = useState("");
  const [isPasswordChanged, setPasswordChanged] = useState(false);
  const { profileInstance } = useProfile();
  const router = useRouter();

  const onPinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  useEffect(() => {
    if (isPasswordChanged) {
      router.push("/wizard/finished");
    }
  }, [isPasswordChanged, router]);

  return (
    <div className="m-auto my-5 flex w-1/3 flex-col gap-5">
      <h1 className="m-auto text-6xl">🔐</h1>
      <h3>Step 3</h3>
      <h2 className="text-2xl font-bold">Define a pin for your profile</h2>
      <Input placeholder="PIN" type="password" onChange={onPinInputChange} value={password} maxLength={255} />
      <Progress className="m-auto h-2 w-1/2" value={50}></Progress>
      <Button className="m-auto" onClick={() => changePassword(profileInstance, password)
        .then(response => setPasswordChanged(response.status == 200))}>
        Next
      </Button>
    </div>
  );
}
