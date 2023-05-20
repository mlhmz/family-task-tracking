"use client";

import { useContext, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { PermissionType } from "@/types/permission-type";
import { ProfileRequest } from "@/types/profile";

import { useProfile } from "@/hooks/fetch/use-profile";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { ProfileSkeleton } from "@/components/ui/skeleton/profile-skeleton";

import ProfileEditor from "@/components/profile-editor";
import ProfileInfo from "@/components/profile-info";

import { ProfileContext } from "@/app/profile-context";

async function editProfile(request: ProfileRequest, uuid?: string) {
  const response = await fetch(`/api/v1/admin/profiles/${uuid}`, {
    method: "PUT",
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }
  return response;
}

export default function ProfileInfoPage({ params }) {
  const { data: profileInstance } = useContext(ProfileContext);
  const { data: selectedProfile } = useProfile(params.uuid);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

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
            <ProfileEditor
              initialData={selectedProfile}
              mutationFunction={(data) => editProfile(data, selectedProfile.uuid)}
              onSuccess={() => {
                queryClient.invalidateQueries(["profile", { uuid: selectedProfile.uuid }]);
                queryClient.invalidateQueries(["profiles"]);
                setOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
