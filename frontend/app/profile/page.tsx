"use client";

import { useContext, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { ProfileSkeleton } from "@/components/ui/skeleton/profile-skeleton";

import ProfileInfo from "@/components/common/profile/profile-info";
import ProfileRewards from "@/components/common/reward/profile-rewards";

import { ProfileContext } from "../profile-context";
import ProfileEditForm from "./profile-edit-form";

export default function Profile() {
  const { data } = useContext(ProfileContext);
  const [open, setOpen] = useState(false);

  if (!data || !data.uuid) {
    return <ProfileSkeleton />;
  }
  return (
    <div className="m-auto my-5 flex w-1/3 flex-col gap-5">
      <ProfileInfo data={data} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Edit profile</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>Edit Profile</DialogHeader>
          <ProfileEditForm initialData={data} closeDialog={() => setOpen(!open)} />
        </DialogContent>
      </Dialog>
      <ProfileRewards profileUuid={data.uuid} />
    </div>
  );
}
