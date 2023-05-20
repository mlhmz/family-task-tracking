"use client";

import { useContext, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { ProfileRequest } from "@/types/profile";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { ProfileSkeleton } from "@/components/ui/skeleton/profile-skeleton";

import ProfileEditor from "@/components/profile-editor";
import ProfileInfo from "@/components/profile-info";

import { ProfileContext } from "../profile-context";

async function editProfile(request: ProfileRequest) {
  const response = await fetch("/api/v1/profiles/profile", {
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

export default function Profile() {
  const { data } = useContext(ProfileContext);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

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
          <ProfileEditor
            safe
            initialData={data}
            mutationFunction={editProfile}
            onSuccess={() => {
              queryClient.invalidateQueries(["profile"]);
              setOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
