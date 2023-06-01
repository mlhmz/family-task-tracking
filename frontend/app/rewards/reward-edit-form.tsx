"use client";

import { Dispatch } from "react";
import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

import { Reward, RewardRequest } from "@/types/reward";
import { updateReward } from "@/lib/reward-requests";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Icons } from "@/components/icons";
import { useZodForm } from "@/app/hooks/use-zod-form";

const schema = z.object({
  name: z.string(),
  description: z.string(),
  cost: z.number(),
  redeemed: z.boolean(),
});

export default function RewardEditForm({
  handleCloseDialog,
  reward,
}: {
  handleCloseDialog: Dispatch<void>;
  reward: Reward;
}) {
  const { register, handleSubmit, formState, setValue } = useZodForm({ schema, defaultValues: reward });
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate, error, isLoading } = useMutation({
    mutationFn: (data: RewardRequest) => updateReward(data, reward.uuid),
    onSuccess: () => queryClient.invalidateQueries(["rewards"]),
  });

  const onSubmit = (formData: RewardRequest) =>
    mutate(
      { ...formData },
      {
        onSuccess: () => {
          toast.success(`The reward '${reward.name}' was updated!`, {
            action: {
              label: "View",
              onClick: () => router.push(`/rewards/reward/${reward.uuid}`),
            },
          });
          handleCloseDialog();
        },
      },
    );

  const onCheckedChange = (checked: boolean) => {
    setValue("redeemed", checked);
  };

  return (
    <div>
      <form className="my-10 flex flex-col gap-10" onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={isLoading} className="flex flex-col items-center gap-10">
          <Input placeholder="Name" {...register("name")} />
          <Input placeholder="Description" {...register("description")} />
          <Input placeholder="Cost" type="number" {...register("cost", { valueAsNumber: true })} />
          <div className="flex gap-2">
            <Switch
              defaultChecked={reward?.redeemed}
              onCheckedChange={onCheckedChange}
              id="privileged-switch"
            />
            <p>Redeemed</p>
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
