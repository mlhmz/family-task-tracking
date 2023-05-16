"use client";

import { useContext } from "react";

import { getTranslatedPTValue } from "@/types/permission-type";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { ProfileContext } from "../profile-context";

export default function Profile() {
  const { profileInstance } = useContext(ProfileContext);

  return (
    <div className="m-auto my-5 flex w-1/3 flex-col gap-5">
      <img className="m-auto rounded-md" src={profileInstance.imageUrl} />
      <h1 className="text-2xl font-bold">{profileInstance.name}'s Profile</h1>
      <div id="badges" className="flex flex-row gap-1">
        <Badge variant={"secondary"}>
          {profileInstance.permissionType
            ? getTranslatedPTValue(profileInstance.permissionType)
            : "Unavailable"}
        </Badge>
        <Badge variant={"secondary"}>{profileInstance.points} Points</Badge>
      </div>
      <Button>Edit profile</Button>
    </div>
  );
}
