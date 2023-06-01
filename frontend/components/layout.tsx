import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/config/site";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <SiteHeader appName={siteConfig.name} />
      <main>{children}</main>
    </>
  );
}
