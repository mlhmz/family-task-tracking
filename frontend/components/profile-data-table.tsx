"use client";

import { useState } from "react";

import Link from "next/link";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Avatar from "boring-avatars";
import { z } from "zod";

import { PermissionType } from "@/types/permission-type";
import { Profile } from "@/types/profile";

import { isProfile } from "@/lib/guards";
import { formatISODateToReadable } from "@/lib/utils";

import { useZodForm } from "@/hooks/use-zod-form";

import { Icons } from "./icons";
import ProfileFilterMenu from "./profile-filter-menu";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

async function getProfiles({ query }: { query: string[] }) {
  const request = new URLSearchParams({
    query: query.join(","),
  });
  const response = await fetch(`/api/v1/profiles${"?" + request}`);
  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }
  const profiles = (await response.json()) as Profile[];
  return profiles.filter(isProfile);
}

async function deleteProfile(uuid: string) {
  const response = await fetch(`/api/v1/admin/profiles/${uuid}`, { method: "DELETE" });
  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }
  return response;
}

interface SearchQuery {
  name?: string;
}

const schema = z.object({
  name: z.string().optional(),
});

export default function ProfileDataTable() {
  const [searchQuery, setSearchQuery] = useState({ query: [""] });
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedProfiles, setSelectedProfiles] = useState<Profile[]>([]);
  const { register, handleSubmit } = useZodForm({ schema });
  const { mutate: mutateDelete, isLoading: isDeleteLoading } = useMutation({
    mutationFn: deleteProfile,
    onSuccess: () => queryClient.invalidateQueries(["profiles"]),
  });
  const { data, isLoading: isSearchLoading } = useQuery({
    queryKey: ["profiles", searchQuery],
    queryFn: () => getProfiles({ query: searchQuery.query }),
    initialData: [],
  });
  const queryClient = useQueryClient();

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

  const onSearchSubmit = (formData: SearchQuery) => {
    setSearchQuery({ query: [] });
    formData.name && setSearchQuery({ query: [`name:${formData.name}`] });
  };

  const deleteEverySelectedProfile = () => {
    selectedProfiles.forEach((profile) => mutateDelete(profile.uuid ?? ""));
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSearchSubmit)}>
        <div className="my-2 flex gap-2">
          <Input placeholder="Search by Name..." {...register("name")} />
          <Button variant="ghost">
            {isSearchLoading ? <Icons.spinner className="animate-spin text-primary" /> : <Icons.search />}
          </Button>
          <Button variant="ghost" onClick={() => setShowFilterMenu(!showFilterMenu)}>
            <Icons.filter />
          </Button>
          <Link href="/profiles/create">
            <Button variant="ghost">
              <Icons.userplus />
            </Button>
          </Link>
          <Button variant="ghost" onClick={deleteEverySelectedProfile}>
            {isDeleteLoading ? <Icons.spinner className="animate-spin text-primary" /> : <Icons.trash />}
          </Button>
        </div>
      </form>
      {showFilterMenu && <ProfileFilterMenu sendQuery={(query) => setSearchQuery({ query: [query] })} />}
      <div className="rounded-md outline outline-1 outline-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">
                <div className="grid place-items-center">
                  <Checkbox checked={isEveryProfileChecked()} onCheckedChange={onEveryProfileCheckedChange} />
                </div>
              </TableHead>
              <TableHead className="w-[60px]">&nbsp;</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead className="text-center">Privileged</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((profile) => (
              <TableRow key={profile.uuid}>
                <TableCell>
                  <div className="grid place-items-center">
                    <Checkbox checked={isChecked(profile)} onCheckedChange={() => onCheckedChange(profile)} />
                  </div>
                </TableCell>
                <TableCell>
                  <Link
                    className="inline cursor-pointer rounded-full bg-secondary hover:brightness-90"
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
                <TableCell>{profile.createdAt && formatISODateToReadable(profile.createdAt)}</TableCell>
                <TableCell>{profile.updatedAt && formatISODateToReadable(profile.updatedAt)}</TableCell>
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
