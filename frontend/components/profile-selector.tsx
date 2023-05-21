import Link from "next/link";
import { useRouter } from "next/navigation";

import Avatar from "boring-avatars";

import { Profile } from "@/types/profile";

interface ProfileSelectorProps {
  profile: Profile;
}

export default function ProfileSelector({ profile }: ProfileSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <Link
        className="m-auto w-full cursor-pointer rounded-full bg-secondary hover:brightness-90"
        href={`/profile/select/${profile.uuid}`}>
        <Avatar
          size={180}
          name={profile.uuid}
          variant="beam"
          colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
        />
      </Link>
      <p className="text-l text-center">{profile.name}</p>
    </div>
  );
}
