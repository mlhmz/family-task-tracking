"use client";

import { Dispatch } from "react";
import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

import { PermissionType } from "@/types/permission-type";
import { ProfileRequest } from "@/types/profile";
import { createProfile } from "@/lib/profile-requests";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Icons } from "@/components/icons";
import { useZodForm } from "@/app/hooks/use-zod-form";

const schema = z.object({
  name: z.string().min(1).max(255),
  points: z.number().optional(),
  permissionType: z.enum([PermissionType.Admin, PermissionType.Member]).optional(),
});

export default function ProfileCreateForm({ handleCloseDialog }: { handleCloseDialog: Dispatch<void> }) {
  const { register, handleSubmit, formState, setValue } = useZodForm({
    schema,
    defaultValues: { points: 0 },
  });
  const { mutate, isLoading } = useMutation({
    mutationFn: createProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(["profiles"]);
    },
  });
  const queryClient = useQueryClient();
  const router = useRouter();

  const onSubmit = (formData: ProfileRequest) =>
    mutate(
      { ...formData },
      {
        onSuccess: (profile) => {
          toast.success(`The profile '${profile.name}' was created!`, {
            action: {
              label: "View",
              onClick: () => router.push(`/profiles/profile/${profile.uuid}`),
            },
          });
          handleCloseDialog();
        },
        onError: (error) => {
          toast.error(`Error creating profile: ${error instanceof Error ? error.message : "Unknown error"}`);
        },
      },
    );

  const onCheckedChange = (checked: boolean) => {
    setValue("permissionType", checked ? PermissionType.Admin : PermissionType.Member);
  };

  return (
    <div>
      <form className="flex flex-col gap-10" onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={isLoading} className="flex flex-col items-center gap-10">
          <div className="flex w-full flex-col gap-2">
            <label className="ml-1" htmlFor="name">
              Name
            </label>
            <Input placeholder="Name" {...register("name")} />
          </div>
          <div className="flex w-full flex-col gap-2">
            <label className="ml-1" htmlFor="points">
              Points
            </label>
            <Input placeholder="Points" type="number" {...register("points", { valueAsNumber: true })} />
          </div>
          <input disabled={true} className="hidden" {...register("permissionType")} />
          <div className="flex gap-2">
            <Switch onCheckedChange={onCheckedChange} id="privileged-switch" />
            <p>Privileged</p>
          </div>
          <Button type="submit">
            {isLoading ? <Icons.spinner className="animate-spin text-secondary" /> : <>Save</>}
          </Button>
          {Object.entries(formState.errors).map(([key, value]) => (
            <p className="text-destructive" key={key}>
              {value.message}
            </p>
          ))}
        </fieldset>
      </form>
    </div>
  );
}
