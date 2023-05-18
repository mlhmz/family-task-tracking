"use client";

import { useContext, useState } from "react";

import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { ProfileAuthRequest } from "@/types/profile";

import { useZodForm } from "@/hooks/use-zod-form";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

import WizardSkeleton from "@/components/wizard-skeleton";

import { ProfileContext } from "@/app/profile-context";

async function changePassword(request: ProfileAuthRequest) {
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

const schema = z.object({
  password: z.string().min(1).max(255),
});

export default function ThirdWizardPage() {
  const { register, handleSubmit, formState } = useZodForm({ schema });
  const { mutate, error } = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"])
      router.push("/wizard/finished");
    },
  });
  const { data } = useContext(ProfileContext);
  const router = useRouter();
  const queryClient = useQueryClient();

  const onSubmit = (formData: ProfileAuthRequest) => mutate({ ...formData, profileUuid: data?.uuid });

  if (!data) {
    return <WizardSkeleton />;
  }
  return (
    <div className="m-auto my-5 w-1/3 ">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <h1 className="m-auto text-6xl">🔐</h1>
        <h3>Step 3</h3>
        <h2 className="text-2xl font-bold">Define a pin for your profile</h2>
        <Input placeholder="PIN" type="password" {...register("password")} />
        <Progress className="m-auto h-2 w-1/2" value={75}></Progress>
        {formState.errors.password && <p className="text-destructive">{formState.errors.password.message}</p>}
        <Button className={buttonVariants({ size: "sm" })} type="submit">
          Next
        </Button>
        <>{error && error instanceof Error && <p className="text-destructive">{error.message}</p>}</>
      </form>
    </div>
  );
}
