
import Avatar from "boring-avatars";

import { Profile } from "@/types/profile";
import { useRouter } from "next/navigation";

interface ProfileSelectorProps {
  profile: Profile;
}

export default function ProfileSelector(props: ProfileSelectorProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-3" key={props.profile.uuid}>
      <div
        className="m-auto w-full cursor-pointer rounded-full bg-secondary hover:brightness-90"
        onClick={() => router.push(`/profile/auth/${props.profile.uuid}`)}>
        <Avatar
          size={180}
          name={props.profile.uuid}
          variant="beam"
          colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
        />
      </div>
      <p className="text-l text-center">{props.profile.name}</p>
    </div>
  );
}
