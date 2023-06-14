"use client";

import { useContext, useState } from "react";
import Link from "next/link";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Avatar from "boring-avatars";
import { toast } from "sonner";
import { z } from "zod";

import { PermissionType } from "@/types/permission-type";
import { Profile } from "@/types/profile";
import { deleteProfile, getProfiles } from "@/lib/profile-requests";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import DataTableSkeleton from "@/components/ui/skeleton/data-table-skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Icons } from "@/components/icons";
import { useZodForm } from "@/app/hooks/use-zod-form";

import { ProfileContext } from "../profile-context";
import ProfileCreateForm from "./profile-create-form";
import ProfileFilterMenu from "./profile-filter-menu";

const schema = z.object({
  name: z.string().optional(),
});

type SearchQueryFormResult = z.infer<typeof schema>;

export default function ProfileDataTable() {
  const [searchQuery, setSearchQuery] = useState({ query: "" });
  const [hasOpenFilterMenu, setHasOpenFilterMenu] = useState(false);
  const [hasOpenCreateDialog, setHasOpenCreateDialog] = useState(false);
  const [selectedProfiles, setSelectedProfiles] = useState<Profile[]>([]);
  const { register, handleSubmit } = useZodForm({ schema });
  const queryClient = useQueryClient();
  const { mutateAsync: mutateAsyncDelete, isLoading: isDeleteLoading } = useMutation({
    mutationFn: deleteProfile,
    onSuccess: () => queryClient.invalidateQueries(["profiles", searchQuery]),
    onError: (error) =>
      toast.error(
        `Error deleting profile: ${error instanceof Error ? error.message : "Unknown error occurred"}`,
      ),
  });
  const { data, isLoading: isSearchLoading } = useQuery({
    queryKey: ["profiles", searchQuery],
    queryFn: () => getProfiles({ query: searchQuery.query }),
    initialData: [],
  });
  const { data: profile } = useContext(ProfileContext);

  const isChecked = (profile: Profile) =>
    selectedProfiles.some((selectedProfile) => selectedProfile.uuid === profile.uuid);

  const isEveryProfileChecked = () => {
    return selectedProfiles.length === data.length;
  };

  const onCheckedChange = (profile: Profile) => {
    if (isChecked(profile)) {
      setSelectedProfiles(selectedProfiles.filter((entry) => entry.uuid !== profile.uuid));
    } else {
      setSelectedProfiles([...selectedProfiles, profile]);
    }
  };

  const onEveryProfileCheckedChange = () => {
    if (isEveryProfileChecked()) {
      setSelectedProfiles([]);
    } else {
      setSelectedProfiles(data);
    }
  };

  const onSearchSubmit = (formData: SearchQueryFormResult) => {
    setSelectedProfiles([]);
    setSearchQuery({ query: "" });
    formData.name && setSearchQuery({ query: `name:${formData.name}` });
  };

  const sendToastByDeletionResponses = (responses: Response[]) => {
    if (responses.some((response) => !response.ok)) {
      const failedDeletions = responses.filter((response) => !response.ok).length;
      const allRequestedDeletions = responses.length;
      toast.error(
        `${failedDeletions} from ${allRequestedDeletions} profiles couldn't be deleted, please try to delete the remaining profiles again.`,
      );
    } else {
      toast.success(`${responses.length} profiles were successfully deleted.`);
    }
  };

  const resetAfterDelete = () => {
    setSelectedProfiles([]);
    queryClient.invalidateQueries(["profiles", searchQuery]);
  };

  const deleteEverySelectedProfile = () => {
    if (selectedProfiles.length === 0) {
      toast(`Please select at least one profile.`);
      return;
    }
    const deletePromises = selectedProfiles.map((reward) => mutateAsyncDelete(reward.uuid ?? ""));
    toast.promise(Promise.all(deletePromises), {
      loading: `Deleting ${selectedProfiles.length} profile(s)...`,
      success: () => {
        resetAfterDelete();
        return `${selectedProfiles.length} profile(s) were successfully deleted.`;
      },
      error: (responses: Response[]) => {
        resetAfterDelete();
        const failedDeletions = responses.filter((response) => !response.ok).length;
        const allRequestedDeletions = responses.length;
        return `${failedDeletions} from ${allRequestedDeletions} profile(s) couldn't be deleted, please try again.`;
      },
    });
  };

  if (!profile || profile.permissionType !== PermissionType.Admin) {
    return <DataTableSkeleton />;
  }
  return (
    <div>
      <div className="my-2 flex gap-2">
        <form onSubmit={handleSubmit(onSearchSubmit)} className="grow">
          <Input placeholder="Search by Name..." {...register("name")} />
        </form>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="ghost">
                {isSearchLoading ? <Icons.spinner className="animate-spin text-primary" /> : <Icons.search />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Trigger search</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="ghost" onClick={() => setHasOpenFilterMenu(!hasOpenFilterMenu)}>
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
                  <Dialog
                    open={hasOpenCreateDialog}
                    onOpenChange={(value: boolean) => setHasOpenCreateDialog(value)}>
                    <DialogTrigger>
                      <Button variant="ghost">
                        <Icons.userPlus />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>Create a Profile</DialogHeader>
                      <ProfileCreateForm
                        handleCloseDialog={() => setHasOpenCreateDialog(!hasOpenCreateDialog)}
                      />
                    </DialogContent>
                  </Dialog>
                </TooltipTrigger>
                <TooltipContent>Create profile</TooltipContent>
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
                        <AlertDialogTitle>Delete profile(s)</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete the selected profile(s)?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={deleteEverySelectedProfile}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TooltipTrigger>
                <TooltipContent>Delete profile(s)</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}
      </div>
      {hasOpenFilterMenu && (
        <ProfileFilterMenu
          sendQuery={(query) => {
            setSelectedProfiles([]);
            setSearchQuery({ query: query });
          }}
        />
      )}
      <div className="rounded-md outline outline-1 outline-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">
                <div className="grid place-items-center">
                  <Checkbox checked={isEveryProfileChecked()} onCheckedChange={onEveryProfileCheckedChange} />
                </div>
              </TableHead>
              <TableHead className="w-[60px]">&nbsp;</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead className="text-center">Privileged</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((profile) => (
              <TableRow key={profile.uuid}>
                <TableCell>
                  <div className="grid place-items-center">
                    <Checkbox checked={isChecked(profile)} onCheckedChange={() => onCheckedChange(profile)} />
                  </div>
                </TableCell>
                <TableCell>
                  <Link
                    className="inline cursor-pointer rounded-full bg-secondary hover:brightness-90"
                    href={`/profiles/profile/${profile.uuid}`}>
                    <Avatar
                      size={32}
                      name={profile.uuid}
                      variant="beam"
                      colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
                    />
                  </Link>
                </TableCell>
                <TableCell>
                  <p>{profile.name}</p>
                </TableCell>
                <TableCell>{profile.points}</TableCell>
                <TableCell>{profile.createdAt && formatISODateToReadable(profile.createdAt)}</TableCell>
                <TableCell>{profile.updatedAt && formatISODateToReadable(profile.updatedAt)}</TableCell>
                <TableCell>
                  <p>
                    {profile.permissionType === PermissionType.Admin ? (
                      <Icons.check className="m-auto" />
                    ) : (
                      <Icons.x className="m-auto" />
                    )}
                  </p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
