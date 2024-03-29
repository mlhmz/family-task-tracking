"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useSession } from "next-auth/react";

import { NavItem } from "@/types/nav";
import { PermissionType } from "@/types/permission-type";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { useProfile } from "@/app/hooks/fetch/use-profile";

import { MobileNav } from "./mobile-nav";

const Home = ({ appName }: { appName: string }) => {
  return (
    <>
      <Icons.home className="h-6 w-6" />
      <span className="hidden text-xl font-bold sm:inline-block">{appName}</span>
    </>
  );
};

interface MainNavProps {
  appName: string;
  items?: NavItem[];
}

export const MainNav = ({ appName, items }: MainNavProps) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { status } = useSession();
  const { data: profile } = useProfile();
  const pathname = usePathname();
  const isWizard = pathname.match("/wizard.*");

  const filteredItems = useMemo(() => {
    if (!items) return [];
    return items.filter((item) => !item.privilegedOnly || profile?.permissionType === PermissionType.Admin);
  }, [items, profile]);

  return (
    <div className="flex gap-6 md:gap-10">
      {isWizard ? (
        <div className="hidden items-center space-x-2 md:flex">
          <Home appName={appName} />
        </div>
      ) : (
        <Link href="/" className="hidden items-center space-x-2 md:flex">
          <Home appName={appName} />
        </Link>
      )}
      {status === "authenticated" && !isWizard && filteredItems?.length ? (
        <nav className="hidden gap-6 md:flex">
          {filteredItems?.map(
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
      <button
        className="flex items-center space-x-2 md:hidden"
        onClick={() => setShowMobileMenu(!showMobileMenu)}>
        {showMobileMenu ? <Icons.x /> : <Icons.logo />}
        <span className="font-bold">Menu</span>
      </button>
      {showMobileMenu && filteredItems && <MobileNav items={filteredItems} />}
    </div>
  );
};
