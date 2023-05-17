"use client";

import { useContext } from "react";

import Avatar from "boring-avatars";

import { getTranslatedPTValue } from "@/types/permission-type";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { ProfileContext } from "../profile-context";

export default function Profile() {
  const { data } = useContext(ProfileContext);

  if (!data || !data.uuid) {
    return <h1>No profile</h1>;
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
      <Button>Edit profile</Button>
    </div>
  );
}
