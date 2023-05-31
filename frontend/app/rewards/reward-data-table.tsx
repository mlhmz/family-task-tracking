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

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { Icons } from "@/components/icons";

import { useZodForm } from "@/app/hooks/use-zod-form";
import { ProfileContext } from "@/app/profile-context";

import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "../../components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";
import RedeemRewardButton from "./redeem-reward-button";
import RedeemedByShowcase from "./redeemed-by-showcase";
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
    queryFn: () => getRewards({ query: searchQuery.query }),
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

  const sendToastByDeletionResponses = (responses: Response[]) => {
    if (responses.some((response) => !response.ok)) {
      const failedDeletions = responses.filter((response) => !response.ok).length;
      const allRequestedDeletions = responses.length;
      toast.error(
        `${failedDeletions} from ${allRequestedDeletions} couldn't be deleted, please try to delete the remaining rewards again.`,
      );
    } else {
      toast.success(`${responses.length} rewards were successfully deleted.`);
    }
  };

  const deleteEverySelectedReward = () => {
    const deletePromises = selectedRewards.map((reward) => mutateAsyncDelete(reward.uuid ?? ""));
    Promise.all(deletePromises).then((responses) => {
      sendToastByDeletionResponses(responses);
      queryClient.invalidateQueries(["rewards", searchQuery]);
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSearchSubmit)}>
        <div className="my-2 flex gap-2">
          <Input placeholder="Search by Name..." {...register("name")} />
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
              <TooltipContent>Trigger Search</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button variant="ghost" onClick={() => setShowFilterMenu(!showFilterMenu)}>
                  <Icons.filter />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Show Filter Menu</TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
              <TooltipContent>Create Reward</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button variant="ghost" onClick={deleteEverySelectedReward}>
                  {isDeleteLoading ? (
                    <Icons.spinner className="animate-spin text-primary" />
                  ) : (
                    <Icons.trash />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete Reward(s)</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </form>
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
                  <>{reward?.redeemedBy && <RedeemedByShowcase redeemedByUuid={reward.redeemedBy} />}</>
                </TableCell>
                <TableCell className="flex flex-col items-center gap-2">
                  <div>
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
