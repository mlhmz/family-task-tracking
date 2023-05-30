import { isRewards } from "./guards";

export async function getRewards({ query }: { query?: string }) {
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
