"use client";

import { useContext, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { ProfileSkeleton } from "@/components/ui/skeleton/profile-skeleton";
import ProfileInfo from "@/components/common/profile/profile-info";
import ProfileRewards from "@/components/common/reward/profile-rewards";

import { ProfileContext } from "../profile-context";
import ProfileEditForm from "./profile-edit-form";
import ProfilePasswordEditForm from "./profile-password-edit-form";

export default function Profile() {
  const { data } = useContext(ProfileContext);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openPasswordChangeDialog, setOpenPasswordChangeDialog] = useState(false);

  if (!data || !data.uuid) {
    return <ProfileSkeleton />;
  }
  return (
    <div className="m-auto my-5 flex flex-col gap-5 md:w-1/3">
      <ProfileInfo data={data} />
      <div className="flex flex-row gap-2">
        <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
          <DialogTrigger asChild>
            <Button className="w-1/2">Edit profile</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>Edit Profile</DialogHeader>
            <ProfileEditForm initialData={data} closeDialog={() => setOpenEditDialog(!openEditDialog)} />
          </DialogContent>
        </Dialog>
        <Dialog open={openPasswordChangeDialog} onOpenChange={setOpenPasswordChangeDialog}>
          <DialogTrigger asChild>
            <Button className="w-1/2">Edit PIN</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>Edit your password</DialogHeader>
            <ProfilePasswordEditForm onPasswordChangeSuccess={() => setOpenPasswordChangeDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <ProfileRewards profileUuid={data.uuid} />
    </div>
  );
}
