"use client";

import { useContext, useState } from "react";

import { useRouter } from "next/navigation";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { PermissionType } from "@/types/permission-type";
import { Reward } from "@/types/reward";

import { isReward } from "@/lib/guards";
import { deleteReward } from "@/lib/reward-requests";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import RewardProfileInfoSkeleton from "@/components/ui/skeleton/reward-profile-info-skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { Icons } from "@/components/icons";

import { ProfileContext } from "@/app/profile-context";

import RedeemRewardButton from "../../redeem-reward-button";
import RewardEditForm from "../../reward-edit-form";
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
  if (!isReward(reward)) throw new Error("Problem fetching data");
  return reward;
}

export default function RewardInfoPage({ params }: { params: any }) {
  const { data: profileInstance } = useContext(ProfileContext);
  const { data: reward } = useQuery({
    queryKey: ["reward", { uuid: params.uuid }],
    queryFn: () => getRewardByUuid(params.uuid),
  });
  const router = useRouter();
  const { mutate: mutateDelete, isLoading: isDeleteLoading } = useMutation({
    mutationFn: () => deleteReward(params.uuid),
    onSuccess: () => {
      toast.success(`The reward was successfully deleted`);
      router.push("/rewards");
    },
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  if (!reward?.uuid || !profileInstance?.uuid) {
    return <RewardProfileInfoSkeleton />;
  }
  return (
    <div className="mx-2 mt-5 flex flex-col gap-5 lg:mx-auto lg:w-1/3">
      <h1 className="text-2xl font-bold">Reward</h1>
      <div className="grid grid-cols-1 grid-rows-1">
        <div id="title" className="flex flex-row items-center justify-start gap-3">
          <h2 className="col-start-1 justify-self-start text-2xl">{reward?.name}</h2>
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
              handleInvalidateOnSuccess={() => queryClient.invalidateQueries(["reward", { uuid: params.uuid }])}
            />
          )}
          {profileInstance?.permissionType === PermissionType.Admin && (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="ghost">
                          <Icons.edit />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>Edit Reward</DialogHeader>
                        <RewardEditForm
                          reward={reward}
                          onSuccess={() => {
                            queryClient.invalidateQueries(["reward", { uuid: params.uuid }]);
                            setIsEditDialogOpen(false);
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                  </TooltipTrigger>
                  <TooltipContent>Edit Reward</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button variant="ghost" onClick={() => mutateDelete()}>
                      {isDeleteLoading ? <Icons.spinner className="animate-spin" /> : <Icons.trash />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete Reward</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}
        </div>
      </div>
      <RewardInfo reward={reward} />
    </div>
  );
}
