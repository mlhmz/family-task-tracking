"use client";

import { Dispatch } from "react";

import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

import { Reward, RewardRequest } from "@/types/reward";

import { isReward } from "@/lib/guards";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Icons } from "@/components/icons";

import { useZodForm } from "@/app/hooks/use-zod-form";

async function createReward(request: RewardRequest) {
  const response = await fetch("/api/v1/admin/rewards", {
    method: "POST",
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }
  const reward = (await response.json()) as Reward;
  if (!isReward(reward)) throw new Error("Problem fetching data");
  return reward;
}

const schema = z.object({
  name: z.string(),
  description: z.string(),
  cost: z.number(),
});

export default function RewardCreateForm({ onSuccess }: { onSuccess: Dispatch<void> }) {
  const { register, handleSubmit, formState } = useZodForm({ schema });
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate, error, isLoading } = useMutation({
    mutationFn: createReward,
    onSuccess: (reward) => {
      queryClient.invalidateQueries(["rewards"]);
      toast.success(`The reward '${reward.name}' was created!`, {
        action: {
          label: "View",
          onClick: () => router.push(`/rewards/reward/${reward.uuid}`),
        },
      });
      onSuccess();
    },
  });

  const onSubmit = (formData: RewardRequest) => mutate({ ...formData });

  return (
    <div>
      <form className="my-10 flex flex-col gap-10" onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={isLoading} className="flex flex-col items-center gap-10">
          <Input placeholder="Name" {...register("name")} />
          <Input placeholder="Description" {...register("description")} />
          <Input placeholder="Cost" type="number" {...register("cost", { valueAsNumber: true })} />
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
