import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Avatar from "boring-avatars";
import Link from "next/link";
import { useProfile } from "../hooks/fetch/use-profile";

export default function RedeemedByShowcase({ redeemedByUuid }: { redeemedByUuid: string }) {
  const { data } = useProfile(redeemedByUuid);

  return (
    <div className="flex flex-row items-center justify-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Link
              className="flex cursor-pointer flex-col items-center rounded-full bg-secondary hover:brightness-90"
              href={`/profiles/profile/${data?.uuid}`}>
              <Avatar
                size={32}
                name={data?.uuid}
                variant="beam"
                colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
              />
            </Link>
          </TooltipTrigger>
          <TooltipContent>{data?.name}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
