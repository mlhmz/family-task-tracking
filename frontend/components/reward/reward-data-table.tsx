"use client";

import { useContext, useState } from "react";

import Link from "next/link";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { PermissionType } from "@/types/permission-type";
import { Reward } from "@/types/reward";

import { formatISODateToReadable } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { Icons } from "@/components/icons";

import { useZodForm } from "@/app/hooks/use-zod-form";
import { ProfileContext } from "@/app/profile-context";

import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "../ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import RewardCreateForm from "./admin/reward-create-form";

async function getRewards({ query }: { query: string }) {
  const request = new URLSearchParams({
    query: query,
  });
  const response = await fetch(`/api/v1/rewards${"?" + request}`);
  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }
  const rewards = (await response.json()) as Reward[];
  // TODO: TypeGuard
  return rewards;
}

async function deleteReward(uuid: string) {
  const response = await fetch(`/api/v1/admin/rewards/${uuid}`, { method: "DELETE" });
  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }
  return response;
}

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
  const { mutate: mutateDelete, isLoading: isDeleteLoading } = useMutation({
    mutationFn: deleteReward,
    onSuccess: () => queryClient.invalidateQueries(["rewards", searchQuery]),
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

  const onEveryProfileCheckedChange = () => {
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

  const deleteEverySelectedProfile = () => {
    selectedRewards.forEach((reward) => mutateDelete(reward.uuid ?? ""));
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSearchSubmit)}>
        <div className="my-2 flex gap-2">
          <Input placeholder="Search by Name..." {...register("name")} />
          <Button variant="ghost">
            {isSearchLoading ? <Icons.spinner className="animate-spin text-primary" /> : <Icons.search />}
          </Button>
          <Button variant="ghost" onClick={() => setShowFilterMenu(!showFilterMenu)}>
            <Icons.filter />
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost">
                <Icons.packagePlus />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>Create a Reward</DialogHeader>
              <RewardCreateForm closeDialog={() => setIsCreateDialogOpen(false)} />
            </DialogContent>
          </Dialog>
          <Button variant="ghost" onClick={deleteEverySelectedProfile}>
            {isDeleteLoading ? <Icons.spinner className="animate-spin text-primary" /> : <Icons.trash />}
          </Button>
        </div>
      </form>
      {showFilterMenu && <h1>Filter</h1>}
      <div className="rounded-md outline outline-1 outline-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">
                <div className="grid place-items-center">
                  <Checkbox checked={isEveryRewardChecked()} onCheckedChange={onEveryProfileCheckedChange} />
                </div>
              </TableHead>
              <TableHead className="text-center">Name</TableHead>
              <TableHead className="text-center">Costs (Points)</TableHead>
              <TableHead className="text-center">Created At</TableHead>
              <TableHead className="text-center">Updated At</TableHead>
              <TableHead className="text-center">Redeemed</TableHead>
              <TableHead className="text-center">Redeemed At</TableHead>
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
                <TableCell className="flex flex-col items-center gap-2">
                  <div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Button variant="ghost">
                            <Icons.checkCircle />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Redeem Reward</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    {profile?.permissionType === PermissionType.Admin && (
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
