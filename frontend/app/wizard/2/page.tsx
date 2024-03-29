"use client";

import { useRouter } from "next/navigation";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

import { PermissionType } from "@/types/permission-type";
import { ProfileRequest } from "@/types/profile";
import { isProfile } from "@/lib/guards";
import { authProfile } from "@/lib/profile-requests";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Icons } from "@/components/icons";
import { useZodForm } from "@/app/hooks/use-zod-form";

async function createProfile(profileRequest: ProfileRequest) {
  const response = await fetch("/api/v1/admin/profiles", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(profileRequest),
  });

  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem creating profile");
  }

  const profile = await response.json();
  if (!isProfile(profile)) throw new Error("Problem creating profile");
  return profile;
}

const schema = z.object({
  name: z.string().min(1).max(255),
});

export default function SecondWizardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState } = useZodForm({ schema });
  const {
    data,
    mutate,
    isSuccess: isMutateSuccess,
    isLoading,
  } = useMutation({
    mutationFn: createProfile,
    onError: (error) => {
      toast.error(`Error creating profile: ${error instanceof Error ? error.message : "Unknown error"}`);
    },
  });

  useQuery({
    queryKey: ["profile-auth"],
    queryFn: () => authProfile({ profileUuid: data?.uuid ?? "" }),
    onSuccess: () => {
      queryClient.invalidateQueries();
      router.push("/wizard/3");
    },
    onError: (error) => {
      toast.error(
        `Error authenticating profile: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    },
    enabled: isMutateSuccess && !!data,
  });

  const onSubmit = (formData: ProfileRequest) =>
    mutate(
      { ...formData, permissionType: PermissionType.Admin },
      {
        onSuccess: () => {
          toast.success("Admin profile created!");
        },
      },
    );

  return (
    <div className="my-5 flex flex-col items-center gap-5">
      <h1 className="m-auto text-6xl">👻</h1>
      <div className="w-72">
        <h3>Step 2</h3>
        <h2 className="text-2xl font-bold">Create an administrator profile</h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="flex flex-col items-center gap-3" disabled={isLoading}>
          <Input placeholder="Administrator Name" className="w-72" {...register("name")} />
          {formState.errors.name && <p className="text-destructive">{formState.errors.name.message}</p>}
          <Progress className="m-auto h-2 w-72" value={50}></Progress>
          <Button size={"sm"} type="submit">
            {isLoading ? <Icons.spinner className="animate-spin text-secondary" /> : <>Next</>}
          </Button>
        </fieldset>
      </form>
    </div>
  );
}
