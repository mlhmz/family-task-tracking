"use client";

import { useContext } from "react";

import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

import { ProfileAuthRequest } from "@/types/profile";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { WizardSkeleton } from "@/components/ui/skeleton/wizard-skeleton";

import { Icons } from "@/components/icons";

import { useZodForm } from "@/app/hooks/use-zod-form";
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
  const { mutate, error, isLoading } = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
    },
  });
  const { data } = useContext(ProfileContext);
  const router = useRouter();
  const queryClient = useQueryClient();

  const onSubmit = (formData: ProfileAuthRequest) =>
    mutate(
      { ...formData, profileUuid: data?.uuid },
      {
        onSuccess: () => {
          toast.success("Administrator pin set!");
          router.push("/wizard/finished");
        },
      },
    );

  if (!data) {
    return <WizardSkeleton />;
  }
  return (
    <div className="m-auto my-5 w-1/3 ">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <h1 className="m-auto text-6xl">🔐</h1>
        <h3>Step 3</h3>
        <h2 className="text-2xl font-bold">Define a pin for your profile</h2>
        <fieldset className="flex flex-col items-center gap-3" disabled={isLoading}>
          <Input placeholder="PIN" type="password" {...register("password")} />
          <Progress className="m-auto h-2 w-1/2" value={75}></Progress>
          {formState.errors.password && (
            <p className="text-destructive">{formState.errors.password.message}</p>
          )}
          <Button size={"sm"} type="submit">
            {isLoading ? <Icons.spinner className="animate-spin text-secondary" /> : <>Next</>}
          </Button>
        </fieldset>
        <>{error && error instanceof Error && <p className="text-destructive">{error.message}</p>}</>
      </form>
    </div>
  );
}
