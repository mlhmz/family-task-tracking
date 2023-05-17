"use client";

import { useRouter } from "next/navigation";

import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";

import { ProfileAuthRequest, ProfileRequest } from "@/types/profile";

import { assertIsProfile } from "@/lib/guards";

import { useZodForm } from "@/hooks/use-zod-form";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

async function authProfile(profileAuthRequest: ProfileAuthRequest) {
  const response = await fetch("/api/v1/profiles/auth", {
    method: "POST",
    body: JSON.stringify(profileAuthRequest),
  });

  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem authenticating profile");
  }
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
  assertIsProfile(profile);
  return profile;
}

const schema = z.object({
  name: z.string().min(1).max(255),
});

export default function SecondWizardPage() {
  const router = useRouter();
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
    queryKey: ["profile", "auth"],
    queryFn: () => data && authProfile({ profileUuid: data.uuid }),
    onSuccess: () => {
      router.push("/wizard/2");
    },
    enabled: isMutateSuccess,
  });

  const onSubmit = (formData: ProfileRequest) => mutate(formData);

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
          <Button className={buttonVariants({ size: "sm" })} type="submit">
            Next
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
