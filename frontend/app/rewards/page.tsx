import RewardDataTable from "./reward-data-table";

export default function RewardsPage() {
  return (
    <div className="container">
      <h1 className="my-5 text-2xl font-extrabold leading-tight tracking-tighter md:text-4xl lg:text-5xl">
        Rewards
      </h1>
      <RewardDataTable />
    </div>
  );
}
