import RewardCreateForm from "@/components/reward/admin/reward-create-form";

export default function CreateProfilePage() {
  return (
    <div className="m-auto my-5 flex w-1/3 flex-col gap-5">
      <h1 className="text-center text-2xl font-bold">Create a Reward</h1>
      <RewardCreateForm />
    </div>
  );
}
