import Link from "next/link";

import Avatar from "boring-avatars";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useProfile } from "@/app/hooks/fetch/use-profile";

export default function RewardProfileLinkButton({ uuid }: { uuid: string }) {
  const { data } = useProfile(uuid);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Link href={`/profiles/profile/${uuid}`}>
            <Button variant="ghost" className="flex flex-col items-center justify-center">
              <Avatar
                size={28}
                name={uuid}
                variant="beam"
                colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
              />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>View Reedemer: {data?.name}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
