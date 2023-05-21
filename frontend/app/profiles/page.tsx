"use client";

import { useProfiles } from "@/hooks/fetch/use-profiles";

import ProfileDataTable from "@/components/profile-data-table";

export default function ProfilesPage() {
  const { data } = useProfiles();

  return (
    <div className="mx-10 my-10 flex flex-col gap-10 lg:mx-auto lg:w-3/4">
      <ProfileDataTable data={Array.isArray(data) ? data : []} />
    </div>
  );
}
