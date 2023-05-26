"use client";

import { useContext } from "react";

import Link from "next/link";

import Avatar from "boring-avatars";
import { signIn, signOut, useSession } from "next-auth/react";
import { Toaster } from "sonner";

import { siteConfig } from "@/config/site";

import { Button, buttonVariants } from "@/components/ui/button";

import { Icons } from "@/components/icons";
import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";

import { useLogoutProfile } from "@/app/hooks/use-logout-profile";
import { ProfileContext } from "@/app/profile-context";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function SiteHeader() {
  const { status } = useSession();
  const { data, isSuccess } = useContext(ProfileContext);
  const { logoutProfile } = useLogoutProfile();

  const handleLogout = () => {
    signOut();
    logoutProfile();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <Toaster richColors={true} closeButton={true} />
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
              <div
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                })}>
                <Icons.gitHub className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <ThemeToggle />
            {status === "authenticated" && (
              <Button size={"sm"} variant={"ghost"} onClick={handleLogout}>
                Sign Out
              </Button>
            )}
            {status === "unauthenticated" && (
              <Button size={"sm"} variant={"ghost"} onClick={() => signIn()}>
                Sign In
              </Button>
            )}
            {isSuccess && data.uuid && (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div>
                    <Avatar
                      size={32}
                      name={data.uuid}
                      variant="beam"
                      colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
                    />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>{data.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/profile/select">Switch profile</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
