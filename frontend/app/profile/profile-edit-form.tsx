"use client";

import { Dispatch } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

import { useZodForm } from "@/app/hooks/use-zod-form";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Profile, ProfileRequest } from "@/types/profile";
import { editProfile } from "@/lib/profile-requests";

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
  const { mutate, isLoading } = useMutation({
    mutationFn: editProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
      queryClient.invalidateQueries(["profiles"]);
    },
    onError: (error) => {
      toast.error(`Error editing profile: ${error instanceof Error ? error.message : "Unknown error"}`);
    },
  });
  const queryClient = useQueryClient();

  const onSubmit = (formData: ProfileRequest) =>
    mutate(
      { ...formData },
      {
        onSuccess: () => {
          toast.success("Profile updated");
          closeDialog();
        },
      },
    );

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
        </fieldset>
      </form>
    </div>
  );
}
