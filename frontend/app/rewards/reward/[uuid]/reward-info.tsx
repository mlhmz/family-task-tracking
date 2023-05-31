import { Reward } from "@/types/reward";

import { formatISODateToReadable } from "@/lib/utils";

import { Separator } from "@/components/ui/separator";

export default function RewardInfo({ reward }: { reward: Reward }) {
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex w-full flex-col gap-5">
        <h3 className="font-bold">Costs</h3>
        <div className="flex flex-row gap-1">
          <p className="text-3xl">{reward?.cost}</p>
          <p className="self-end">Points</p>
        </div>
      </div>
      <Separator />
      <div className="flex w-full flex-col gap-5">
        <h3 className="font-bold">Description</h3>
        <p>{reward?.description}</p>
      </div>
      <Separator />
      <div className="flex w-full flex-col gap-5">
        <h3 className="font-bold">Timestamps</h3>
        <div className="flex flex-row items-center justify-center gap-5">
          <div className="flex flex-col items-center">
            <h1 className="text-sm font-bold">Created At</h1>
            <p className="text-center">{formatISODateToReadable(reward?.createdAt)}</p>
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-sm font-bold">Updated At</h1>
            <p>{formatISODateToReadable(reward?.updatedAt)}</p>
          </div>
          {reward.redeemed && (
            <div className="flex flex-col items-center">
              <h1 className="text-sm font-bold">Redeemed At</h1>
              <p>{formatISODateToReadable(reward?.redeemedAt)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
