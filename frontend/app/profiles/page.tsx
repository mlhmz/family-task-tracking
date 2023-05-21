"use client";

import { useProfiles } from "@/hooks/fetch/use-profiles";

import ProfileDataTable from "@/components/profile-data-table";

export default function ProfilesPage() {
  const { data } = useProfiles();

  return (
    <div>
      <div className="m-auto my-5 flex w-1/3 flex-col gap-5">
        <h1 className="text-center text-2xl font-bold">Profiles</h1>
        <ProfileDataTable data={Array.isArray(data) ? data : []} />
      </div>
    </div>
  );
}
