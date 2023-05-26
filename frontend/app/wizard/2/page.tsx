"use client";

import { useRouter } from "next/navigation";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { PermissionType } from "@/types/permission-type";
import { Profile, ProfileAuthResponse, ProfileRequest } from "@/types/profile";

import { isProfile, isProfileAuthResponse } from "@/lib/guards";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

import { Icons } from "@/components/icons";

import { useZodForm } from "@/app/hooks/use-zod-form";

async function authProfile(profile?: Profile) {
  const request = { profileUuid: profile ? profile.uuid : "" };
  const response = await fetch("/api/v1/profiles/auth", {
    method: "POST",
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem authenticating profile");
  }
  const authResponse = (await response.json()) as ProfileAuthResponse;
  if (!isProfileAuthResponse(authResponse)) throw new Error("Problem authenticating profile");
  return authResponse;
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

  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem creating profile");
  }

  const profile = await response.json();
  if (!isProfile(profile)) throw new Error("Problem creating profile");
  return profile;
}

const schema = z.object({
  name: z.string().min(1).max(255),
});

export default function SecondWizardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState } = useZodForm({ schema });
  const {
    data,
    mutate,
    isSuccess: isMutateSuccess,
    isLoading,
    error,
  } = useMutation({
    mutationFn: createProfile,
  });

  const { error: authError } = useQuery({
    queryKey: ["profile-auth"],
    queryFn: () => authProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
    },
    enabled: isMutateSuccess && !!data,
  });

  const onSubmit = (formData: ProfileRequest) =>
    mutate(
      { ...formData, permissionType: PermissionType.Admin },
      { onSuccess: () => router.push("/wizard/3") },
    );

  return (
    <div className="m-auto my-5 flex w-1/3 flex-col gap-5">
      <h1 className="m-auto text-6xl">👻</h1>
      <h3>Step 2</h3>
      <h2 className="text-2xl font-bold">Create an administrator profile</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="flex flex-col items-center gap-3" disabled={isLoading}>
          <Input placeholder="Administrator Name" {...register("name")} />
          {formState.errors.name && <p className="text-destructive">{formState.errors.name.message}</p>}
          <Progress className="m-auto h-2 w-1/2" value={50}></Progress>
          <Button size={"sm"} type="submit">
            {isLoading ? <Icons.spinner className="animate-spin text-secondary" /> : <>Next</>}
          </Button>
          <>
            {error && error instanceof Error && <p className="text-destructive">{error.message}</p>}
            {authError && authError instanceof Error && (
              <p className="text-destructive">{authError.message}</p>
            )}
          </>
        </fieldset>
      </form>
    </div>
  );
}
