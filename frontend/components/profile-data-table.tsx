import { useState } from "react";

import Link from "next/link";

import Avatar from "boring-avatars";

import { PermissionType } from "@/types/permission-type";
import { Profile } from "@/types/profile";

import { Icons } from "./icons";
import { Checkbox } from "./ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

export default function ProfileDataTable({ data }: { data: Profile[] }) {
  const [selectedProfiles, setSelectedProfiles] = useState<Profile[]>([]);

  const isChecked = (profile: Profile) =>
    selectedProfiles.some((selectedProfile) => selectedProfile.uuid === profile.uuid);

  const isEveryProfileChecked = () => {
    return selectedProfiles == data;
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

  return (
    <div className="rounded-md outline outline-1 outline-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <div className="grid place-items-center">
                <Checkbox checked={isEveryProfileChecked()} onCheckedChange={onEveryProfileCheckedChange} />
              </div>
            </TableHead>
            <TableHead>&nbsp;</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Points</TableHead>
            <TableHead className="text-center">Privileged</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((profile) => (
            <TableRow key={profile.uuid}>
              <TableCell>
                <div className="grid place-items-center">
                  <Checkbox checked={isChecked(profile)} onCheckedChange={() => onCheckedChange(profile)} />
                </div>
              </TableCell>
              <TableCell>
                <Link
                  className="m-auto cursor-pointer rounded-full bg-secondary hover:brightness-90"
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
  );
}
