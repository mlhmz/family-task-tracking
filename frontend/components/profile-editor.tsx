"use client";

import { Dispatch, useEffect } from "react";

import { MutationFunction, useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { PermissionType } from "@/types/permission-type";
import { Profile, ProfileRequest } from "@/types/profile";

import { useZodForm } from "@/hooks/use-zod-form";

import { Icons } from "./icons";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";

interface ProfileEditorProps {
  safe?: boolean;
  initialData?: Profile;
  mutationFunction: MutationFunction<Response, ProfileRequest>;
  onSuccess: Dispatch<void>;
}

const schema = z.object({
  name: z.string().min(1).max(255),
  points: z.number().optional(),
  permissionType: z.enum([PermissionType.Admin, PermissionType.Member]).optional(),
});

export default function ProfileEditor({
  safe,
  initialData,
  mutationFunction,
  onSuccess,
}: ProfileEditorProps) {
  const { register, handleSubmit, formState, setValue } = useZodForm({ schema });
  const { mutate, error, isLoading } = useMutation({
    mutationFn: mutationFunction,
    onSuccess: () => onSuccess(),
  });

  useEffect(() => {
    const setData = (profile) => {
      if (profile.name) {
        setValue("name", profile.name);
      }
      if (!safe && profile.points) {
        setValue("points", profile.points);
      }
      if (!safe && profile.permissionType) {
        setValue("permissionType", profile.permissionType);
      }
    };
    initialData && setData(initialData);
  }, []);

  const onSubmit = (formData: ProfileRequest) => mutate({ ...formData });

  const onCheckedChange = (checked: boolean) => {
    setValue("permissionType", checked ? PermissionType.Admin : PermissionType.Member);
  };

  return (
    <div>
      <form className="flex flex-col gap-10" onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={isLoading} className="flex flex-col items-center gap-10">
          <Input placeholder="Name" {...register("name")} />
          {!safe && (
            <>
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
            </>
          )}
          <Button type="submit">
            {isLoading ? <Icons.spinner className="animate-spin text-secondary" /> : <>Save</>}
          </Button>
          {formState.errors.name && <p className="text-destructive">{formState.errors.name.message}</p>}
          {formState.errors.points && <p className="text-destructive">{formState.errors.points.message}</p>}
          {formState.errors.permissionType && (
            <p className="text-destructive">{formState.errors.permissionType.message}</p>
          )}
          <>{error && error instanceof Error && <p className="text-destructive">{error.message}</p>}</>
          <>{error && error instanceof Error && <p className="text-destructive">{error.message}</p>}</>
        </fieldset>
      </form>
    </div>
  );
}
