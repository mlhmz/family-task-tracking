"use client";

import { useQueryClient } from "@tanstack/react-query";

import { ProfileRequest } from "@/types/profile";

import ProfileEditor from "@/components/profile-editor";

async function createProfile(request: ProfileRequest) {
  const response = await fetch("/api/v1/admin/profiles", {
    method: "POST",
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }
  return response;
}

export default function CreateProfilePage() {
  const queryClient = useQueryClient();

  return (
    <div className="m-auto my-5 flex w-1/3 flex-col gap-5">
      <h1 className="text-center text-2xl font-bold">Create a Profile</h1>
      <ProfileEditor
        onSuccess={() => queryClient.invalidateQueries(["profiles"])}
        safe={false}
        mutationFunction={createProfile}
      />
    </div>
  );
}
