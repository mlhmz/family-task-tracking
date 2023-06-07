import { Dispatch } from "react";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

import { changePassword } from "@/lib/profile-requests";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";

import { useZodForm } from "../hooks/use-zod-form";

const schema = z.object({
  pin: z.string().min(1).max(255),
});

/**
 * Component to change the profiles password.
 * We don't have to pass the profile uuid, because it is resolved from the session.
 */
export default function ProfilePasswordEditForm({
  onPasswordChangeSuccess,
}: {
  onPasswordChangeSuccess: Dispatch<void>;
}) {
  const { register, handleSubmit, formState } = useZodForm({ schema });
  const { mutate, isLoading } = useMutation({
    mutationFn: changePassword,
  });

  const onSubmit = (data: z.infer<typeof schema>) =>
    mutate(
      { password: data.pin },
      {
        onSuccess: () => {
          toast.success("Password changed successfully");
          onPasswordChangeSuccess();
        },
        onError: () => {
          toast.error("Error while changing the password");
        },
      },
    );

  return (
    <form className="flex flex-col gap-10" onSubmit={handleSubmit(onSubmit)}>
      <fieldset disabled={isLoading} className="flex flex-col items-center gap-10">
        <Input placeholder="New password" type="password" {...register("pin")} />
        <Button type="submit">
          {isLoading ? <Icons.spinner className="animate-spin text-secondary" /> : <>Change PIN</>}
        </Button>
      </fieldset>
    </form>
  );
}
