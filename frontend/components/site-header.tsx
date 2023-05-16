"use client";

import Link from "next/link";

import { signIn, signOut, useSession } from "next-auth/react";

import { siteConfig } from "@/config/site";

import { buttonVariants } from "@/components/ui/button";

import { Icons } from "@/components/icons";
import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { useContext } from "react";
import { ProfileContext } from "@/app/profile-context";
import { Avatar } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "./ui/context-menu";

export function SiteHeader() {
  const { status } = useSession();
  const { profileInstance } = useContext(ProfileContext);
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
            
            <ContextMenu>
                <ContextMenuTrigger>
                <Avatar className="rounded-md">
                  <AvatarImage src={profileInstance.imageUrl}></AvatarImage>
                </Avatar>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem>Switch profile</ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
          </nav>
        </div>
      </div>
    </header>
  );
}
