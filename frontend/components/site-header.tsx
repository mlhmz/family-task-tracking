"use client";

import { useContext } from "react";

import Link from "next/link";

import Avatar from "boring-avatars";
import { signIn, signOut, useSession } from "next-auth/react";
import { twMerge } from "tailwind-merge";

import { siteConfig } from "@/config/site";

import { useLogoutProfile } from "@/hooks/use-logout-profile";

import { buttonVariants } from "@/components/ui/button";

import { Icons } from "@/components/icons";
import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";

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
              <div
                onClick={handleLogout}
                className={twMerge(
                  buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  }),
                  "cursor-pointer",
                )}>
                Sign Out
              </div>
            )}
            {status === "unauthenticated" && (
              <div
                onClick={() => signIn()}
                className={twMerge(
                  buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  }),
                  "cursor-pointer",
                )}>
                Sign In
              </div>
            )}
            {isSuccess && data.uuid && (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar
                    size={50}
                    name={data.uuid}
                    variant="beam"
                    colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>{data.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
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
