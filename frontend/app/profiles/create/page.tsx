import ProfileCreateForm from "@/components/profile/admin/profile-create-form";

export default function CreateProfilePage() {
  return (
    <div className="m-auto my-5 flex w-1/3 flex-col gap-5">
      <h1 className="text-center text-2xl font-bold">Create a Profile</h1>
      <ProfileCreateForm />
    </div>
  );
}
