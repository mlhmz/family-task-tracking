import "@/styles/globals.css";

import { Metadata } from "next";
import { headers } from "next/dist/client/components/headers";

import { env } from "@/env.mjs";
import { Session } from "next-auth";

import { siteConfig } from "@/config/site";

import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";

import { SiteHeader } from "@/components/site-header";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme-provider";

import AuthContext from "./auth-context";
import AuthGuard from "./auth-guard";
import HouseholdContextProvider from "./household-context";
import ProfileContextProvider from "./profile-context";
import ProfilesContextProvider from "./profiles-context";
import QueryClientProvider from "./query-client";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

async function getSession(cookie: string): Promise<Session> {
  const response = await fetch(`${env.LOCAL_AUTH_URL}/api/auth/session`, {
    headers: {
      cookie,
    },
  });

  const session = await response.json();

  return Object.keys(session).length > 0 ? session : null;
}

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await getSession(headers().get("cookie") ?? "");

  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <QueryClientProvider>
              <div className="relative flex min-h-screen flex-col">
                <AuthContext session={session}>
                  <HouseholdContextProvider>
                    <ProfileContextProvider>
                      <ProfilesContextProvider>
                        <AuthGuard>
                          <SiteHeader />
                          <div className="flex-1">{children}</div>
                        </AuthGuard>
                      </ProfilesContextProvider>
                    </ProfileContextProvider>
                  </HouseholdContextProvider>
                </AuthContext>
              </div>
              <TailwindIndicator />
            </QueryClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
