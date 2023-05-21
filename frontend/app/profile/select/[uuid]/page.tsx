"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Avatar from "boring-avatars";
import { z } from "zod";

import { ProfileAuthRequest } from "@/types/profile";

import { useProfile } from "@/hooks/fetch/use-profile";
import { useZodForm } from "@/hooks/use-zod-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProfileSelectSkeleton } from "@/components/ui/skeleton/profile-select-skeleton";

import { Icons } from "@/components/icons";

async function authProfile(authRequest: ProfileAuthRequest) {
  const response = await fetch("/api/v1/profiles/auth", {
    method: "POST",
    body: JSON.stringify(authRequest),
  });
  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }
  return response;
}

const schema = z.object({
  password: z.string().min(1).max(255).optional(),
});

export default function ProfileLogin({ params }) {
  const { register, handleSubmit, formState } = useZodForm({ schema });
  const { data } = useProfile(params.uuid);
  const { mutate, error, isLoading } = useMutation({
    mutationFn: authProfile,
    onSuccess: () => {
      router.push("/dashboard");
      queryClient.invalidateQueries(["profile"]);
    },
  });
  const router = useRouter();
  const queryClient = useQueryClient();

  const onSubmit = (formData: ProfileAuthRequest) => mutate({ ...formData, profileUuid: data?.uuid });

  useEffect(() => {
    if (data && !data?.passwordProtected) {
      mutate({ profileUuid: data?.uuid });
    }
  }, [data, mutate]);

  if (!data || !data.uuid) {
    return <ProfileSelectSkeleton />;
  }
  return (
    <div className="m-auto my-5 flex flex-col items-center gap-5">
      <div className="m-auto">
        <Avatar
          size={180}
          name={data.uuid}
          variant="beam"
          colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
        />
      </div>
      <h1 className="text-xl">{data.name}</h1>
      {data.passwordProtected && (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center gap-5">
          <fieldset className="flex flex-col items-center gap-3" disabled={isLoading}>
            <Input placeholder="PIN" type="password" {...register("password")} />
            {formState.errors.password && (
              <p className="text-destructive">{formState.errors.password.message}</p>
            )}
            <Button type="submit">
              {isLoading ? <Icons.spinner className="animate-spin text-secondary" /> : <>Next</>}
            </Button>
          </fieldset>
        </form>
      )}
      <>{error && error instanceof Error && <p className="text-destructive">{error.message}</p>}</>
    </div>
  );
}
