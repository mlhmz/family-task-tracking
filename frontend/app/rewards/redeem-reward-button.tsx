import { Dispatch } from "react";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { Reward } from "@/types/reward";

import { isReward } from "@/lib/guards";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { Icons } from "@/components/icons";

async function redeemReward(reward: Reward) {
  const redeemedReward: Reward = { ...reward, redeemed: true };
  const response = await fetch(`/api/v1/rewards/${reward.uuid}`, {
    method: `PUT`,
    body: JSON.stringify(redeemedReward),
  });
  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }
  const data = await response.json();
  if (!isReward(data)) throw new Error("Problem fetching data");
  return data;
}

export default function RedeemRewardButton({
  reward,
  handleInvalidateOnSuccess,
}: {
  reward: Reward;
  handleInvalidateOnSuccess: Dispatch<void>;
}) {
  const { mutate, isLoading } = useMutation({
    mutationFn: redeemReward,
  });

  const redeem = () => {
    mutate(
      { ...reward },
      {
        onSuccess: () => {
          toast.success(`The reward '${reward.name}' was redeemed!'`);
          handleInvalidateOnSuccess();
        },
        onError: (error) =>
          toast.error(`Error redeeming reward: ${error instanceof Error ? error.message : "Unknown error"}`),
      },
    );
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Button variant="ghost" onClick={redeem}>
            {isLoading ? <Icons.spinner className="animate-spin" /> : <Icons.checkCircle />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Redeem Reward</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
