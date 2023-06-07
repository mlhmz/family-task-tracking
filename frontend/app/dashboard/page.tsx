"use client";

import { useContext } from "react";

import { PermissionType } from "@/types/permission-type";
import { DashboardSkeleton } from "@/components/ui/skeleton/dashboard-skeleton";

import { ProfileContext } from "../profile-context";
import PrivilegedDashboard from "./privileged-dashboard";
import UnprivilegedDashboard from "./unprivileged-dashboard";

const Page = () => {
  const { data: profile, isLoading } = useContext(ProfileContext);
  return (
    <div className="container">
      <h1 className="my-5 text-2xl font-extrabold leading-tight tracking-tighter md:text-4xl lg:text-5xl">
        Dashboard
      </h1>
      {isLoading && <DashboardSkeleton />}
      {profile && profile.permissionType === PermissionType.Member && <UnprivilegedDashboard />}
      {profile && profile.permissionType === PermissionType.Admin && <PrivilegedDashboard />}
    </div>
  );
};

export default Page;
