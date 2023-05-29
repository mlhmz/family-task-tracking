"use client";

import { Dispatch } from "react";

import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

import { Reward, RewardRequest } from "@/types/reward";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Icons } from "@/components/icons";

import { useZodForm } from "@/app/hooks/use-zod-form";
import { Switch } from "@/components/ui/switch";

async function updateReward(request: RewardRequest, uuid?: string) {
  const response = await fetch(`/api/v1/admin/rewards/${uuid}`, {
    method: "PUT",
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }
  const reward = (await response.json()) as Reward;
  // TODO: Implement Type Guard
  return reward;
}

const schema = z.object({
  name: z.string(),
  description: z.string(),
  cost: z.number(),
  redeemed: z.boolean(),
});

export default function RewardEditForm({ onSuccess, reward }: { onSuccess: Dispatch<void>; reward: Reward }) {
  const { register, handleSubmit, formState, setValue } = useZodForm({ schema, defaultValues: reward });
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate, error, isLoading } = useMutation({
    mutationFn: (data: RewardRequest) => updateReward(data, reward.uuid),
    onSuccess: (reward) => {
      queryClient.invalidateQueries(["rewards"]);
      toast.success(`The reward '${reward.name}' was updated!`, {
        action: {
          label: "View",
          onClick: () => router.push(`/rewards/reward/${reward.uuid}`),
        },
      });
      onSuccess();
    },
  });

  const onSubmit = (formData: RewardRequest) => mutate({ ...formData });

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
