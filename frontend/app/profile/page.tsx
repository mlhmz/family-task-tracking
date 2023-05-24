"use client";

import { useContext, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { ProfileSkeleton } from "@/components/ui/skeleton/profile-skeleton";

import ProfileEditForm from "@/components/profile-edit-form";
import ProfileInfo from "@/components/profile-info";

import { ProfileContext } from "../profile-context";

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
    </div>
  );
}
