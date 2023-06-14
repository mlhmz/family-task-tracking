"use client";

import { useContext, useState } from "react";
import Link from "next/link";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

import { PermissionType } from "@/types/permission-type";
import { Reward } from "@/types/reward";
import { deleteReward, getRewards } from "@/lib/reward-requests";
import { formatISODateToReadable } from "@/lib/utils";
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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import DataTableSkeleton from "@/components/ui/skeleton/data-table-skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ProfileShowcase from "@/components/common/profile/profile-showcase";
import { Icons } from "@/components/icons";
import { useZodForm } from "@/app/hooks/use-zod-form";
import { ProfileContext } from "@/app/profile-context";

import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "../../components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";
import RedeemRewardButton from "./redeem-reward-button";
import RewardCreateForm from "./reward-create-form";
import RewardEditForm from "./reward-edit-form";
import RewardFilterMenu from "./reward-filter-menu";

const schema = z.object({
  name: z.string().optional(),
});

type SearchQueryFormResult = z.infer<typeof schema>;

export default function RewardDataTable() {
  const [searchQuery, setSearchQuery] = useState({ query: "" });
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedRewards, setSelectedRewards] = useState<Reward[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { register, handleSubmit } = useZodForm({ schema });
  const { data: profile } = useContext(ProfileContext);
  const queryClient = useQueryClient();
  const { mutateAsync: mutateAsyncDelete, isLoading: isDeleteLoading } = useMutation({
    mutationFn: deleteReward,
  });
  const { data, isLoading: isSearchLoading } = useQuery({
    queryKey: ["rewards", searchQuery],
    queryFn: () => getRewards(searchQuery.query),
    initialData: [],
  });

  const isChecked = (reward: Reward) =>
    selectedRewards.some((selectedProfile) => selectedProfile.uuid === reward.uuid);

  const isEveryRewardChecked = () => {
    return selectedRewards.length === data.length;
  };

  const onCheckedChange = (reward: Reward) => {
    if (isChecked(reward)) {
      setSelectedRewards(selectedRewards.filter((entry) => entry.uuid !== reward.uuid));
    } else {
      setSelectedRewards([...selectedRewards, reward]);
    }
  };

  const onEveryRewardCheckedChange = () => {
    if (isEveryRewardChecked()) {
      setSelectedRewards([]);
    } else {
      setSelectedRewards(data);
    }
  };

  const onSearchSubmit = (formData: SearchQueryFormResult) => {
    setSelectedRewards([]);
    setSearchQuery({ query: "" });
    formData.name && setSearchQuery({ query: `name:${formData.name}` });
  };

  const resetAfterDelete = () => {
    setSelectedRewards([]);
    queryClient.invalidateQueries(["rewards", searchQuery]);
  };

  const deleteEverySelectedReward = () => {
    if (selectedRewards.length === 0) {
      toast(`Please select at least one reward.`);
      return;
    }
    const deletePromises = selectedRewards.map((reward) => mutateAsyncDelete(reward.uuid ?? ""));
    toast.promise(Promise.all(deletePromises), {
      loading: `Deleting ${selectedRewards.length} reward(s)...`,
      success: () => {
        resetAfterDelete();
        return `${selectedRewards.length} reward(s) were successfully deleted.`;
      },
      error: (responses: Response[]) => {
        resetAfterDelete();
        const failedDeletions = responses.filter((response) => !response.ok).length;
        const allRequestedDeletions = responses.length;
        return `${failedDeletions} from ${allRequestedDeletions} reward(s) couldn't be deleted, please try again.`;
      },
    });
  };

  if (!profile || profile.permissionType !== PermissionType.Admin) {
    return <DataTableSkeleton />;
  }
  return (
    <div>
      <div className="my-2 flex flex-col gap-2 md:flex-row">
        <form onSubmit={handleSubmit(onSearchSubmit)} className="grow">
          <Input placeholder="Search by Name..." {...register("name")} />
        </form>
        <div className="flex justify-end">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button variant="ghost">
                  {isSearchLoading ? (
                    <Icons.spinner className="animate-spin text-primary" />
                  ) : (
                    <Icons.search />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Trigger search</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button variant="ghost" onClick={() => setShowFilterMenu(!showFilterMenu)}>
                  <Icons.filter />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Show filter menu</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {profile?.permissionType === PermissionType.Admin && (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="ghost">
                          <Icons.packagePlus />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>Create a Reward</DialogHeader>
                        <RewardCreateForm
                          handleCloseDialog={() => {
                            setIsCreateDialogOpen(false);
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                  </TooltipTrigger>
                  <TooltipContent>Create reward</TooltipContent>
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
                          <AlertDialogTitle>Delete reward(s)</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete the selected reward(s)?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={deleteEverySelectedReward}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TooltipTrigger>
                  <TooltipContent>Delete reward(s)</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}
        </div>
      </div>
      {showFilterMenu && (
        <Card className="my-2">
          <CardHeader>Filter</CardHeader>
          <CardContent>
            <RewardFilterMenu
              sendQuery={(query) => {
                setSelectedRewards([]);
                setSearchQuery({ query: query });
              }}
            />
          </CardContent>
        </Card>
      )}
      <div className="rounded-md outline outline-1 outline-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">
                <div className="grid place-items-center">
                  <Checkbox checked={isEveryRewardChecked()} onCheckedChange={onEveryRewardCheckedChange} />
                </div>
              </TableHead>
              <TableHead className="text-center">Name</TableHead>
              <TableHead className="text-center">Costs (Points)</TableHead>
              <TableHead className="text-center">Created At</TableHead>
              <TableHead className="text-center">Updated At</TableHead>
              <TableHead className="text-center">Redeemed</TableHead>
              <TableHead className="text-center">Redeemed At</TableHead>
              <TableHead className="text-center">Redeemed By</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((reward) => (
              <TableRow key={reward.uuid} className="table-">
                <TableCell>
                  <div className="grid place-items-center">
                    <Checkbox checked={isChecked(reward)} onCheckedChange={() => onCheckedChange(reward)} />
                  </div>
                </TableCell>
                <TableCell className="text-center">{reward.name}</TableCell>
                <TableCell className="text-center">{reward.cost}</TableCell>
                <TableCell className="text-center">{formatISODateToReadable(reward.createdAt)}</TableCell>
                <TableCell className="text-center">{formatISODateToReadable(reward.updatedAt)}</TableCell>
                <TableCell className="text-center">
                  {reward.redeemed ? <Icons.check className="m-auto" /> : <Icons.x className="m-auto" />}
                </TableCell>
                <TableCell className="text-center">{formatISODateToReadable(reward.redeemedAt)}</TableCell>
                <TableCell>
                  <>{reward?.redeemedBy && <ProfileShowcase profileUuid={reward.redeemedBy} />}</>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center">
                    <RedeemRewardButton
                      reward={reward}
                      handleInvalidateOnSuccess={() =>
                        queryClient.invalidateQueries(["rewards", searchQuery])
                      }
                    />
                    {profile?.permissionType === PermissionType.Admin && (
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
                                    queryClient.invalidateQueries(["rewards"]);
                                    setIsEditDialogOpen(false);
                                  }}
                                />
                              </DialogContent>
                            </Dialog>
                          </TooltipTrigger>
                          <TooltipContent>Edit Reward</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Button variant="ghost">
                            <Link href={`/rewards/reward/${reward?.uuid}`}>
                              <Icons.externalLink />
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>View</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
