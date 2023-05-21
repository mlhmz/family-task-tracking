import { useEffect, useState } from "react";

import Link from "next/link";

import { useQueryClient } from "@tanstack/react-query";
import Avatar from "boring-avatars";

import { PermissionType } from "@/types/permission-type";
import { Profile } from "@/types/profile";

import { Icons } from "./icons";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

async function deleteProfile(uuid: string) {
  const response = await fetch(`/api/v1/admin/profiles/${uuid}`, { method: "DELETE" });
  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }
  return response;
}

export default function ProfileDataTable({ data }: { data: Profile[] }) {
  // Will be set initially to the table data, can be overwritten by e.g. search results
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfiles, setSelectedProfiles] = useState<Profile[]>([]);
  const queryClient = useQueryClient();

  // Hook to initially set the table data
  useEffect(() => {
    setProfiles(data);
  }, [data]);

  const isChecked = (profile: Profile) =>
    selectedProfiles.some((selectedProfile) => selectedProfile.uuid === profile.uuid);

  const isEveryProfileChecked = () => {
    return selectedProfiles == profiles;
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
      setSelectedProfiles(profiles);
    }
  };

  const deleteEverySelectedProfile = () => {
    selectedProfiles.forEach((profile) => deleteProfile(profile.uuid ?? ""));
    queryClient.invalidateQueries(["profiles"]);
  };

  return (
    <div>
      <div className="my-2 flex gap-2">
        <Input placeholder="Search..." />
        <Link href="/profiles/create">
          <Button variant="ghost">
            <Icons.userplus />
          </Button>
        </Link>
        <Button variant="ghost" onClick={deleteEverySelectedProfile}>
          <Icons.trash />
        </Button>
      </div>
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
            {profiles?.map((profile) => (
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
    </div>
  );
}
