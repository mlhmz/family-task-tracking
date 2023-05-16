"use client";

import { useContext } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useSession } from "next-auth/react";

import { NavItem } from "@/types/nav";

import { siteConfig } from "@/config/site";

import { cn } from "@/lib/utils";

import { Icons } from "@/components/icons";

import { HouseholdContext } from "@/app/household-context";

interface MainNavProps {
  items?: NavItem[];
}

export const MainNav = ({ items }: MainNavProps) => {
  const { status } = useSession();
  const { isHouseholdEmpty } = useContext(HouseholdContext);
  const pathname = usePathname();
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="hidden items-center space-x-2 md:flex">
        <Icons.home className="h-6 w-6" />
        <span className="hidden text-xl font-bold sm:inline-block">{siteConfig.name}</span>
      </Link>
      {status === "authenticated" && !isHouseholdEmpty && items?.length ? (
        <nav className="hidden gap-6 md:flex">
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center text-lg font-semibold text-muted-foreground sm:text-sm",
                    item.disabled && "cursor-not-allowed opacity-80",
                    pathname === item.href && "text-secondary-foreground",
                  )}>
                  {item.title}
                </Link>
              ),
          )}
        </nav>
      ) : null}
    </div>
  );
};
