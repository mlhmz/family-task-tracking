"use client";

import { useContext, useState } from "react";

import { PermissionType } from "@/types/permission-type";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { ProfileSkeleton } from "@/components/ui/skeleton/profile-skeleton";

import ProfileInfo from "@/components/common/profile/profile-info";

import { useProfile } from "@/app/hooks/fetch/use-profile";
import { ProfileContext } from "@/app/profile-context";

import ProfilePrivilegedEditForm from "./profile-privileged-edit-form";
import ProfileRewards from "@/components/common/reward/profile-rewards";

export default function ProfileInfoPage({ params }: { params: any }) {
  const { data: profileInstance } = useContext(ProfileContext);
  const { data: selectedProfile } = useProfile(params.uuid);
  const [open, setOpen] = useState(false);

  if (!profileInstance || !profileInstance.uuid || !selectedProfile || !selectedProfile.uuid) {
    return <ProfileSkeleton />;
  }
  return (
    <div className="m-auto my-5 flex w-1/3 flex-col gap-5">
      <ProfileInfo data={selectedProfile} />
      {profileInstance.permissionType === PermissionType.Admin && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Edit profile</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>Edit Profile</DialogHeader>
            <ProfilePrivilegedEditForm initialData={selectedProfile} closeDialog={() => setOpen(!open)} />
          </DialogContent>
        </Dialog>
      )}
      <ProfileRewards profileUuid={profileInstance.uuid} />
    </div>
  );
}
