"use client";

import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

import { PermissionType } from "@/types/permission-type";
import { ProfileRequest } from "@/types/profile";
import { isProfile } from "@/lib/guards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Icons } from "@/components/icons";
import { useZodForm } from "@/app/hooks/use-zod-form";
import { createProfile } from "@/lib/profile-requests";

const schema = z.object({
  name: z.string().min(1).max(255),
  points: z.number().optional(),
  permissionType: z.enum([PermissionType.Admin, PermissionType.Member]).optional(),
});

export default function ProfileCreateForm() {
  const { register, handleSubmit, formState, setValue } = useZodForm({
    schema,
    defaultValues: { points: 0 },
  });
  const { mutate, isLoading } = useMutation({
    mutationFn: createProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(["profiles"]);
    },
    onError: (error) => {
      toast.error(`Error creating profile: ${error instanceof Error ? error.message : "Unknown error"}`);
    },
  });
  const queryClient = useQueryClient();
  const router = useRouter();

  const onSubmit = (formData: ProfileRequest) =>
    mutate(
      { ...formData },
      {
        onSuccess: (data) => {
          router.push(`/profiles/profile/${data.uuid}`);
          toast.success("Profile created");
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
          <Input placeholder="Name" {...register("name")} />
          <Input placeholder="Points" type="number" {...register("points", { valueAsNumber: true })} />
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
