"use client";

import { Dispatch } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { PermissionType } from "@/types/permission-type";
import { Profile, ProfileRequest } from "@/types/profile";

import { useZodForm } from "@/hooks/use-zod-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import { Icons } from "@/components/icons";
import { isProfile } from "@/lib/guards";

async function editProfile(request: ProfileRequest, uuid?: string) {
  const response = await fetch(`/api/v1/admin/profiles/${uuid}`, {
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
  points: z.number().optional(),
  permissionType: z.enum([PermissionType.Admin, PermissionType.Member]).optional(),
});

export default function ProfilePrivilegedEditForm({
  initialData,
  closeDialog,
}: {
  initialData?: Profile;
  closeDialog: Dispatch<void>;
}) {
  const { register, handleSubmit, formState, setValue } = useZodForm({
    schema,
    defaultValues: {
      name: initialData?.name ?? "",
      points: initialData?.points ?? 0,
      permissionType: initialData?.permissionType ?? PermissionType.Member,
    },
  });
  const { mutate, error, isLoading } = useMutation({
    mutationFn: (data: ProfileRequest) => editProfile(data, initialData?.uuid),
    onSuccess: () => {
      queryClient.invalidateQueries(["profile", { uuid: initialData?.uuid ?? "undefined"}]);
      queryClient.invalidateQueries(["profiles"]);
      closeDialog();
    },
  });
  const queryClient = useQueryClient();

  const onSubmit = (formData: ProfileRequest) => mutate({ ...formData });

  const onCheckedChange = (checked: boolean) => {
    setValue("permissionType", checked ? PermissionType.Admin : PermissionType.Member);
  };

  return (
    <div>
      <form className="flex flex-col gap-10" onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={isLoading} className="flex flex-col items-center gap-10">
          <Input placeholder="Name" {...register("name")} />
          <Input placeholder="Points" type="number" {...register("points", { valueAsNumber: true })} />
          <input disabled={true} className="hidden" {...register("permissionType")} />
          <div className="flex gap-2">
            <Switch
              defaultChecked={initialData && initialData.permissionType == PermissionType.Admin}
              onCheckedChange={onCheckedChange}
              id="privileged-switch"
            />
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
          <>{error && error instanceof Error && <p className="text-destructive">{error.message}</p>}</>
        </fieldset>
      </form>
    </div>
  );
}
