"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { PermissionType } from "@/types/permission-type";
import { deleteReward, getRewardByUuid } from "@/lib/reward-requests";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import InfoPageSkeleton from "@/components/ui/skeleton/info-page-skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Icons } from "@/components/icons";
import { ProfileContext } from "@/app/profile-context";

import RedeemRewardButton from "../../redeem-reward-button";
import RewardEditForm from "../../reward-edit-form";
import RewardInfo from "./reward-info";
import RewardProfileLinkButton from "./reward-profile-link-button";

export default function RewardInfoPage({ params }: { params: { uuid: string } }) {
  const { data: profileInstance } = useContext(ProfileContext);
  const { data: reward } = useQuery({
    queryKey: ["reward", { uuid: params.uuid }],
    queryFn: () => getRewardByUuid(params.uuid),
  });
  const router = useRouter();
  const { mutate: mutateDelete, isLoading: isDeleteLoading } = useMutation({
    mutationFn: deleteReward,
    onSuccess: () => router.push("/rewards"),
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const onDelete = () => {
    mutateDelete(params.uuid, { onSuccess: () => toast.success(`The reward was successfully deleted`) });
  };

  if (!reward?.uuid || !profileInstance?.uuid) {
    return <InfoPageSkeleton />;
  }
  return (
    <div className="container flex flex-col">
      <h1 className="my-5 text-2xl font-extrabold leading-tight tracking-tighter md:text-4xl lg:text-5xl">
        Reward
      </h1>
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
              handleInvalidateOnSuccess={() =>
                queryClient.invalidateQueries(["reward", { uuid: params.uuid }])
              }
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
                          handleCloseDialog={() => {
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
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost">
                          {isDeleteLoading ? <Icons.spinner className="animate-spin" /> : <Icons.trash />}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Reward</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this reward?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={onDelete}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
