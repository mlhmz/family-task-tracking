import React from "react";
import Link from "next/link";

import { useQuery } from "@tanstack/react-query";

import { getRewards } from "@/lib/reward-requests";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function ProfileRewards({ profileUuid }: { profileUuid: string }) {
  const { data } = useQuery({
    queryKey: ["rewards", { redeemedBy: profileUuid }],
    queryFn: () => getRewards({ query: "redeemedBy.uuid:" + profileUuid }),
    initialData: [],
  });

  return (
    <div>
      <ScrollArea className="rounded-md border">
        <div className="p-4">
          <h4 className="mb-4 text-sm font-medium leading-none">Redeemed Rewards</h4>
          {data
            .filter((reward) => reward.redeemed)
            .map((reward) => (
              <Link href={`/rewards/reward/${reward.uuid}`}>
                <div className="p-2 text-sm hover:bg-secondary" key={reward.uuid}>
                  {reward.name}
                </div>
                <Separator className="my-2" />
              </Link>
            ))}
        </div>
      </ScrollArea>
    </div>
  );
}
