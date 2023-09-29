"use client";

import { useAuth } from "react-oidc-context";

import { useLogoutProfile } from "@/app/hooks/use-logout-profile";

import { Icons } from "./icons";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export function AuthButton() {
  const auth = useAuth();
  const { logoutProfile } = useLogoutProfile();
  const router = useRouter();

  const logout = () => {
    logoutProfile();
    auth.removeUser();
    router.push("/")
  }

  if (auth.isLoading) {
    <Button size={"sm"} variant={"ghost"}>
      <Icons.spinner className="animate-spin" />
    </Button>;
  }
  return (
    <>
      {auth.isAuthenticated ? (
        <Button size={"sm"} variant={"ghost"} onClick={logout}>
          Sign Out
        </Button>
      ) : (
        <Button size={"sm"} variant={"ghost"} onClick={() => void auth.signinRedirect()}>
          Sign In
        </Button>
      )}
    </>
  );
}
