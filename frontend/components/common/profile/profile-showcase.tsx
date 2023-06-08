import Link from "next/link";

import Avatar from "boring-avatars";

import { ProfilesContext } from "@/app/profiles-context";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useContext, useMemo } from "react";

interface ProfileShowcaseProps {
  profileUuid: string,
  pictureSize?: number,
  subtitle?: boolean
}

export default function ProfileShowcase({ profileUuid, pictureSize, subtitle }: ProfileShowcaseProps) {
  const { data: profiles } = useContext(ProfilesContext);
  const profile = useMemo(
    () => profiles.find((profile) => profile.uuid === profileUuid),
    [profileUuid, profiles],
  );

  if (!profile) return <></>;
  return (
    <div className="flex items-center justify-center gap-5">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Link
              className="flex cursor-pointer flex-col items-center rounded-full bg-secondary hover:brightness-90"
              href={`/profiles/profile/${profile?.uuid}`}>
              <Avatar
                size={pictureSize ?? 32}
                name={profile?.uuid}
                variant="beam"
                colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
              />
            </Link>
          </TooltipTrigger>
          <TooltipContent>{profile?.name}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {subtitle && <p>{profile.name}</p>}
    </div>
  );
}
