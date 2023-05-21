"use client";

import { useProfiles } from "@/hooks/fetch/use-profiles";

import ProfileDataTable from "@/components/profile-data-table";

export default function ProfilesPage() {
  const { data } = useProfiles();

  return (
    <div className="mx-10 my-10 flex flex-col gap-10 lg:m-auto lg:w-3/4">
      <h1 className="text-center text-2xl font-bold">Profiles</h1>
      <ProfileDataTable data={Array.isArray(data) ? data : []} />
    </div>
  );
}
