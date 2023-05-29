import { Reward } from "@/types/reward";

import { formatISODateToReadable } from "@/lib/utils";

export default function RewardInfo({ reward }: { reward: Reward }) {
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex w-full flex-col gap-1 rounded-md bg-secondary p-1">
        <h1 className="text-sm font-bold">Costs</h1>
        <div className="flex flex-row gap-1">
          <p className="text-3xl">{reward?.cost}</p>
          <p className="self-end">Points</p>
        </div>
      </div>
      <div className="flex w-full flex-col items-start rounded-md bg-secondary p-3">
        <h2 className="text-sm font-bold">Description</h2>
        <p>{reward?.description}</p>
      </div>
      <div className="flex flex-row gap-3">
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
  );
}
