import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { ThemeProvider } from "@/components/theme-provider";

import AuthContext from "./auth-context";
import AuthGuard from "./auth-guard";
import HouseholdContextProvider from "./household-context";
import ProfileContextProvider from "./profile-context";
import ProfilesContextProvider from "./profiles-context";
import QueryClientProvider from "./query-client";

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider>
          <ReactQueryDevtools initialIsOpen={false} />
          <div className="relative flex min-h-screen flex-col">
            <AuthContext>
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
