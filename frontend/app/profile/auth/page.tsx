"use client";



import ProfileSelector from "@/components/profile-selector";
import { useProfiles } from "@/hooks/fetch/use-profiles";

export default function ProfileAuth() {
  const { data } = useProfiles();

  if (!data) {
    return <h1>No data</h1>
  }
  return (
    <div className="m-auto my-5 flex w-full flex-col gap-2">
      <h1 className="text-center text-2xl font-bold">Select a Profile</h1>
      <div className="m-auto flex flex-row flex-wrap justify-center gap-2">
        {data.map((profile) => (
          <ProfileSelector profile={profile} routeToProfile={true} key={profile.uuid} />
        ))}
      </div>
    </div>
  );
}
