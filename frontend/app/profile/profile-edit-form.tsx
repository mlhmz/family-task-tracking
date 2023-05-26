"use client";

import { Dispatch } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { Profile, ProfileRequest } from "@/types/profile";

import { isProfile } from "@/lib/guards";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Icons } from "@/components/icons";

import { useZodForm } from "@/app/hooks/use-zod-form";

async function editProfile(request: ProfileRequest) {
  const response = await fetch(`/api/v1/profiles/profile`, {
    method: "PUT",
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }
  const profile = await response.json();
  if (!isProfile(profile)) throw new Error("Problem fetching data");
  return profile;
}

const schema = z.object({
  name: z.string().min(1).max(255),
});

export default function ProfileEditForm({
  initialData,
  closeDialog,
}: {
  initialData?: Profile;
  closeDialog: Dispatch<void>;
}) {
  const { register, handleSubmit, formState } = useZodForm({
    schema,
    defaultValues: {
      name: initialData?.name ?? "",
    },
  });
  const { mutate, error, isLoading } = useMutation({
    mutationFn: editProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
      queryClient.invalidateQueries(["profiles"]);
    },
  });
  const queryClient = useQueryClient();

  const onSubmit = (formData: ProfileRequest) => mutate({ ...formData }, { onSuccess: () => closeDialog() });

  return (
    <div>
      <form className="flex flex-col gap-10" onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={isLoading} className="flex flex-col items-center gap-10">
          <Input placeholder="Name" {...register("name")} />
          <Button type="submit">
            {isLoading ? <Icons.spinner className="animate-spin text-secondary" /> : <>Save</>}
          </Button>
          {Object.entries(formState.errors).map(([key, value]) => (
            <p className="text-destructive" key={key}>
              {value.message}
            </p>
          ))}
          <>{error && error instanceof Error && <p className="text-destructive">{error.message}</p>}</>
        </fieldset>
      </form>
    </div>
  );
}
