import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Session } from "next-auth";

import { ThemeProvider } from "@/components/theme-provider";

import AuthContext from "./auth-context";
import AuthGuard from "./auth-guard";
import HouseholdContextProvider from "./household-context";
import ProfileContextProvider from "./profile-context";
import ProfilesContextProvider from "./profiles-context";
import QueryClientProvider from "./query-client";

interface ProvidersProps {
  children: React.ReactNode;
  session: Session;
}

export const Providers = ({ session, children }: ProvidersProps) => {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider>
          <ReactQueryDevtools initialIsOpen={false} />
          <div className="relative flex min-h-screen flex-col">
            <AuthContext session={session}>
              <HouseholdContextProvider>
                <ProfileContextProvider>
                  <ProfilesContextProvider>
                    <AuthGuard>{children}</AuthGuard>
                  </ProfilesContextProvider>
                </ProfileContextProvider>
              </HouseholdContextProvider>
            </AuthContext>
          </div>
        </QueryClientProvider>
      </ThemeProvider>
    </>
  );
};
