import { Reward, RewardRequest } from "@/types/reward";

import { isReward, isRewards } from "./guards";

export async function getRewards(query?: string) {
  const request = new URLSearchParams({
    query: query ?? "",
  });
  const response = await fetch(`/api/v1/rewards${"?" + request}`);
  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }
  const rewards = await response.json();
  if (!isRewards(rewards)) throw new Error("Problem fetching data");
  return rewards;
}

export async function getRewardByUuid(uuid: string) {
  const response = await fetch(`/api/v1/rewards/${uuid}`);
  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }
  const reward = (await response.json()) as Reward;
  if (!isReward(reward)) throw new Error("Problem fetching data");
  return reward;
}

export async function createReward(request: RewardRequest) {
  const response = await fetch("/api/v1/admin/rewards", {
    method: "POST",
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }
  const reward = (await response.json()) as Reward;
  if (!isReward(reward)) throw new Error("Problem fetching data");
  return reward;
}

export async function redeemReward(reward: Reward) {
  const redeemedReward: Reward = { ...reward, redeemed: true };
  const response = await fetch(`/api/v1/rewards/${reward.uuid}`, {
    method: `PUT`,
    body: JSON.stringify(redeemedReward),
  });
  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }
  const data = await response.json();
  if (!isReward(data)) throw new Error("Problem fetching data");
  return data;
}

export async function updateReward(request: RewardRequest, uuid?: string) {
  const response = await fetch(`/api/v1/admin/rewards/${uuid}`, {
    method: "PUT",
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }
  const reward = await response.json();
  if (!isReward(reward)) throw new Error("Problem fetching data");
  return reward;
}

export async function deleteReward(uuid: string) {
  const response = await fetch(`/api/v1/admin/rewards/${uuid}`, { method: "DELETE" });
  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }
  return response;
}
