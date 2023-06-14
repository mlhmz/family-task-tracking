import ProfileDataTable from "./profile-data-table";

export default function ProfilesPage() {
  return (
    <div className="container">
      <h1 className="my-5 text-2xl font-extrabold leading-tight tracking-tighter md:text-4xl lg:text-5xl">
        Profiles
      </h1>
      <ProfileDataTable />
    </div>
  );
}
