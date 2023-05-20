"use client";

import { useContext, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import Avatar from "boring-avatars";

import { getTranslatedPTValue } from "@/types/permission-type";
import { ProfileRequest } from "@/types/profile";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { ProfileSkeleton } from "@/components/ui/skeleton/profile-skeleton";

import ProfileEditor from "@/components/profile-editor";

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
      <div className="flex items-center gap-5">
        <Avatar
          size={180}
          name={data.uuid}
          variant="beam"
          colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
        />
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">{data.name}&apos;s Profile</h1>
          <div id="badges" className="flex flex-row gap-1">
            <Badge variant={"secondary"}>
              {data.permissionType ? getTranslatedPTValue(data.permissionType) : "Unavailable"}
            </Badge>
            <Badge variant={"secondary"}>{data.points} Points</Badge>
          </div>
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Edit profile</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>Edit Profile</DialogHeader>
          <ProfileEditor
            safe={true}
            data={data}
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
