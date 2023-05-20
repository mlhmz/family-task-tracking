import { Dispatch, SetStateAction, useEffect } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { PermissionType } from "@/types/permission-type";
import { Profile, ProfileRequest } from "@/types/profile";

import { useZodForm } from "@/hooks/use-zod-form";

import { Icons } from "./icons";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

async function editProfile(request: ProfileRequest) {
  const response = await fetch("/api/v1/profiles/profile", {
    method: "PUT",
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }
  return response;
}

const schema = z.object({
  name: z.string().min(1).max(255),
  points: z.number().min(0).optional(),
  permissionType: z.enum([PermissionType.Admin, PermissionType.Member]).optional(),
});

interface ProfileEditorProps {
  safe: boolean;
  data: Profile;
  showEditor: boolean;
  setShowEditor: Dispatch<SetStateAction<boolean>>;
}

export default function ProfileEditor({ safe, data, showEditor, setShowEditor }: ProfileEditorProps) {
  const { register, handleSubmit, formState, setValue } = useZodForm({ schema });
  const { mutate, error, isLoading } = useMutation({
    mutationFn: editProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
      setShowEditor(false);
    },
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    if (data.name) {
      setValue("name", data.name);
    }
    if (!safe && data.points) {
      setValue("points", data.points);
    }
    if (!safe && data.permissionType) {
      setValue("permissionType", data.permissionType);
    }
  }, []);

  const onSubmit = (formData: ProfileRequest) => mutate({ ...formData });

  if (!showEditor) {
    return <></>;
  }
  return (
    <div>
      <form className="flex flex-col gap-10" onSubmit={handleSubmit(onSubmit)}>
        <a className="cursor-pointer self-end" onClick={() => setShowEditor(!showEditor)}>
          <Icons.x />
        </a>
        <fieldset disabled={isLoading} className="flex flex-col items-center gap-10">
          <Input placeholder="Name" {...register("name")} />
          {!safe && (
            <>
              <Input placeholder="Points" type="number" {...register("points")} />
              <Input placeholder="Permission Type" {...register("permissionType")} />
            </>
          )}
          <Button type="submit">
            {isLoading ? <Icons.spinner className="animate-spin text-secondary" /> : <>Save</>}
          </Button>
          {formState.errors.name && <p className="text-destructive">{formState.errors.name.message}</p>}
          <>{error && error instanceof Error && <p className="text-destructive">{error.message}</p>}</>
          <>{error && error instanceof Error && <p className="text-destructive">{error.message}</p>}</>
        </fieldset>
      </form>
    </div>
  );
}
