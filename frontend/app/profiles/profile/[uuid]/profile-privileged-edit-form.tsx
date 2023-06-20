"use client";

import { Dispatch } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

import { PermissionType } from "@/types/permission-type";
import { Profile, ProfileRequest } from "@/types/profile";
import { editProfileByUuid } from "@/lib/profile-requests";
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
  const { mutate, isLoading } = useMutation({
    mutationFn: (data: ProfileRequest) => editProfileByUuid(data, initialData?.uuid),
    onSuccess: () => {
      queryClient.invalidateQueries(["profile", { uuid: initialData?.uuid ?? "undefined" }]);
      queryClient.invalidateQueries(["profiles"]);
    },
    onError: (error) => {
      toast.error(`Something went wrong: ${error instanceof Error ? error.message : "Unknown error"}`);
    },
  });
  const queryClient = useQueryClient();

  const onSubmit = (formData: ProfileRequest) =>
    mutate(
      { ...formData },
      {
        onSuccess: () => {
          closeDialog();
          toast.success("Profile updated");
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
            <label className="ml-1" htmlFor="name">Name</label>
            <Input placeholder="Name" {...register("name")} />
          </div>
          <div className="flex w-full flex-col gap-2">
            <label className="ml-1" htmlFor="points">Points</label>
            <Input placeholder="Points" type="number" {...register("points", { valueAsNumber: true })} />
          </div>
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
          {formState.errors.name && <p className="text-destructive ">{formState.errors.name.message}</p>}
        </fieldset>
      </form>
    </div>
  );
}
