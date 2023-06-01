"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useSession } from "next-auth/react";

import { NavItem } from "@/types/nav";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";

const Home = () => {
  return (
    <>
      <Icons.home className="h-6 w-6" />
      <span className="hidden text-xl font-bold sm:inline-block">{siteConfig.name}</span>
    </>
  );
};

interface MainNavProps {
  items?: NavItem[];
}

export const MainNav = ({ items }: MainNavProps) => {
  const { status } = useSession();
  const pathname = usePathname();
  const isWizard = pathname.match("/wizard.*");

  return (
    <div className="flex gap-6 md:gap-10">
      {isWizard ? (
        <div className="hidden items-center space-x-2 md:flex">
          <Home />
        </div>
      ) : (
        <Link href="/" className="hidden items-center space-x-2 md:flex">
          <Home />
        </Link>
      )}
      {status === "authenticated" && !isWizard && items?.length ? (
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
