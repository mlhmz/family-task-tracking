"use client";

import { useContext } from "react";

import Link from "next/link";

import { AvatarImage } from "@radix-ui/react-avatar";
import { signIn, signOut, useSession } from "next-auth/react";

import { siteConfig } from "@/config/site";

import { buttonVariants } from "@/components/ui/button";

import { Icons } from "@/components/icons";
import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";

import { ProfileContext } from "@/app/profile-context";

import { Avatar } from "./ui/avatar";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "./ui/context-menu";

export function SiteHeader() {
  const { status } = useSession();
  const { data } = useContext(ProfileContext);
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
                onClick={() => signOut()}
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                })}>
                Sign Out
              </div>
            )}
            {status === "unauthenticated" && (
              <div
                onClick={() => signIn()}
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                })}>
                Sign In
              </div>
            )}
            {data ? (
              <ContextMenu>
                <ContextMenuTrigger>
                  <Avatar className="rounded-md">
                    <AvatarImage src={data.imageUrl}></AvatarImage>
                  </Avatar>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem>Switch profile</ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ) : (
              <></>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
