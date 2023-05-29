"use client";

import { useContext, useState } from "react";

import Link from "next/link";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import Avatar from "boring-avatars";

import { PermissionType } from "@/types/permission-type";
import { Reward } from "@/types/reward";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { Icons } from "@/components/icons";

import { ProfileContext } from "@/app/profile-context";

import RedeemRewardButton from "../../redeem-reward-button";
import RewardInfo from "./reward-info";
import RewardProfileLinkButton from "./reward-profile-link-button";

async function getRewardByUuid(uuid: string) {
  const response = await fetch(`/api/v1/rewards/${uuid}`);
  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }
  const reward = (await response.json()) as Reward;
  // TODO: TypeGuard
  return reward;
}

export default function ProfileInfoPage({ params }: { params: any }) {
  const { data: profileInstance } = useContext(ProfileContext);
  const { data: reward } = useQuery({
    queryKey: ["reward", { uuid: params.uuid }],
    queryFn: () => getRewardByUuid(params.uuid),
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // TODO: Skeleton
  if (!reward?.uuid || !profileInstance?.uuid) {
    return <p>Skeleton</p>;
  }
  return (
    <div className="m-auto my-5 flex w-1/3 flex-col gap-5">
      <div className="grid grid-cols-1 grid-rows-2">
        <div id="title" className="flex flex-row items-center justify-start gap-3">
          <h1 className="col-start-1 justify-self-start text-3xl font-bold">{reward?.name}</h1>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="cursor-default">
                <p>{reward.redeemed ? <Icons.check className="m-auto" /> : <Icons.x className="m-auto" />}</p>
              </TooltipTrigger>
              <TooltipContent>{reward.redeemed ? "Redeemed" : "Not redeemed"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div id="actions" className="col-start-2">
          {reward.redeemed ? (
            reward.redeemedBy && <RewardProfileLinkButton uuid={reward.redeemedBy} />
          ) : (
            <RedeemRewardButton
              reward={reward}
              onSuccess={() => queryClient.invalidateQueries(["reward", { uuid: params.uuid }])}
            />
          )}
          {profileInstance?.permissionType === PermissionType.Admin && (
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button variant="ghost">
                        <Icons.edit />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit Reward</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>Edit Reward</DialogHeader>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      <RewardInfo reward={reward} />
    </div>
  );
}
