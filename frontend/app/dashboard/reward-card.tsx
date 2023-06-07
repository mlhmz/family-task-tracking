"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";

import { Reward } from "@/types/reward";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { ProfilesContext } from "../profiles-context";

export const RewardCard = ({ reward }: { reward: Reward }) => {
  const [redeemer, setRedeemer] = useState("");
  const { data: profiles } = useContext(ProfilesContext);

  useEffect(() => {
    if (profiles) {
      const profile = profiles.find((profile) => profile.uuid === reward.redeemedBy);
      if (profile) {
        setRedeemer(profile.name || "");
      }
    }
  }, [profiles, reward.redeemedBy]);

  return (
    <Card className="min-h-[16.25rem] w-1/6 min-w-[13.875rem]">
      <Link href={`/rewards/reward/${reward.uuid}`}>
        <CardHeader>
          <CardTitle>
            {reward.name && reward.name?.length > 32 ? reward.name.substring(0, 32) + "..." : reward.name}
          </CardTitle>
          <CardDescription>Redeemed by: {redeemer}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            {reward.description && reward.description?.length > 64
              ? reward.description.substring(0, 64) + "..."
              : reward.description}
          </p>
        </CardContent>
        <CardFooter>
          <Badge>{reward.cost} Points</Badge>
        </CardFooter>
      </Link>
    </Card>
  );
};
